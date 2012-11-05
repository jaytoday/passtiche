from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.api.index import APIHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils


class FindList(APIHandler):

	def get(self, api_version):
		self.check_version(api_version)
		query = self.get_argument('query','')
		from backend.passlist import find
		list_finder = find.FindList()
		self.context['lists'] = list_finder.find()
		if self.get_argument('output','') == 'html':
			self.render("website/account/cms/list/list.html", **self.context)	


class UpdateList(APIHandler):

	def get(self):
		self.check_version(api_version)		
