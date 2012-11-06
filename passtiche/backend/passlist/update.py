import logging
import time, datetime
from model.passes import PassList
from google.appengine.ext import db
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os


class PassListUpdate(object):

	def __init__(self):
		pass

	def create_or_update(self, name=None, passes=None):
		# TODO: passes should be both pass slug and location name/code
		code = name.lower().replace(' ','-')
		pass_list = PassList.get_by_key_name(code)
		if not pass_list:
			pass_list = PassList(key_name=code, code=code)
		pass_list.name = name
		pass_list.passes = passes
		pass_list.region_code = 'san-francisco'
		return pass_list
