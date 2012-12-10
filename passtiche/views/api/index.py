from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.base import BaseHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils

class APIHandler(BaseHandler):
    
    def __init__(self, *args, **kwargs):
        
        super(APIHandler, self).__init__(*args, **kwargs)


    def check_version(self, api_version):
        api_version = float(api_version)
        if (api_version) == 1:
            pass
        else:
            raise ValueError("API Version")

        self.api_version = api_version


    def write_json(self, dict):
        # TODO: response codes, etc.
        self.set_header('Access-Control-Allow-Origin', '*')

        return super(APIHandler, self).write_json(dict)
