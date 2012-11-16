# The WSGI entry-point for App Engine Console
#


import os
import re
import sys
import code
import logging

from os.path import join, dirname
sys.path.insert(0, dirname(__file__))
sys.path.insert(0, dirname(dirname(__file__)))

import util
import controller

from google.appengine.ext import webapp

debug = util.is_dev()
app = webapp.WSGIApplication([
    ('/'                  , controller.Root),
    ('/console/dashboard/', controller.Dashboard),
    ('/console/help.*'    , controller.Help),
    ('/console/statement' , controller.Statement),
    ('/console/banner'    , controller.Banner),
    ('/console.*'         , controller.Console),
], debug=debug)


