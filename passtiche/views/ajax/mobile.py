from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
from google.appengine.api import urlfetch

from backend.user import auth
from google.appengine.ext.deferred import deferred
from utils import gae as gae_utils
try:    
    import json
except:
    from django.utils import simplejson as json
    

from views.ajax.index import AjaxHandler

class UploadScreenshot(AjaxHandler):

    def get(self):
        self.write('hi')
        return
        