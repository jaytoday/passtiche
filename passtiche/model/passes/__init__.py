#!/usr/bin/env python

import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User

THEME_CODES = {
    "birthday": "b",
    "christmas": "c",
    "romance": "r"
}

class PassTemplate(BaseModel):
    """ Template for a pass

    """ 


    owner = db.ReferenceProperty(User, required=False, collection_name='templates')

    name = db.StringProperty(required=True)  
    slug = db.StringProperty(required=False)  


    image_key = db.StringProperty(required=False)
    tags = model.util.properties.PickledProperty(default=[])

    requests = db.IntegerProperty(default=0)
    offers = db.IntegerProperty(default=0)
    # in the future this will have to  
    description = db.TextProperty(required=False)
    # TODO: more information


    @classmethod
    def create_or_update(cls, name, slug=None, tags=None, image_file=None, description=None,  owner=None):
        if not slug:
            slug = cls.get_slug(name)
        pass_template = cls.all().filter('slug', slug).get()
        if not pass_template:
            pass_template = cls(name=name, slug=slug)
        pass_template.name = name

        if description:
            pass_template.description = description
        if tags:
            pass_template.tags = tags
        if owner:
            pass_template.owner = owner
        if image_file:
            pass # TODO
        return pass_template

    @classmethod    
    def update_from_json(cls):
        try:    
            import json
        except:
            from django.utils import simplejson as json   
        import os

        json_file = open('model/passes/fixtures.json').read()
        fixtures_json = json.loads(json_file)

        templates = []
        for pass_template in fixtures_json['passes'][::-1]:
            updated_template = cls.create_or_update(pass_template['name'], slug=pass_template.get('slug'), tags=pass_template.get('tags'), 
                description=pass_template.get('description'))
            templates.append(updated_template)

        db.put(templates)




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



class UserPass(BaseModel):

    """ Customized pass
    """
    code = db.StringProperty()
    owner = db.ReferenceProperty(User)
    template = db.ReferenceProperty(PassTemplate, collection_name='user_passes')
    pass_name = db.StringProperty()
    pass_slug = db.StringProperty()
    pass_id = db.IntegerProperty()

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


