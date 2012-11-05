import logging
import time, datetime
from model.passes import PassTemplate, PassList
from google.appengine.ext import db
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os


class FindList(object):

	def __init__(self, *args):
		pass

	def find(self, query=None):
		if query:
			# todo: search
			pass
		pass_lists = PassList.all().fetch(1000)
		return pass_lists	

