import logging
import time, datetime
from model.activity import Location
from google.appengine.ext import db
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os


class FindLocation(object):

	def __init__(self, *args):
		pass

	def find(self, query=None, create='true'):

		self.query, self.create = query, create

		if self.create == 'true':
			self.create = True
		else: # you must manually set create to something besides true 
			self.create = False

		if query:
			logging.info('query for FindLocation ' + query)
			from backend.location.update import get_loc_code


			# this is very imprecise! actual search is needed

			name = query.strip() # sanitize...
			loc_code = get_loc_code(name)
			loc = Location.get_by_key_name(loc_code)
			if loc:
				logging.info('found location %s in db' % loc_code)
			if not loc and self.create:
				logging.info('creating new location for %s' % loc_code)
				from backend.location.update import LocationUpdate
				loc_updater = LocationUpdate()
				loc = loc_updater.create_or_update(name=name, code=loc_code) # a lot of other fields...
			
			return loc # hasn't saved

		locs = Location.all().fetch(1000)
		return locs	

