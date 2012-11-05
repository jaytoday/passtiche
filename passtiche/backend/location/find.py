import logging
import time, datetime
from model.activity import Location
from google.appengine.ext import db
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os


class FindLocation(object):

	def __init__(self, *args):
		pass

	def find(self, query=None):
		if query:
			# todo: search
			pass
		locs = Location.all().fetch(1000)
		return locs	

