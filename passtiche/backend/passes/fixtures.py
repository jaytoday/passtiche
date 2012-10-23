import logging
import time, datetime
from model import passes, activity
from google.appengine.ext import db
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os

from backend.passes import update

class FixtureUpdate(object):
	def __init__(self, cls):
		self.cls  = cls

	def run(self):

		self.flush()
		self.update_region() 

		json_file = open('model/passes/fixtures.json').read()
		fixtures_json = json.loads(json_file)

		templates = []
		
		for pass_json in fixtures_json['passes'][::-1]:
		    updater = update.PassUpdate()
		    updated_template = updater.create_or_update(**pass_json)
		    templates.append(updated_template)
		    #dt.datetime.strptime('1985-04-12T23:20:50.52', '%Y-%m-%dT%H:%M:%S.%f')

		db.put(templates)

		lists = []
		for pass_list_json in fixtures_json['pass_lists']:
			updater = update.PassListUpdate()
			updated_list = updater.create_or_update(**pass_list_json)
			lists.append(updated_list)
		db.put(lists)



	def flush(self):

		up = passes.UserPass.all().fetch(5000)
		db.delete(up)
		pl = passes.PassList.all().fetch(5000)
		db.delete(pl)		
		pt = passes.PassTemplate.all().fetch(5000)
		db.delete(pt)
		ls = activity.Location.all().fetch(5000)
		db.delete(ls)

	def update_region(self):
		from model.activity import Region
		sf = Region.get_by_key_name('san-francisco')
		if not sf:
			sf = Region(key_name='san-francisco',code='san-francisco', name='San Francisco')
			sf.put()



	