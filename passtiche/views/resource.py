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
    

class Infographic(BaseHandler):
    
    def get(self):
        self.set_header('Content-Type','image/png')
        img_file = open('resources/images/hiptype_infographic.png')
        self.write(str(img_file.read()))        
        return

class BookDownload(BaseHandler):
    
    def get(self, book_name):
        self.redirect('/static/books/%s.ibooks' % book_name)
        return

class DataDump(BaseResourceHandler):
    def get(self):
        
        self.set_header('Content-Type','application/json') # TODO: use saved content_type
        from backend.fixtures import DataDump
        data_dump = DataDump()
        response = { "results": data_dump.results() }
        self.write(json.dumps(response))
        
        
        

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


class FileDownload(BaseResourceHandler):
    
    def get(self, media_key=""):
         # TODO: use saved content_type
        #self.set_header("Expires", "Thu, 15 Apr 2050 20:00:00 GMT")
        from model.widget import WidgetMedia
        widget_media = WidgetMedia.get(media_key)
        self.set_header('Content-Type',widget_media.content_type)
        self.set_header('Content-Disposition', 'attachment; filename="%s"' % widget_media.filename)
        self.write(str(widget_media.media_file))
        
        
        
class ThumbnailImage(BaseResourceHandler):
    
    def get(self, media_key=""):
        self.set_header('Content-Type','image/png')
        #self.set_header("Expires", "Thu, 15 Apr 2050 20:00:00 GMT")
        media_image = get_thumbnail_image(media_key)
        if media_image:
            self.write(media_image)
        else:
            raise ValueError
        
        
@cache()    
def get_thumbnail_image(media_key):
    if media_key:
        from model.widget import WidgetThumbnail
        widget_media = WidgetThumbnail.get(media_key)
        if widget_media:
            return str(widget_media.image)
        else:
            return None
    else:
        img_file = open('resources/thumbnail/1.png')
        return str(img_file.read())        

class BookImage(BaseResourceHandler):
    
    def get(self, media_key=""):
        self.set_header('Content-Type','image/png')
        #self.set_header("Expires", "Thu, 15 Apr 2050 20:00:00 GMT")
        media_image = get_book_image(media_key)
        if media_image:
            self.write(media_image)
        else:
            raise ValueError
        
        
@cache()    
def get_book_image(media_key):
    if media_key:
        from model.book import BookThumbnail
        book_media = BookThumbnail.get(media_key)
        if book_media:
            return str(book_media.image)
        else:
            return None
    else:
        img_file = open('resources/thumbnail/1.png')
        return str(img_file.read())        

    
