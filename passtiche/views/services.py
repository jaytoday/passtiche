from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.base import BaseHandler, CookieHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils

from views.base import BaseHandler

from model.user import User


class FoursquareCallback(BaseHandler):
    def get(self):
        pass
        
class FoursquarePush(BaseHandler):
    def get(self):
        pass   
        
        
class APNS(BaseHandler):
    def get(self):
        pass                
