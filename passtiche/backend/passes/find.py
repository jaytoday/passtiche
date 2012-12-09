import logging
import time, datetime
from model.passes import PassTemplate, PassList
from google.appengine.ext import db
from google.appengine.api import search
from utils.cache import cache
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os, string

_INDEX_NAME = 'pass'
_ENCODE_TRANS_TABLE = string.maketrans('-: .@', '_____')

class FindPass(object):

	def __init__(self, *args):
		pass

	def find(self, query=None, order='-modified', create='true', fetch=1000, passes=None, account=None, **kwargs):
		logging.info('finding passes')

		self.user = kwargs.get('user')

		self.query, self.order, self.create, self.fetch, self.passes, self.account = query, order, create, fetch, passes, account

		if self.create == 'true':
			self.create = True
		else: # you must manually set create to something besides true 
			self.create = False

		if self.passes:
			return self.find_for_list()

		if query:
			logging.info('finding pass for query %s' % query)
			return self.find_pass({ 'name': query })
			
		qry = PassTemplate.all()

		if account:
			# account should be key name 
			from model.user import User
			self.user = User.get_by_key_name(account)

		if self.user and not self.user.is_admin():
			logging.info('filtering for ownership by %s' % self.user.key().name())
			qry = qry.filter('owner', self.user)


		if order:
			qry = qry.order(order)
		pass_templates = qry.fetch(fetch)
		logging.info('found pass templates: %s' % [pt.key().name() for pt in pass_templates])
		return pass_templates	

	

	def find_pass(self, p, save=True):
		self.save = save

		from backend.location import find as loc_find	 
		

		logging.info('getting pass: %s' % p)

		if p.get('id'):
			logging.info('getting pass with ID %s' % p['id'])
			pass_template = PassTemplate.all().filter('short_code', p['id']).get()
			if pass_template:
				logging.info('found pass template')
				return pass_template
			else:
				raise ValueError(p['id'])
		

		if 'href' in p:
			# will search in update class
			return self.create_or_update(p)

		if 'loc' not in p:
			raise ValueError('loc')


		# first do search for pass name and location.
		# If no result, get location and create new pass 
		pass_template = None
		pass_results = self.search(p)
		if pass_results:
			pass_template_doc = pass_results[0]
			logging.info(pass_template_doc)
			for f in pass_template_doc.fields:
				logging.info(f.name)
				logging.info(f.value)

			pass_template = PassTemplate.get_by_key_name(pass_template_doc.fields[2].value)
			if not pass_template:
				logging.error('DID NOT GET PASS TEMPLATE FROM SEARCH RESULTS KEYNAME')

		if pass_template:
			logging.info('Found existing template for name %s and location %s' % (
				p.get('name'), p.get('location_code')))

			return pass_template

			# if description is included, should it update existing template?
		else:
			logging.info('no pass template. getting location')

			# first get location, then create new pass 

			location_finder = loc_find.FindLocation()
			pass_loc = location_finder.find(query=p.get('loc'), create='true')

			pass_loc.put() # TODO: optimize saves

			logging.info('got loc %s for pass %s' % (pass_loc.code, p))


			p['location_code'] = pass_loc.code
			p['location'] = pass_loc

			logging.info('Creating New Template. No template found for name %s and location %s' % (
				p.get('name'), p.get('location_code')))

			return self.create_or_update(p)


	def find_for_list(self):


		'''
		Possible values for each pass:
			loc, name
		'''
		passes = json.loads(self.passes)

		pass_templates = []

		for p in passes:
			pt = self.find_pass(p, save=True) # TODO: save list 
			pass_templates.append(pt)

		return pass_templates


	def create_or_update(self, p):
		from backend.passes import update as pass_update
		pass_updater = pass_update.PassUpdate()
		logging.info('Pass update kwargs: %s' % p)
		if self.user:
			p['user'] = self.user
		pass_template = pass_updater.create_or_update(**p)

		if self.save:
			pass_template.put() # optimize

		return pass_template


	def search(self, p):
		"""
			TODO: because foursquare changes location names, this could result in false negatives
			when using the original location name for a search.
		"""
		logging.info('searching for pass')
		# sort results by author descending
		expr_list = [search.SortExpression(
		    expression='name', default_value='',
		    direction=search.SortExpression.DESCENDING), 
		search.SortExpression(
		    expression='location_name', default_value='',
		    direction=search.SortExpression.DESCENDING)]

		if self.user:
			expr_list.append(search.SortExpression(
		    expression='owner', default_value='',
		    direction=search.SortExpression.DESCENDING))
		# construct the sort options 
		sort_opts = search.SortOptions(
		     expressions=expr_list)
		query_options = search.QueryOptions(
		    limit=3,
		    sort_options=sort_opts)
		query_string = 'name:"%s" location_name:"%s"' % (
				p.get('name',''), p['loc'])

		if self.user:
			query_string += ' owner:"%s"' % self.user.short_code
		query_obj = search.Query(query_string=query_string, options=query_options)
		results = search.Index(name=_INDEX_NAME).search(query=query_obj).results
		logging.info(results)
		return results

# TODO: force refresh after update
@cache(version_only=True) # set Falsclient = foursquare.Foursquare(client_id='YOUR_CLIENT_ID', client_secret='YOUR_CLIENT_SECRET')e once this is stable
def find_passes(**kwargs):
	pass_finder = FindPass()
	return pass_finder.find(**kwargs)