class DownloadWidget(BaseResourceHandler):

    def get(self, widget_key):
        
        # start zip file 
        output = StringIO.StringIO()
        self.z = zipfile.ZipFile(output, mode='w', compression=zipfile.ZIP_DEFLATED)
        
        from model.widget import Widget
        self.widget = Widget.get(widget_key)
        
        book = self.widget.book
        # alert the authorities
        from backend.admin import send_admin_email
        user = self.get_current_user()
        if user: 
            identifier = user.key().name()
        else:
            identifier = 'unknown user'
                 
        msg = 'Widget Download %s by %s' % (book.get_name(), identifier)
        deferred.defer(send_admin_email, subject=msg, message=msg, user_agent=gae_utils.GetUserAgent())  
                
        
        """ Static Portions """

        # add readme.txt
        self.z.write('resources/README.md', 'readme.txt')
        
        # Add Default.png
        # TODO: this should be a fxn
        
        widget_media = None
        if self.widget.thumbnail_key:
            from model.widget import WidgetThumbnail
            widget_media = WidgetThumbnail.get(self.widget.thumbnail_key)
        elif self.widget.media_info:
            from model.widget import WidgetMedia
            widget_media = WidgetMedia.get(self.widget.media_info[0]['key'])

        if widget_media:
            try:
                # TODO: expand canvas size with transaparency for images with
                # unusual dimensions
                image_file = gae_utils.rescale(widget_media.image, 1024, 768)
                self.write_img(image_file._image_data, THUMBNAIL_FILE_NAME)
                self.write_img(image_file._image_data, 'widget.wdgt/loading.png')
            except ImportError, SystemError: #NotImplementedError
                # raise error if on production, otherwise it is PIL error
                logging.error(gae_utils.error_msg())
                self.write_img(widget_media.image, THUMBNAIL_FILE_NAME)
                self.write_img(widget_media.image, 'widget.wdgt/loading.png')
        else: 
            if self.widget.thumbnail:
                thumbnail = '%s' % self.widget.thumbnail # custom choice
            
            else:
                thumbnail = self.widget.thumbnail_url(filename=True)
            
            self.z.write('resources/thumbnail/%s.png' % thumbnail, THUMBNAIL_FILE_NAME)
            self.z.write('resources/thumbnail/%s.png' % thumbnail, 'widget.wdgt/images/loading.png')

        # loading screens
        #self.z.write('resources/images/loading.jpg', 'widget.wdgt/loading.jpg')
        
        # add style.css - the resource location might depend on the type of widget
        #self.z.write('resources/%s.css' % 'gallery', 'widget.wdgt/style.css')
        self.z.write('resources/css/widget_frame.css', 'widget.wdgt/css/widget_frame.css')        
        self.z.write('resources/css/bootstrap.min.css', 'widget.wdgt/css/bootstrap.min.css')
        self.z.write('resources/js/jquery.1.7.1.min.js', 'widget.wdgt/js/jquery.1.7.1.min.js')
        self.z.write('resources/js/blowfish.js', 'widget.wdgt/js/bf.js')
        self.z.write('resources/js/turn.js', 'widget.wdgt/js/turn.js')
        self.z.write('resources/js/bootstrap.min.js', 'widget.wdgt/js/bootstrap.min.js')
        self.z.write('resources/fonts/museo_slab_500-webfont.ttf', 'widget.wdgt/fonts/museo_slab_500-webfont.ttf')
        self.z.write('resources/fonts/fontawesome-webfont.ttf', 'widget.wdgt/fonts/fontawesome-webfont.ttf')
        self.z.write('resources/images/book_bg.jpg', 'widget.wdgt/images/book_bg.jpg')
        self.z.write('resources/images/bookclub.png', 'widget.wdgt/images/bookclub.png')
        self.z.write('resources/images/logo_no_text.png', 'widget.wdgt/images/logo_no_text.png')

        """ Dynamic Portions """
        firebug = self.get_argument("firebug", False)
        if firebug is not False:
            firebug = True
        
        # write Info.plst
        self.write_info_plst()

        # write main.html
        self.write_html(firebug)
        
        if firebug is True:
            import os
            self.z.write('resources/js/firebug-lite-debug.js', 'widget.wdgt/js/firebug-lite-debug.js')
            source_directory = 'resources/firebug_skin/xp'
            dest_directory = 'widget.wdgt/skin/xp'
            for item in os.listdir(source_directory):
                if os.path.isfile(os.path.join(source_directory, item)):
                    self.z.write(os.path.join(source_directory, item), os.path.join(dest_directory, item))
        
        # write manifest.json
        #self.write_manifest()
		
        # write main.js
        # write js/script.js
        #self.write_js()



        self.z.close()
        output.seek(0) 

        self.set_header("Content-Type", "multipart/x-zip")
        # TODO: strip any punctuation, etc.
        from utils.string import remove_punctuation
        if firebug is True:
            self.set_header('Content-Disposition', "attachment; filename=hiptype_%s_firebug.zip" % remove_punctuation(self.widget.get_name().lower().replace(' ','')))
        else:
            self.set_header('Content-Disposition', "attachment; filename=hiptype_ibook_widget.zip")
        #self.write(output.read())
        #return
        while True:
            buf=output.read(2048)
            if buf=="": 
                break
            self.write(buf)
        output.close()    
        
    
    def write_info_plst(self):
        file_str = StringIO.StringIO(compile_widget.compile_plst(self.widget))
        zi = zipfile.ZipInfo(str("widget.wdgt/Info.plist"), time.localtime(time.time()))
        zi.external_attr = 0777 << 16L         
        self.z.writestr(zi, str(file_str.read()))
        file_str.close()
    
    def write_html(self, firebug=False):
        return
        file_str = StringIO.StringIO(compile_widget.compile_main_html(self, firebug))
        #logging.info(compile_widget.compile_main_html(self))
        zi = zipfile.ZipInfo("widget.wdgt/_.wdgt", time.localtime(time.time()))
        zi.external_attr = 0777 << 16L         
        self.z.writestr(zi, str(file_str.read()))
        file_str.close()

    def write_js(self):
        file_str = StringIO.StringIO(compile_widget.compile_main_js(self.widget))
        zi = zipfile.ZipInfo(str("widget.wdgt/main.js"), time.localtime(time.time()))
        zi.external_attr = 0777 << 16L         
        self.z.writestr(zi, str(file_str.read()))
        file_str.close()                    

    def resize_img(self):
       # TODO: absolute resizing
       for icon_size in (128, 48, 32, 16):
           image_file = images.Image(image[0].get('body'))
           image_file.resize(icon_size, icon_size)
           image_file.execute_transforms(output_encoding=images.PNG)

    def write_img(self, img_blob, file_name):
       # store the contents in a stream
           
       #image_file = images.Image(img_blob)
       f=StringIO.StringIO(img_blob)#()
       length = len(img_blob)
       f.seek(0)         
       # write the contents to the zip file
       zi = zipfile.ZipInfo(file_name, time.localtime(time.time()))
       zi.external_attr = 0777 << 16L 
       while True:
           buff = f.read(int(length))
           if buff=="":
               break
           self.z.writestr(zi,buff)
       #self.z.writestr(str(image[0].get('filename')), f.read())
       f.close() 
