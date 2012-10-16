from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.base import BaseHandler, CookieHandler
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils

class ViewHandler(CookieHandler):
    
    def __init__(self, *args, **kwargs):
        
        super(ViewHandler, self).__init__(*args, **kwargs)
        self.context['current_user'] = self.get_current_user()
        from utils.gae import GetUserAgent
        from utils.web import is_mobile
        self.context['is_mobile'] = is_mobile(GetUserAgent())
        
    def page_not_found(self, error_msg='Page Not Found'):
        self.set_status(404)
        self.write(static_page('404', context={'error_msg': error_msg}))
        return  

    def server_error(self, error_msg='Server Error'):
        self.set_status(500)
        self.write(static_page('500', context={'error_msg': error_msg}))
        return  
                
        
class IndexView(ViewHandler):
    """ Main website view """
    
    def get(self):

        #if 'blog.' in gae_utils.GetUrl():
        #    return self.write(static_page('blog'))
        #self.context['pass_templates'] = self.get_passes()
        self.write(static_page(None, "website/index.html", context=self.context))
        return


class PassDownload(ViewHandler):
    def get(self, pass_code):
        from model.passes import PassTemplate, UserPass
        self.context['msg'] = 'iOS6'

        if self.get_argument('dl',''):
            self.context['msg'] = 'dl'        
        self.context['dl_url'] = gae_utils.GetUrl() + "?dl=t"
        self.context['dl_redirect_url'] = gae_utils.GetUrl().replace('/p/','/d/')

        # if on iOS6 device, download pass
        if self.context['msg'] != 'dl':
            ua = gae_utils.GetUserAgent()
            if 'AppleWebKit' in ua:
                if 'Mobile' in ua and 'OS 6_' in ua:
                    self.context['msg'] = 'dl'
                elif 'Intel Mac OS X 10_8' in ua and 'Safari' in ua:
                    self.context['msg'] = 'dl'
                else:
                    self.context['msg'] = 'upgrade_iOS6'


        user_pass = UserPass.get_by_key_name(pass_code)
        self.context['user_pass'] = user_pass

        self.write(static_page(None, "website/pass/profile.html", context=self.context))
        return

        

class PassDirectDownload(ViewHandler):
    def get(self, pass_code):
        from model.passes import PassTemplate, UserPass
        user_pass = UserPass.get_by_key_name(pass_code)
        from backend.passes import passfile
        pass_creator = passfile.PassFile()
        pass_creator.create(user_pass=user_pass)
        return pass_creator.write(self)    
        
        



class Meeting(ViewHandler):
    
    def get(self):
        self.redirect('http://meetings.io/hiptype')
        return

        
class PageNotFound(ViewHandler):
    """ """

    def get(self):
        import os
        # this is for widgets being viewed on the server that are loading relative path
        # so that on the widget client these assets will be loaded locally
        for prefix in ['w','wp']:
            for path in ['images','fonts','js','css']:
                if '/%s/%s/' % (prefix,path) in os.environ['PATH_INFO']:
                    self.redirect(os.environ['PATH_INFO'].replace('/%s/' % prefix,'/static/'))
                    return
        return self.page_not_found()      
        


@cache(reset=gae_utils.Debug())
def static_page(page_name, template_file=None, context=None):

    handler = ViewHandler(mock_handler=True)
    handler.request.cookies = []
    if not template_file:
        template_file = "website/static/" + page_name + ".html"
    logging.info(context)
    if context:
        handler.context.update(context)
    logging.info(handler.context)
    return handler.render_string(template_file, **handler.context) # TODO: see if context can optionally be passed

 