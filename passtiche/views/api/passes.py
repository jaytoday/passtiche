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
			# this is only for account CMS
			self.render("website/account/cms/pass/list.html", **self.context)	
		else:
			response_json = {'passes': [ self.pass_dict(p) for p in self.context['passes'] ]}
			if self.get_argument('sdk'):
				self.ua_type()
				# include personalized dialog html - could possibly be cached for identical UAs
				response_json['dialog_html'] = self.render_string('resources/dialog/dialog.html', **self.context)
			self.write_json(response_json)
			return

	def pass_dict(self, p):
		response = { 
			'name': p.short_name(), 
			'short_code': p.short_code, 
			'img': p.img(),
			'description': p.display_description(),
		}
		if self.get_argument('sdk', ''):
			self.context['pass_template'] = p
			response['pass_details'] = self.render_string('resources/pass_details.html', **self.context)
		return response

	def ua_type(self):

		# if on iOS6 device, download pass
		if self.get_argument('dl',''):
		    self.context['ua_type'] = 'dl' 
		    return  

		self.context['ua_type'] = 'generic' 
		if self.context['ua_type'] == 'dl':
		    return
		ua = gae_utils.GetUserAgent()            
		if 'Mobile' in ua:
		    if ('iPhone' in ua or 'iPod' in ua) and 'AppleWebKit' in ua:
		        if 'OS 6_' in ua:
		            self.context['ua_type'] = 'dl'
		            return
		        # a previous iPhone version 
		        self.context['ua_type'] = 'upgrade_iOS'
		    # another mobile OS

		if 'Intel Mac' in ua:
		    if 'OS X 10_8' in ua:
		        if 'Safari' in ua and 'Chrome' not in ua:
		            # Safari on Mountain Lion
		            self.context['ua_type'] = 'dl'
		            return
		        # using Mountain Lion, not Safari
		        self.context['ua_type'] = 'mountain_lion'  
		        return
		    # using previous OS X
		    self.context['ua_type'] = 'upgrade_OSX'  



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

		# this could be deferred for extra put
		from backend.passes import push
		pass_pusher = push.PassPusher()
		pass_pusher.create(updated_template, self.get_argument('changeMessage',''))

		self.find_passes()	


