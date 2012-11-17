import logging
import time, datetime
from model.activity import Location
from google.appengine.ext import db
from google.appengine.api import search
try:
 
    import json
except:
    from django.utils import simplejson as json   
import os, string

_INDEX_NAME = 'loc'

def get_loc_code(name):
	return name.lower().replace(' ','-')
	
class LocationUpdate(object):

	def __init__(self):
		pass


	def create_or_update(self, name=None, code=None, phone=None, yelp=None, opentable=None, website=None, 
			neighborhood_name=None, street_address=None, region_name=None, region_code=None, **kwargs):

		if code:
			loc_code = code
		else:
			loc_code = get_loc_code(name)
		
		loc = Location.get_by_key_name(loc_code)
		if not loc:
			loc = Location(key_name=loc_code, code=loc_code, name=name)
			loc_doc = search.Document(fields=[search.TextField(name='name', value=name),
                search.TextField(name='code', value=loc_code),
                search.DateField(name='date', value=datetime.datetime.now().date())])
			logging.info('adding loc doc to index')
			search.Index(name=_INDEX_NAME).add(loc_doc)

			self.get_loc_info(loc)
		elif name:
				loc.name = name

		if phone is not None:
			loc.phone = phone
		if yelp is not None:
			loc.yelp = yelp
		if not loc.yelp:
			import urllib
			loc.yelp = 'http://www.yelp.com/search?find_desc=%s&find_loc=%s' % (
				urllib.quote_plus(loc.name), urllib.quote_plus(region_name or 'San Francisco'))

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

	def get_loc_info(self, loc):
		"""
			{   u'categories': [   {   u'icon': {   u'name': u'.png',
	                                        u'prefix': u'https://foursquare.com/img/categories/food/default_',
	                                        u'sizes': [32, 44, 64, 88, 256]},
			                           u'id': u'4bf58dd8d48988d153941735',
			                           u'name': u'Burrito Place',
			                           u'pluralName': u'Burrito Places',
			                           u'primary': True,
			                           u'shortName': u'Burritos'}],
			    u'contact': {   u'formattedPhone': u'(415) 824-7877',
			                    u'phone': u'4158247877'},
			    u'hereNow': {   u'count': 2,
			                    u'groups': [   {   u'count': 2,
			                                       u'items': [],
			                                       u'name': u'Other people here',
			                                       u'type': u'others'}]},
			    u'id': u'44ff5a91f964a520a5381fe3',
			    u'likes': {   u'count': 0, u'groups': []},
			    u'location': {   u'address': u'2779 Mission St.',
			                     u'cc': u'US',
			                     u'city': u'San Francisco',
			                     u'country': u'United States',
			                     u'crossStreet': u'at 24th St.',
			                     u'distance': 2503,
			                     u'lat': 37.75245543494872,
			                     u'lng': -122.41834491491318,
			                     u'postalCode': u'94110',
			                     u'state': u'CA'},
			    u'name': u'Taqueria El Farolito',
			    u'referralId': u'v-1353116149',
			    u'restricted': True,
			    u'specials': {   u'count': 0, u'items': []},
			    u'stats': {   u'checkinsCount': 10419, u'tipCount': 112, u'usersCount': 5971},
			    u'verified': False}
	    """
		import pprint
		pp = pprint.PrettyPrinter(indent=4)
		venues = foursquare_search(loc.name)

		from model.activity import LocationData
		loc_data = LocationData(code=loc.code)		
		loc_data.foursquare = venues
		logging.info('foursquare data: %s' % pp.pformat(venues[:3]))
		loc_data.put()

		for v in venues:
			# first check that there are checkins here
			REQUIRED_CHECKINS = 10
			if v.get('stats',{}).get('checkinsCount',0) < REQUIRED_CHECKINS:
				continue
			# TODO: check that this is the right place (name is similar...)

			loc.fsq_id = v.get('id')
			loc.fsq_checkins = v.get('stats',{}).get('checkinsCount',0)
			loc.categories = [c['name'] for c in v.get('categories')]
			# disabled name change for now since it breaks search
			#loc.name = v.get('name')
			if v.get('contact',{}).get('formattedPhone'):
				loc.phone = v['contact']['formattedPhone']
			if v.get('location',{}):
				if v['location'].get('address'):
					loc.street_address = v['location'].get('address')
				if v['location'].get('lat'):
					loc.lat, loc.lng = v['location'].get('lat'), v['location'].get('lng')

			return 		




def foursquare_search(query, near='San Francisco'):
	from lib import foursquare
	push_secret = 'NGFSOBAGZEXL02AZ440CSQNVZ2NSRURDNEOALD2JRD5FTQY3'
	client = foursquare.Foursquare(
		client_id='UR5G1U3BIGAJKZBW0YIEXY0AT0Z3IEOQECOOUTAVGFTQBNOG', 
		client_secret='QFEPRCNCP551A2WREOLGUW5RUC3GYUHSOE2DAD1DA3KCWWY2')
	search_params = {'query': query, 'near': near, 'radius': '50000', 'intent': 'browse'}

	response = client.venues.search(params=search_params)
	#logging.info('foursquare response: %s' % response)
	return response.get('venues',[])

