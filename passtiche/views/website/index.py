from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
import os

from views.base import BaseHandler, CookieHandler
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
        self.ua_type()
        self.write(static_page(None, "website/index.html", context=self.context))
        return

    def ua_type(self):

        # if on iOS6 device, download pass
        if self.get_argument('dl',''):
            self.context['ua_type'] = 'dl' 
            return  

        self.context['ua_type'] = 'generic' 
        if self.context['ua_type'] == 'dl':
            return
        ua = gae_utils.GetUserAgent()            
        if 'Mobile' in ua:
            if ('iPhone' in ua or 'iPod' in ua) and 'AppleWebKit' in ua:
                if 'OS 6_' in ua:
                    self.context['ua_type'] = 'dl'
                    return
                # a previous iPhone version 
                self.context['ua_type'] = 'upgrade_iOS'
            # another mobile OS
        
        if 'Intel Mac' in ua:
            if 'OS X 10_8' in ua:
                if 'Safari' in ua and 'Chrome' not in ua:
                    # Safari on Mountain Lion
                    self.context['ua_type'] = 'dl'
                    return
                # using Mountain Lion, not Safari
                self.context['ua_type'] = 'mountain_lion'  
                return
            # using previous OS X
            self.context['ua_type'] = 'upgrade_OSX'  


#@cache(version_only=True) # set False once this is stable
def get_passes():
    # TODO: this should be cached!
    from model.passes import PassTemplate, PassList
    pass_dict = {
        'new-and-upcoming': [],
        'best-drinks': [],
        'date-night': []
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
        if pass_template.url: 
            return self.redirect(pass_template.url)

        from backend.passes import passfile
        # TODO: in the future this should be cached in advance if possible 
        pass_creator = passfile.PassFile(pass_template=pass_template)
        pass_creator.create()
        return pass_creator.write(self)    
   
class UserPassDirectDownload(ViewHandler):
    def get(self, pass_code):        
        from model.passes import PassTemplate, UserPass
        user_pass = UserPass.get_by_key_name(pass_code)
        from backend.passes import passfile
        pass_creator = passfile.PassFile(user_pass=user_pass)
        pass_creator.create()
        return pass_creator.write(self)          



class IndexView(ViewHandler):
    """ New landing page view """

    def get(self):
        context = {'signed_in': self.get_current_user() > 0}
        self.write(static_page(None, "website/toplevel/index.html", context=context))


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

 