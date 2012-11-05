from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.api.index import APIHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils


class PassHandler(APIHandler):

	def find_passes(self):
		query_args = {}
		for f in ['query', 'order']:
			if self.get_argument(f,''):
				query_args[f] = self.get_argument(f)
		from backend.passes import find
		self.context['passes'] = find.find_passes(**query_args)
		if self.get_argument('output','') == 'html':
			self.render("website/account/cms/pass/list.html", **self.context)	

class FindPass(PassHandler):

	def get(self, api_version):
		self.check_version(api_version)
		self.find_passes()
		

class UpdatePass(PassHandler):

	def get(self, api_version):
		self.check_version(api_version)	

		pass_dict = {
			'name': self.get_argument('name',''),
			'slug': self.get_argument('slug',''),
			'description': self.get_argument('description',''),
			'price': self.get_argument('price',''),
			'price_rating': len(self.get_argument('price_rating','')),
			'neighborhood_name': self.get_argument('neighborhood_name',''),
			'location_code': self.get_argument('location_code',''),

			'schedule': {}						
		}



		for f in ['starts','ends','weekday_range','times']:
			pass_dict['schedule'][f] = self.get_argument(f,'')

		if pass_dict['schedule']['times']:
			pass_dict['schedule']['times'] = eval(pass_dict['schedule']['times'])
		else:
			pass_dict['schedule']['times'] = []

		for f in ['price','price_rating']:
			if pass_dict[f]:
				pass_dict[f] = int(pass_dict[f])

		from backend.passes import update
		updater = update.PassUpdate()		
		updated_template = updater.create_or_update(**pass_dict)
		db.put(updated_template)
		self.find_passes()	


