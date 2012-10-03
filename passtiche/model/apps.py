import logging
import time, datetime
from google.appengine.ext import db
from google.appengine.ext import blobstore
from model.base import BaseModel
from model.util import properties
from utils import gae as gae_utils

class app(BaseModel):
    """ Apple App Store App """
    app_id = db.IntegerProperty(required=True)
    name = db.StringProperty(required=False)
    description = db.TextProperty(required=False)
    category = db.StringProperty(required=False)
    img_url = db.LinkProperty(required=False)
    seller_name = db.StringProperty(required=False)  # denormalized
    price = db.FloatProperty(required=False)

    last_indexed = db.DateTimeProperty(required=False)

class appChart(BaseModel):
    """ An App Store Chart """
    name = db.StringProperty(required=True)
    url = db.StringProperty(required=True)
    description = db.StringProperty(required=False)
    last_indexed = db.DateTimeProperty(required=False)
