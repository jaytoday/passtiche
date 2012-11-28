import logging
import time, datetime
from model.activity import Location
from google.appengine.ext import db
from google.appengine.api import search
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os, string


_INDEX_NAME = 'loc'
_ENCODE_TRANS_TABLE = string.maketrans('-: .@', '_____')

class FindLocation(object):

	def __init__(self, *args):
		pass

	def find(self, query=None, create='true'):

		self.query, self.create = self.sanitize(query), create

		if self.create == 'true':
			self.create = True
		else: # you must manually set create to something besides true 
			self.create = False

		if query:
			logging.info('query for FindLocation ' + query)
			from backend.location.update import get_loc_code
			loc_code = get_loc_code(query)


			# this is very imprecise! actual search is needed
			loc = None
			loc_results = self.search()
			logging.info(loc_results)
			if loc_results:
				loc_doc = loc_results[0]
				for f in loc_doc.fields:
					logging.info(f.name)
					logging.info(f.value)				
				loc = Location.get_by_key_name(loc_doc.fields[1].value)

			if loc:
				logging.info('found location %s in db' % loc.code)
			if not loc and self.create:
				logging.info('creating new location for %s' % query)
				from backend.location.update import LocationUpdate
				loc_updater = LocationUpdate()
				loc = loc_updater.create_or_update(name=query, code=loc_code) # a lot of other fields...
			
			return loc # hasn't saved

		locs = Location.all().fetch(1000)
		return locs	

	def search(self):
		logging.info('searching for location')
		# sort results by author descending
		expr_list = [search.SortExpression(
		    expression='name', default_value='',
		    direction=search.SortExpression.DESCENDING)]
		# construct the sort options 
		sort_opts = search.SortOptions(
		     expressions=expr_list)
		query_options = search.QueryOptions(
		    limit=3,
		    sort_options=sort_opts)
		query_obj = search.Query(query_string='name:"%s"' % self.query, options=query_options)
		results = search.Index(name=_INDEX_NAME).search(query=query_obj).results
		return results 


	@classmethod
	def sanitize(cls, query):
		if query:
			return query.strip()

