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
			neighborhood_name=None, location=None, location_code=None, price_rating=None, **kwargs):
		if not slug:
		    slug = PassTemplate.get_slug(name)
		keyname = slug
		if location_code:    
			keyname += "-%s" % location_code

		logging.info('getting pass template %s' % keyname)
		pass_template = PassTemplate.get_by_key_name(keyname)
		if pass_template:
			logging.info('found pass template %s' % keyname)
		else:
			logging.info('creating new pass template')
			pass_template = PassTemplate(key_name=keyname, name=name, slug=slug)
			from utils import string as str_utils
			code = str_utils.genkey(length=4)
			pass_template.short_code = code
		pass_template.name = name

		if description:
		    pass_template.description = description
		if price:
			pass_template.price = price
		if price_rating is not None:
			pass_template.price_rating = price_rating	

		if schedule:

			pass_template.schedule = schedule

			pass_template = set_time_format(pass_template)
			
			# TODO: starts time
		if neighborhood_name:
			pass_template.neighborhood_name = neighborhood_name


		if location_code:
			from model.activity import Location
			loc = Location.get_by_key_name(location_code)
			pass_template.location_code = loc.code
			pass_template.location_name = loc.name



		return pass_template	



def set_time_format(pass_template):



	reset_starts_time(pass_template)
	return pass_template

def reset_starts_time(pass_template):
	starts, ends = get_times(pass_template.schedule)
	if starts:
		pass_template.starts = starts
	if ends:
		pass_template.ends = ends		
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



def set_daterange(start_time, end_time):
    """ converts longer strings into shorter strings """
    logging.info(start_time)
    logging.info(end_time)
    d = "%s" % start_time[:3].capitalize()
    if end_time:
        d += " - %s" % end_time[:3].capitalize()
    return d

def get_times(schedule):
	""" TODO: local time! """
	if not schedule.get('times'):
		return None, None # no exact starting time
	starts_time_str = schedule['times'][0].get('starts','').replace('am','AM').replace('pm','PM')
	ends_time_str = schedule['times'][0].get('ends','').replace('am','AM').replace('pm','PM')
	if not starts_time_str:
		return None, None # no exact starting time
	if ':' not in starts_time_str:
		starts_time_str = starts_time_str.replace('AM',':00AM').replace('PM',':00PM')


	current_date = datetime.datetime.now()


	# date_range is only for fixtures
	if schedule.get('date_range'):
		starts_date_str = schedule['date_range'].split(' -')[0]
		if starts_date_str == 'Everyday':
			starts_date_str = datetime.datetime.strftime(datetime.date.today() + datetime.timedelta(days=1), '%b %d')
		for i in range(10):
			logging.info(starts_date_str)
		starts_time = datetime.datetime.strptime('%s %s %s' % (starts_date_str, current_date.year, starts_time_str), '%b %d %Y %I:%M%p')
		return starts_time, None

	if schedule.get('starts') and not schedule.get('date_range'):

		# set the correct start and end datetimes!

		starts_time = datetime.datetime.strptime(schedule['starts'], '%B %d')
		starts_abbrev = datetime.datetime.strftime(starts_time, '%b %d')
		schedule['date_range'] =  starts_abbrev

		if schedule['ends']:
			ends_time = datetime.datetime.strptime(schedule['ends'], '%B %d')
			ends_abbrev = " - " 
			if len(schedule['ends']) > 3 and schedule['starts'][:4] != schedule['ends'][:4]:
				ends_abbrev += datetime.datetime.strftime(ends_time, '%b %d')
			else:
				ends_abbrev += datetime.datetime.strftime(ends_time, '%d')
			schedule['date_range'] +=  ends_abbrev
		

		# for API
		return starts_time, ends_time


	if schedule['times'][0].get('weekday_range'):
		# Find the next time that this day in the week will come up 
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

		return starts_time, None

	return None, None





