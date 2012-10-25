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

	def create_or_update(self, name=None, slug=None, description=None, price=None, schedule=None, 
			neighborhood_name=None, location=None, price_rating=None, **kwargs):
		if not slug:
		    slug = PassTemplate.get_slug(name)
		keyname = slug
		if location:
			if 'code' in location:
				loc_code = location['code']
			else:
				loc_code = location['name'].lower().replace(' ','-')		    
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
		if price_rating:
			pass_template.price_rating = price_rating		
		if schedule:
			pass_template.schedule = schedule
			reset_starts_time(pass_template)
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
			if neighborhood_name:
				loc.neighborhood_name = neighborhood_name
			for f in ['website', 'yelp', 'phone', 'opentable','street_address']:
				if f in location:
					setattr(loc, f, location[f])


			loc.put()

			pass_template.location_code = loc.code
			pass_template.location_name = loc.name


		return pass_template	


def reset_starts_time(pass_template):
	starts = get_starts_time(pass_template.schedule)
	if starts:
		pass_template.starts = starts
	return pass_template 

weekday_ints = {
	'mon': 0,
	'tues': 1,
	'wed': 2,
	'thurs': 3,
	'fri': 4,
	'sat': 5,
	'sun': 6
}



def get_starts_time(schedule):
	""" TODO: local time! """
	if not schedule.get('times'):
		return None # no exact starting time
	starts_time_str = schedule['times'][0].get('starts').replace('am','AM').replace('pm','PM')
	if not starts_time_str:
		return None # no exact starting time
	if ':' not in starts_time_str:
		starts_time_str = starts_time_str.replace('AM',':00AM').replace('PM',':00PM')


	current_date = datetime.datetime.now()
	if schedule.get('date_range'):
		starts_date_str = schedule['date_range'].split(' -')[0]
		if starts_date_str == 'Everyday':
			starts_date_str = datetime.datetime.strftime(datetime.date.today() + datetime.timedelta(days=1), '%b %d')

		starts_time = datetime.datetime.strptime('%s %s %s' % (starts_date_str, current_date.year, starts_time_str), '%b %d %Y %I:%M%p')
		return starts_time

	if schedule['times'][0].get('weekday_range'):
		next_weekday_str = schedule['times'][0].get('weekday_range').split(' -')[0].lower()
		today = datetime.date.today()
		next_weekday = None
		while not next_weekday:
			today += datetime.timedelta(days=1)
			if today.weekday() == weekday_ints[next_weekday_str]:
				next_weekday = today

		starts_hour = int(starts_time_str.split(':')[0])
		if 'PM' in starts_time_str:
			starts_hour += 12

		starts_time = datetime.datetime(year=next_weekday.year,month=next_weekday.month,day=next_weekday.day,hour=starts_hour)
		return starts_time




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

