import datetime, time
import logging
import os

try:    
    import json
except:
    from django.utils import simplejson as json

from google.appengine.api import users
from google.appengine.ext import db

from model.admin import LogMessage
from views.base import BaseHandler, CookieHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils
from ajax import AjaxHandler

class CronHandler(AjaxHandler):
    
    def get(self, **params):
        if 'script_name' in params and 'package_name' in params:
            try:
                mod = __import__('scripts.'+params['package_name']+'.'+params['script_name'], fromlist=[params['script_name']])
                result = mod.main()
                response = {}
                if result and type(result) is dict:
                    response = result
                elif result:
                    response = {'status':200,'message':'SUCCESS','description':str(result)}
                else:
                    response = {'status':200,'message':'SUCCESS','description':'No Result Description'}
                self.write(json.dumps(response))
                logging.info('CRON SUCCESS')
                logging.info('package_name: %s'%params['package_name'])
                logging.info('script_name: %s'%params['script_name'])
                logging.info('response: %s'%json.dumps(response))
            except:
                import sys
                response = {'status':500,'message':'ERROR','description':sys.exc_info()}
                self.write(json.dumps(response))
                logging.error('CRON FAILURE')
                logging.error('package_name: %s'%params['package_name'])
                logging.error('script_name: %s'%params['script_name'])
                logging.error('response: %s'%json.dumps(response))
                logging.info(sys.exc_info())
        else:
            logging.error('CRON FAILURE')
            logging.error('script_name & package_name not defined')
            self.write(json.dumps({'status':500,'message':'ERROR','description':'Cron Job Failure'}))
        return
