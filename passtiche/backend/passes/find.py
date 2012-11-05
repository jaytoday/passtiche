import logging
import time, datetime
from model.passes import PassTemplate, PassList
from google.appengine.ext import db
from utils.cache import cache
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os



class FindPass(object):

	def __init__(self, *args):
		pass

	def find(self, query=None, order='-modified', fetch=1000, **kwargs):
		logging.info('finding passes')
		if query:
			# todo: search
			pass
		qry = PassTemplate.all()
		if order:
			qry = qry.order(order)
		pass_templates = qry.fetch(fetch)
		return pass_templates	


@cache(version_only=True) # set False once this is stable
def find_passes(**kwargs):
	pass_finder = FindPass()
	return pass_finder.find(**kwargs)
