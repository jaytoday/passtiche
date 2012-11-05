from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.api.index import APIHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils


class FindLocation(APIHandler):

	def get(self, api_version):
		self.check_version(api_version)
		query = self.get_argument('query','')
		from backend.location import find
		loc_finder = find.FindLocation()
		self.context['locations'] = loc_finder.find()
		if self.get_argument('output','') == 'html':
			self.render("website/account/cms/location/list.html", **self.context)	


class UpdateLocation(APIHandler):

	def get(self):
		self.check_version(api_version)		
