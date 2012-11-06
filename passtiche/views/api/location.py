from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.api.index import APIHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils


class LocHandler(APIHandler):
	
	def find_locations(self):
		query = self.get_argument('query','')
		from backend.location import find
		loc_finder = find.FindLocation()
		self.context['locations'] = loc_finder.find()
		if self.get_argument('output','') == 'html':
			self.render("website/account/cms/location/list.html", **self.context)	

class FindLocation(LocHandler):

	def get(self, api_version):
		self.check_version(api_version)
		self.find_locations()



class UpdateLocation(LocHandler):

	def get(self, api_version):
		self.check_version(api_version)	

		loc_dict = {}
		for f in ['name','code','phone','yelp','opentable','website','neighborhood_name','street_address','region_name', 'region_code']:
			if self.get_argument(f,''):
				loc_dict[f] = self.get_argument(f)
				if loc_dict[f] == ' ':
					loc_dict[f] = '' # b/c this is not None it can remove a set property


		from backend.location import update
		updater = update.LocationUpdate()		
		updated_location = updater.create_or_update(**loc_dict)
		if self.get_argument('delete',''):
			db.delete(updated_location)
		else:
			db.put(updated_location)

		self.find_locations()	
