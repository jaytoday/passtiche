#!/usr/bin/env python

import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User
from model import activity

THEME_CODES = {
    "birthday": "b",
    "christmas": "c",
    "romance": "r"
}

class PassTemplate(BaseModel):
    """ Activity template for a pass

    """ 
    # key-name is slug + "-" + location

    owner = db.ReferenceProperty(User, required=False, collection_name='templates')

    # these fields are for external passes
    url = db.StringProperty(required=False)
    organizationName = db.StringProperty(required=False)  
    pass_info = model.util.properties.PickledProperty(default={}) # full pass json object

    loc_info = model.util.properties.PickledProperty(default={}) # full pass json object

    name = db.StringProperty(required=False)  
    location_code = db.StringProperty()  
    location_name = db.StringProperty()
    
    slug = db.StringProperty(required=False)  
    short_code = db.StringProperty() # alphanumeric, used for short URL 

    starts = db.DateTimeProperty()
    ends = db.DateTimeProperty()
    schedule = model.util.properties.PickledProperty(default={})
    '''

    {  
       "date_range": "Nov 14 - 15th",
       "starts": "November 14",
       "ends": "November 15",

       "times": [{ "weekday_range": "Tuesday - Wednesday", starts": "7pm", "ends": "9pm" }]
    }

    '''
    repeats = db.BooleanProperty(required=False)
    neighborhood_name = db.StringProperty()
    price = db.IntegerProperty(required=False)
    price_rating = db.IntegerProperty(required=False) # number of dollars
    lower_price = db.IntegerProperty(required=False) # if present, price acts like a price range

    # TODO: new fields will need to be maintained for simple starting soon queries


    image_key = db.StringProperty(required=False)
    image_url = db.StringProperty(required=False)
    tags = model.util.properties.PickledProperty(default=[])

    saves = db.IntegerProperty(default=0)
    shares = db.IntegerProperty(default=0)
 
    description = db.TextProperty(required=False)
    # TODO: more information


    def full_name(self):
        if not self.location_name:
            if not self.name:
                return self.location_name
            return self.name
        return "%s at %s" % (self.name, self.location_name)

    def short_name(self):
        return self.name or self.location_name or 'Pass'

    def img(self):
        from utils.gae import base_url

        if self.image_key:
            return '%s/img/p/%s' % (base_url(), self.image_key)
        if self.image_url:
            return self.image_url
        import random
        return '%s/static/images/pass/default/%s.jpg' % (base_url(), random.randint(1,4))

    def display_price(self):
        if self.price_rating:
            return ''.join(["$" for r in range(self.price_rating)])
        if self.price:
            if self.lower_price:
                return "$%s - $%s" % (self.lower_price, self.price)
            return "$%s" % self.price
        elif self.price is 0:
            return "Free"
        return ""

    def display_date(self):
        # date range or weekday range
        if not self.schedule:
            return ""#return "Open Everyday"
        if 'date_range' in self.schedule:
            return self.schedule['date_range']
        return ', '.join([t['weekday_range'] for t in self.schedule['times'] if 'weekday_range' in t])

    def display_time(self):
        # date range or weekday range
        if not self.schedule or 'times' not in self.schedule:
            return ""
        times = []
        for time_info in self.schedule['times']:
            time_str = time_info["starts"]
            if "ends" in time_info:
                time_str += " - %s" % time_info['ends']
            times.append(time_str)
        return ", ".join(times)

    @classmethod    
    def update_from_json(cls):
        from backend.passes import fixtures
        fixture_update = fixtures.FixtureUpdate(cls)
        fixture_update.run()


    # TODO: cache? 
    def get_location(self, reset=False):
        if not self.location_code:
            return {}
        if (reset or not self.loc_info):
            logging.info('resetting location info for pass %s - this should not happen on Index requests!' % self.full_name())
            from model.activity import Location
            loc = Location.get_by_key_name(self.location_code)
            self.loc_info = loc.property_dict()
            self.put()
        return self.loc_info

    def pass_fields(self):
        if not self.pass_info:
            return {}
        for f in ['coupon', 'boardingPass', 'storeCard', 'eventTicket' 'generic']:
            if self.pass_info.get(f):
                return self.pass_info[f]
        return {}

    @classmethod
    def get_slug(cls, name):
        from utils.string import safe_slugify
        return safe_slugify(name)

    def display_description(self, limit=35):
        from utils.string import truncate_by_words_if_long
        s = self.description
        s = truncate_by_words_if_long(s, limit)
        return s




class PassImage(BaseModel):
    """ Customized pass image
    """
    template = db.ReferenceProperty(PassTemplate, collection_name='images')
    image = db.BlobProperty()  
    # this is just for record keeping
    deleted = db.BooleanProperty(default=False)  	


class PassList(BaseModel):
    # key name is code 
    code = db.StringProperty() # new-and-upcoming

    passes = db.ListProperty(str)
    name = db.StringProperty()

    owner = db.ReferenceProperty(User, required=False, collection_name='pass_lists')
    


    slug = db.StringProperty(required=False)  
    image_key = db.StringProperty(required=False)

    description = db.TextProperty(required=False)
    region_code = db.StringProperty() # san-francisco



class UserPass(BaseModel):

    """ Customized pass
    """
    code = db.StringProperty()
    owner = db.ReferenceProperty(User)
    template = db.ReferenceProperty(PassTemplate, collection_name='user_passes')
    pass_name = db.StringProperty()
    pass_code = db.StringProperty()

    to_email = db.StringProperty() 
    to_phone = db.StringProperty() 

    owner_name = db.StringProperty()
    owner_email = db.StringProperty() 

    message = db.TextProperty()
    action = db.StringProperty()
    theme = db.StringProperty()

    def url(self):
        link = 'http://passtiche.com/u/%s' % self.code
        return link

    def display_owner_name(self):
        return self.owner_name or 'Someone'



