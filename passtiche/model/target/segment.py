import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from advertiser import Advertiser

class AudienceSegment(BaseModel):
    """ Retail product (eBook title)

	TODO: Is there a segment made for all activity? (denormalized)

    """ 

    # advertiser
    advertiser = db.ReferenceProperty(Advertiser, required=False, collection_name='segments')

    name = db.StringProperty(required=False)  
    all_activity = db.BooleanProperty(default=False)
    tags = model.util.properties.PickledProperty(default=[])
    # in the future this will have to  
    description = db.TextProperty(required=False)
    # TODO: more information

