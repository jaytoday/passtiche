#!/usr/bin/env python

import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User


class PassTemplate(BaseModel):
    """ Template for a pass

    """ 


    owner = db.ReferenceProperty(User, required=False, collection_name='templates')

    name = db.StringProperty(required=False)  


    image_key = db.StringProperty(required=False)
    tags = model.util.properties.PickledProperty(default=[])

    requests = db.IntegerProperty(required=False)
    offers = db.IntegerProperty(required=False)
    # in the future this will have to  
    description = db.TextProperty(required=False)
    # TODO: more information




class PassImage(BaseModel):
    """ Customized pass
    """
    template = db.ReferenceProperty(PassTemplate, collection_name='images')
    image = db.BlobProperty()  
    # this is just for record keeping
    deleted = db.BooleanProperty(default=False)  	


class UserPass(BaseModel):
	""" Customized pass
	"""
	owner = db.ReferenceProperty(User)
	template = db.ReferenceProperty(PassTemplate, collection_name='user_passes')
	message = db.TextProperty()
	theme = db.StringProperty()

