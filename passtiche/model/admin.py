import logging
import time, datetime
from model.base import BaseModel
from google.appengine.ext import db
from model.util import properties

class LogMessage(BaseModel):
    #
    msg = db.StringProperty(required=False) # hidden to users?    
    msg_type = db.StringProperty(required=False)