 
import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User
from advertiser import Advertiser




class EndUser(BaseModel):
	# key_name is user_id
    uid = db.StringProperty() 
    dnt = db.BooleanProperty() 

class UserDevice(BaseModel):

    uid = db.StringProperty() 
    ios_adid = db.StringProperty()
    full_ua = db.StringProperty() # user agent
    short_ua = db.StringProperty() # shortened user agent

