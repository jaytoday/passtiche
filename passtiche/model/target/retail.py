import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User

class RetailProduct(BaseModel):
    """ Retail product (eBook title) """ 

    name = db.StringProperty(required=False)
    tag = db.StringProperty(required=False)
    # TODO: multiple tags?
    description = db.TextProperty(required=False)
    # TODO: more information


class RetailTag(BaseModel):
    """ Category (Medical, Programming) """ 
    # key name should be group_name
    name = db.StringProperty(required=False)
    description = db.TextProperty(required=False) 
    # used for segments	