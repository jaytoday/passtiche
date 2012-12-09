from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.api.index import APIHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils

"""

TODO: Account param should have corresponding token, some inherited account auth method

"""

class PassHandler(APIHandler):

	def find_passes(self):
		query_args = { }
		for f in ['query', 'order', 'create', 'passes', 'account']:
			if self.get_argument(f,''):
				query_args[f] = self.get_argument(f)

		if self.get_argument('code',''):
			# TODO: it might be possible to do this without any User lookup, optimization
			from model.user import User
			query_args['user'] = User.all().filter('short_code', self.get_argument('code')).get()

		from backend.passes import find
		self.context['passes'] = find.find_passes(**query_args)
		if self.get_argument('output','') == 'html':
			self.render("website/account/cms/pass/list.html", **self.context)	
		else:
			self.write_json({'passes': [ self.pass_dict(p) for p in self.context['passes'] ]})
			return

	def pass_dict(self, p):
		return { 'name': p.name, 'short_code': p.short_code }

class FindPass(PassHandler):

	def get(self, api_version):
		self.check_version(api_version)
		self.find_passes()
		

class UpdatePass(PassHandler):

	def get(self, api_version):
		self.check_version(api_version)	

		pass_dict = self.flat_args_dict()
		pass_dict.update({
			'schedule': {}						
		})



		for f in ['starts','ends','weekday_range','times']:
			pass_dict['schedule'][f] = self.get_argument(f,'')

		if pass_dict['schedule']['times']:
			pass_dict['schedule']['times'] = eval(pass_dict['schedule']['times'])
		else:
			pass_dict['schedule']['times'] = []

		if pass_dict.get('price') not in [None,'']: # TODO: use float instead?
			pass_dict['price'] = int(pass_dict['price'].split('.')[0])
		if pass_dict.get('price_rating'):
			pass_dict['price_rating'] = len(pass_dict['price_rating'])
		


		if self.get_argument('code'):
			# TODO: it might be possible to do this without any User lookup, optimization
			from model.user import User
			pass_dict['user'] = User.all().filter('short_code', self.get_argument('code')).get()

		from backend.passes import update
		updater = update.PassUpdate()		
		updated_template = updater.create_or_update(**pass_dict)
		if self.get_argument('delete',''):
			db.delete(updated_template)
		else:
			db.put(updated_template)
		self.find_passes()	


