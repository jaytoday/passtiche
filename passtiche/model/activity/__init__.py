#!/usr/bin/env python

import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User




class Region(BaseModel):
	# key name is code 
	code = db.StringProperty() # san-francisco
	name = db.StringProperty() # San Francisco
	

# TODO: Neighborhoods?

class Location(BaseModel):
	# key name is code 
	code = db.StringProperty() # davies-symphony-hall 
	name = db.StringProperty() # Davies Symphony Hall
	phone = db.StringProperty()	
	yelp = db.StringProperty()	
	opentable = db.StringProperty()	
	website = db.StringProperty()	
	neighborhood_name = db.StringProperty()	
	street_address = db.StringProperty()
	region_name = db.StringProperty() # San Francisco
	region_code = db.StringProperty() # san-francisco

	# TODO: coordinates, business information, phone number, website.....
	image_key = db.StringProperty(required=False)

	def get_region(self):
		return Region.get_by_key_name(self.region_code)
	




