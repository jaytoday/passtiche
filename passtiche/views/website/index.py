from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.base import BaseHandler, CookieHandler, static_page
from backend.user import auth
from utils.cache import cache
from utils import gae as gae_utils

from model.passes import PassTemplate, UserPass

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
                

class PassticheIndex(ViewHandler):
    """ Main website view """
    
    def get(self):
        logging.info(gae_utils.base_url())
        if 'costanza.co' in gae_utils.base_url() or '/costanza' in gae_utils.GetUrl():
            return self.costanza()
        self.render_output()

    def costanza(self):
        self.write(static_page(None, "website/costanza.html", context=self.context))

    def render_output(self):
        for f in ['linked_pass_template','linked_user_pass', 'linked_pass_entity']:
            if f not in self.context:
                self.context[f] = ''
        self.context['pass_templates'] = get_passes()
        if self.context['linked_pass_entity']:
            self.context['pass_templates']['tickets'] = [pt for pt in self.context['pass_templates']['tickets'] if (
                    pt.key() != self.context['linked_pass_entity'].key())]
            self.context['pass_templates']['tickets'].insert(0,self.context['linked_pass_entity'])
        self.write(static_page(None, "website/index.html", context=self.context))
        return

#@cache(version_only=True) # set False once this is stable
def get_passes():
    # TODO: this should be cached!
    from model.passes import PassTemplate, PassList
    pass_dict = {
        'listings': [],
        'tickets': [],
        'coupons': []
    }
    all_lists = PassList.all().fetch(1000)
    for pass_list in all_lists:
        logging.info('getting %s passes for list %s:' % (len(pass_list.passes), pass_list.name) )
        if pass_list.key().name() in pass_dict.keys():
            # this is only for curated chosen lists

            list_passes = [ p for p in PassTemplate.get_by_key_name(pass_list.passes) if p]
            pass_dict[pass_list.key().name()] = list_passes 

            for p in pass_dict[pass_list.key().name()]:
                logging.info(p.name)

    return pass_dict                              
                

class Docs(ViewHandler):
    """ New landing page view """

    def get(self, path=None):
        if path:
            docs_template = 'pages/%s.html' % path
        else:
            docs_template = 'index.html'

        self.write(static_page(None, "website/docs/%s" % docs_template, context=self.context))


# TODO: pass view module

class PassDownload(PassticheIndex):

    def get(self, pass_code):
        self.pass_code = pass_code
        
        self.get_pass()           
        self.render_output()

    def get_pass(self):

        pass_template = PassTemplate.all().filter('short_code',self.pass_code).get()
        if not pass_template:
            # return 404
            raise ValueError('pass_template')
        self.context['linked_pass_template'] = pass_template.short_code
        self.context['linked_pass_entity'] = pass_template




class UserPassDownload(PassDownload):

    def get_pass(self):

        user_pass = UserPass.get_by_key_name(self.pass_code)
        self.context['linked_user_pass'] = user_pass.code
        self.context['linked_pass_template'] = user_pass.pass_code 
        self.context['linked_pass_entity'] = user_pass.template

        

class PassDirectDownload(ViewHandler):
    def get(self, pass_code):

        from model.passes import PassTemplate, UserPass
        pass_template = PassTemplate.all().filter('short_code',pass_code).get()

        # if this is an external pass, redirect to it
        if pass_template.url and 'pkpass' in pass_template.url: 
            return self.redirect(pass_template.url)

        from backend.passes import passfile
        # TODO: in the future this should be cached in advance if possible 
        pass_creator = passfile.PassFile(pass_template=pass_template)
        pass_creator.create()
        pass_creator.send_info()
        return pass_creator.write(self)    
   
class UserPassDirectDownload(ViewHandler):
    def get(self, pass_code):        
        from model.passes import PassTemplate, UserPass
        user_pass = UserPass.get_by_key_name(pass_code)
        from backend.passes import passfile
        pass_creator = passfile.PassFile(user_pass=user_pass)
        pass_creator.create()
        pass_creator.send_info()
        return pass_creator.write(self)          



        
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
        


 