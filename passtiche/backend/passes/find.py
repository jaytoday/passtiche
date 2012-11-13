import logging
import time, datetime
from model.passes import PassTemplate, PassList
from google.appengine.ext import db
from utils.cache import cache
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os



class FindPass(object):

	def __init__(self, *args):
		pass

	def find(self, query=None, order='-modified', create='true', fetch=1000, passes=None, **kwargs):
		logging.info('finding passes')

		self.query, self.order, self.create, self.fetch, self.passes = query, order, create, fetch, passes

		if self.create == 'true':
			self.create = True
		else: # you must manually set create to something besides true 
			self.create = False

		if self.passes:
			return self.find_for_list()

		if query:
			return self.find_pass({ 'name': query })
			
		qry = PassTemplate.all()
		if order:
			qry = qry.order(order)
		pass_templates = qry.fetch(fetch)
		return pass_templates	

	

	def find_pass(self, p, save=True):

		from backend.location import find as loc_find	 
		

		logging.info('getting pass: %s' % p)
		
		# first get or create location. 

		# if new location, definitely create, if not new, search for name and location and then create.

		# city is present but ignore it for now 

		# TODO: what to do if no loc? 

		# TODO: check for slug looking for an existing template

		location_finder = loc_find.FindLocation()

		pass_loc = location_finder.find(query=p.get('loc'), create='true')

		pass_loc.put() # TODO: optimize saves

		logging.info('got loc %s for pass %s' % (pass_loc.code, p))


		p['location_code'] = pass_loc.code
		p['location'] = pass_loc

		pass_query = PassTemplate.all()
		
		pass_query = pass_query.filter('name', p.get('name',''))

		pass_query = pass_query.filter('location_code', p['location_code'])

		pass_template = pass_query.get()

		if pass_template:
			logging.info('Found existing template for name %s and location %s' % (
				p.get('name'), p.get('location_code')))

			# if description is included, should it update existing template?
		else:
			logging.info('Creating New Template. No template found for name %s and location %s' % (
				p.get('name'), p.get('location_code')))
			from backend.passes import update as pass_update
			pass_updater = pass_update.PassUpdate()
			logging.info('Pass update kwargs: %s' % p)
			pass_template = pass_updater.create_or_update(**p)

		if save:
			pass_template.put() # optimize

		return pass_template


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



@cache(version_only=True) # set False once this is stable
def find_passes(**kwargs):
	pass_finder = FindPass()
	return pass_finder.find(**kwargs)
