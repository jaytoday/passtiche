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
    

THUMBNAIL_FILE_NAME = 'widget.wdgt/Default.png'


# use  Cache-Control 

def get_package(typ, package):
    ''' combine script/css file content '''

    contents = ""
    for file_name in package:
        file_path = os.path.join(root_dir, file_name)

        _, file_contents = get_file(file_path)

        contents += file_contents + "\n"

    if typ == 'js':
        contents = process_javascript(contents)

    return (hashlib.sha1(contents).hexdigest(), contents)


def get_data_url(fp):
    _, ext = os.path.splitext(fp)
    encoded = ""
    with open(fp, "rb") as handle:
        encoded = base64.standard_b64encode(handle.read())
    return "data:" + mime[ext] + ";base64," + encoded


    
class BaseResourceHandler(BaseHandler):
    pass
    

        

class PassImageHandler(BaseResourceHandler):
    
    def get(self, media_key=""):
        self.set_header('Content-Type','image/png') # TODO: use saved content_type
        #self.set_header("Expires", "Thu, 15 Apr 2050 20:00:00 GMT")
        media_image = get_media_image(media_key)
        #logging.info('IMAGE: %s' % media_image)
        if media_image:
            self.write(media_image)
        else:
            raise ValueError


class StaticResourceHandler(BaseResourceHandler):

    # TODO: handle compression
    
    def get(self, resource_key):
        if resource_key.endswith('.css'):
            self.set_header('Content-Type','text/css') 
        if resource_key.endswith('.js'):
            self.set_header('Content-Type','text/javascript')             
        
        from views.base import static_page
        self.write(static_page(template_file="resources/%s" % resource_key))
        return






@cache()    
def get_media_image(media_key):
    from model.passes import PassImage
    pass_img = PassImage.get(media_key)
    if pass_img:
        return str(pass_img.image)
    else:
        return None



    
class DownloadPass(BaseResourceHandler):

    def get(self, widget_key):
        pass
        
     