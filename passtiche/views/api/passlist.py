from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.api.index import APIHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils


class ListHandler(APIHandler):

	def find_lists(self):
		query = self.get_argument('query','')
		from backend.passlist import find
		list_finder = find.FindList()
		self.context['lists'] = list_finder.find()
		if self.get_argument('output','') == 'html':
			self.render("website/account/cms/list/list.html", **self.context)	

class FindList(ListHandler):

	def get(self, api_version):
		self.check_version(api_version)
		self.find_lists()



class UpdateList(ListHandler):

	def get(self, api_version):
		self.check_version(api_version)	
		list_dict = {}	
		for f in ['name','passes']:
			if self.get_argument(f,''):
				list_dict[f] = self.get_argument(f)


		import re
		# remove extra spaces
		list_dict['passes'] = re.sub(' +',' ', list_dict['passes'])
		list_dict['passes'] = [ p for p in list_dict['passes'].split(' ') if p ]

		from backend.passlist import update
		updater = update.PassListUpdate()		
		updated_list = updater.create_or_update(**list_dict)
		if self.get_argument('delete',''):
			db.delete(updated_list)
		else:
			db.put(updated_list)

		self.find_lists()
