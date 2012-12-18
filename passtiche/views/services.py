from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.base import BaseHandler, CookieHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils

from views.base import BaseHandler

from model.user import User

AUTH_TOKEN = "e7f3f3f56a2a419dad2f639c5af4858b" 

class FoursquareCallback(BaseHandler):
    def get(self):
        pass
        
class FoursquarePush(BaseHandler):
    def get(self):
        pass   
        
        
class PassbookRegister(BaseHandler):
	"""
	The Authorization header is supplied; its value is the word "ApplePass", 
	followed by a space, followed by the pass's authorization token as specified in the pass.

	If already registered, status 200. if successful, status 201. 
	POST payload pushToken - The push token that the server can use to send push notifications to this device.
	"""
	def get(self):
		logging.info('received passbook register request')            
		from backend.admin import send_admin_email 
		from google.appengine.ext.deferred import deferred
		deferred.defer(send_admin_email, 
		        subject='Passbook Web Service Register', 
		        message='Arguments: %s' % self.request.arguments)

	def delete(self):
		logging.info('received DELETE passbook web service request')
		authenticationToken = "e7f3f3f56a2a419dad2f639c5af4858b"             
		from backend.admin import send_admin_email 
		from google.appengine.ext.deferred import deferred
		auth_token = None
		deferred.defer(send_admin_email, 
		        subject='Passbook Web Service Unregister - %s' % auth_token, 
		        message='Arguments: %s' % self.request.arguments)


class PassbookGetSerials(BaseHandler):
	"""
	lastUpdated (string)- The current modification tag.

	serialNumbers (array of strings) - The serial numbers of the matching passes.
	"""

	def get(self):
		logging.info('received passbook get serials request')            
		from backend.admin import send_admin_email 
		from google.appengine.ext.deferred import deferred
		deferred.defer(send_admin_email, 
		        subject='Passbook Web Service Get Serials', 
		        message='Arguments: %s' % self.request.arguments)

class PassbookGetPass(BaseHandler):
    def get(self):
    	logging.info('received passbook get pass request')            
        from backend.admin import send_admin_email 
        from google.appengine.ext.deferred import deferred
        deferred.defer(send_admin_email, 
                subject='Passbook Web Service Get Pass' , 
                message='Arguments: %s' % self.request.arguments)


class PassbookLog(BaseHandler):
	""" payload - logs is key """
	def get(self):
		logging.info('received passbook log request')            
		from backend.admin import send_admin_email 
		from google.appengine.ext.deferred import deferred
		deferred.defer(send_admin_email, 
		        subject='Passbook Web Service Log' , 
		        message='Arguments: %s' % self.request.arguments)        

