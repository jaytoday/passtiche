from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.api import images
import datetime, time
import logging
import zipfile
import StringIO
from utils.cache import cache
from utils import gae as gae_utils
from views.base import BaseHandler
from google.appengine.ext.deferred import deferred

try:    
    import json
except:
    from django.utils import simplejson as json
    
import compile_widget

THUMBNAIL_FILE_NAME = 'widget.wdgt/Default.png'

    
class BaseResourceHandler(BaseHandler):
    pass
    

        

class GalleryImage(BaseResourceHandler):
    
    def get(self, media_key=""):
        self.set_header('Content-Type','image/png') # TODO: use saved content_type
        #self.set_header("Expires", "Thu, 15 Apr 2050 20:00:00 GMT")
        media_image = get_media_image(media_key)
        logging.info('IMAGE: %s' % media_image)
        if media_image:
            self.write(media_image)
        else:
            raise ValueError


@cache()    
def get_media_image(media_key):
    if media_key:
        from model.widget import WidgetMedia
        widget_media = WidgetMedia.get(media_key)
        if widget_media:
            return str(widget_media.media_file)
        else:
            return None
    else:
        img_file = open('resources/thumbnail/2.jpg')
        return str(img_file.read())


    
class DownloadPass(BaseResourceHandler):

    def get(self, widget_key):
        
     