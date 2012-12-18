#!/usr/bin/env python

import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User

from model.passes import PassTemplate

class PassPush(BaseModel):
    """ push for a pass """
    template = db.ReferenceProperty(PassTemplate, collection_name='pushes')
    changeMessage = db.StringProperty() # change message
    pushtime = db.DateTimeProperty()

    sent = db.BooleanProperty(default=False)




