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

    name = db.StringProperty(required=True)  
    location_code = db.StringProperty()  
    location_name = db.StringProperty()
    
    slug = db.StringProperty(required=False)  
    short_code = db.StringProperty() # alphanumeric, used for short URL 

    schedule = model.util.properties.PickledProperty(default={})
    '''

    {  
       "date_range": "November 14 - 15th",
       "starts": "November 14",
       "ends": "November 15",

       "times": [{ "starts": "7pm", "ends": "9pm" }]
    }

    '''
    repeats = db.BooleanProperty(required=False)
    neighborhood_name = db.StringProperty()
    price = db.IntegerProperty(required=False)
    price_rating = db.IntegerProperty(required=False) # number of dollars
    lower_price = db.IntegerProperty(required=False) # if present, price acts like a price range

    # TODO: new fields will need to be maintained for simple starting soon queries


    image_key = db.StringProperty(required=False)
    tags = model.util.properties.PickledProperty(default=[])

    saves = db.IntegerProperty(default=0)
    shares = db.IntegerProperty(default=0)
    # in the future this will have to  
    description = db.TextProperty(required=False)
    # TODO: more information


    def full_name(self):
        if not self.location_name:
            return self.name
        return "%s at %s" % (self.name, self.location_name)
    @classmethod    
    def update_from_json(cls):
        from backend.passes import fixtures
        fixture_update = fixtures.FixtureUpdate(cls)
        fixture_update.run()




    @classmethod
    def get_slug(cls, name):
        from utils.string import safe_slugify
        return safe_slugify(name)




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


class SentUserPass(BaseModel):
    user_pass = db.ReferenceProperty(UserPass, collection_name='sent_passes')
    to_email = db.StringProperty() 
    # other info - FB, etc. 


