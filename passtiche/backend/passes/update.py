import logging
import time, datetime
from model.passes import PassTemplate, PassList
from google.appengine.ext import db
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os


class PassUpdate(object):

	def __init__(self):
		pass

	def create_or_update(self, name=None, slug=None, description=None, price=None, schedule=None, neighborhood_name=None, location=None):
		if not slug:
		    slug = PassTemplate.get_slug(name)
		keyname = slug
		if location:
			loc_code = loc_code = location['name'].lower().replace(' ','-')		    
			keyname += "-%s" % loc_code
		pass_template = PassTemplate.get_by_key_name(keyname)
		if not pass_template:
		    pass_template = PassTemplate(key_name=keyname, name=name, slug=slug)
		    from utils import string as str_utils
		    code = str_utils.genkey(length=4)
		    pass_template.short_code = code
		pass_template.name = name

		if description:
		    pass_template.description = description
		if price:
			pass_template.price = price
		if schedule:
			pass_template.schedule = schedule
			# TODO: starts time
		if neighborhood_name:
			pass_template.neighborhood_name = neighborhood_name

		if location:
			from model.activity import Location

			loc = Location.get_by_key_name(keyname)
			if not loc:
				loc = Location(key_name=loc_code, code=loc_code)
				loc.region_name = 'San Francisco'
				loc.region_code = 'san-francisco'
			
			loc.name = location['name']
			if location['website']:
				loc.website = location['website']
			if location['yelp']:
				loc.yelp = location['yelp']
			if location['phone']:
				loc.phone = location['phone']



			loc.put()

			pass_template.location_code = loc.code
			pass_template.location_name = loc.name


		return pass_template	



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

