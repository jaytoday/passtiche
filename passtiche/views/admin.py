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

class AdminViewHandler(BaseHandler):  
    # authentication happens via app.yaml
    pass

        
class Email(AdminViewHandler):
    
    def get(self):
        email_type = self.get_argument('type')
        if email_type == 'invite':
            self.invite_accept()
    
    def invite_accept(self):
            email = self.get_argument('email')

            from backend.mail.base import EmailMessage
            email_msg = EmailMessage(
                duplicate_check=False,
                campaign='REQUEST_INVITE',
                subject="Join the %s Beta" % self._settings['title'], 
                to=email, 
                context={ 'email': email }, 
                template="beta.html")
                
            #self.get_or_create_user(user_keyname=email.lower().strip(), 
            #password='demo')
            
            email_msg.send()            
            
    

        
class RunTask(AdminViewHandler):
    
    def get(self,task):
        return getattr(self, task)()

    def update_passes(self):
        from model.passes import PassTemplate
        PassTemplate.update_from_json()
        self.write("OK")     

    def passfile(self):
        from backend.passes import passfile
        pass_creator = passfile.PassFile()
        pass_creator.create('coffee')
        pass_creator.write(self)

        
class BinView(AdminViewHandler):
    
    def get(self, view):
        try:
            self.render("website/bin/%s.html" % view, **self.context)
        except IOError:
            return self.page_not_found()

              