import logging
import time, datetime
from model.activity import Location
from google.appengine.ext import db
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os


class LocationUpdate(object):

	def __init__(self):
		pass


	def create_or_update(self, name=None, code=None, phone=None, yelp=None, opentable=None, website=None, 
			neighborhood_name=None, street_address=None, region_name=None, region_code=None, **kwargs):

		if code:
			loc_code = code
		else:
			loc_code = name.lower().replace(' ','-')
		
		loc = Location.get_by_key_name(loc_code)
		if not loc:
			loc = Location(key_name=loc_code, code=loc_code)

		loc.name = name

		if phone is not None:
			loc.phone = phone
		if yelp is not None:
			loc.yelp = yelp
		if opentable is not None:
			loc.opentable = opentable
		if website is not None:
			loc.website = website
		if neighborhood_name is not None:
			loc.neighborhood_name = neighborhood_name
		if street_address is not None:
			loc.street_address = street_address		
		if region_name is not None:
			loc.region_name = region_name		
		if region_code is not None:
			loc.region_code = region_code

		return loc	

