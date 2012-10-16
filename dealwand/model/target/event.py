 
import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User
from advertiser import Advertiser



    # other info

   
class TrackingEvent(BaseModel):
    advertiser = db.ReferenceProperty(Advertiser, required=False, collection_name='events')
    # TODO: project
    # just a shortcut lookup
    event = db.StringProperty()
    conversion = db.StringProperty() # disabled, enabled
    tags = model.util.properties.PickledProperty(default=[]) # medical, web_programming
    uid = db.StringProperty() # Hiptype UID
    # other info can be added using Expando properties (or custom dict property)

    

# TODO: item for each event 




class AdvertiserEventStats(object):

	def __init__(self):
		pass

	def get(self):
		pass