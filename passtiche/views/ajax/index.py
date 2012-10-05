from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
from google.appengine.api import urlfetch

from views.base import BaseHandler, CookieHandler
from backend.user import auth
from google.appengine.ext.deferred import deferred
from utils import gae as gae_utils
try:    
    import json
except:
    from django.utils import simplejson as json
    
class AjaxHandler(CookieHandler):

    def write(self, *args, **kwargs):
        return super(AjaxHandler, self).write(*args, **kwargs)
        
    
    def send_error(self, *args, **kwargs):
        return super(AjaxHandler, self).send_error(*args, **kwargs)
        
    def error_output(self, error, err_msg):        
        # TODO: security?
        if self.get_argument('dbug', ''):
            self.write('%s - %s' % (error, err_msg))  
        else:
            self.write('ERROR')
        self.finish()
        return


class AccountInvite(AjaxHandler):

    def get(self):
        self.context['current_user'] = self.get_current_user()
        self.context['current_user'].create_subuser(self.get_argument('invite_email'))
        self.context['sub_users'] = self.context['current_user'].sub_users.fetch(1000)
        self.render("website/index/account_inner.html", **self.context)


class SendPass(AjaxHandler):

    def get(self):
        from_email = self.get_argument('from_email')
        to_email = self.get_argument('to_email')
        theme = self.get_argument('theme','')
        pass_template_id = self.get_argument('pass_template')
        current_user = self.get_current_user()
        from model.passes import UserPass, PassTemplate

        pass_template = PassTemplate.get_by_id(int(pass_template_id))
        if not pass_template:
            raise ValueError('pass_template')

        
        self.user_pass = UserPass(owner=current_user, template=pass_template, 
            pass_name=pass_template.name, from_email=from_email, to_email=to_email)
        if theme:
            self.user_pass.theme = theme
        self.user_pass.put()
        self.context['user_pass'] = self.user_pass


        # two different emails - one for recipient, one for sender


        self.email_recipient()
        self.email_sender()     
        self.write('OK')

    def email_recipient(self):
        from backend.mail.base import EmailMessage
        email_msg = EmailMessage(subject="You have been sent a PassBook pass", to=self.user_pass.to_email, 
            context=self.context, template='pass/recipient.html', sender=self.user_pass.from_email)
        email_msg.send()      

    def email_sender(self):
        from backend.mail.base import EmailMessage
        email_msg = EmailMessage(subject="Here is your PassBook pass", to=self.user_pass.from_email, 
            context=self.context, template='pass/sender.html')   
        email_msg.send()   
        
        
class AccountPayment(AjaxHandler):

    def get(self):
        user = self.get_current_user()
        from model.user import UserPayment
        payment = UserPayment(user=user)
        token=self.get_argument('token','')
        if token == "billing":
            payment.billing = True
        else:
            payment.token = token
        user.is_paid = True
        from backend.admin import send_admin_email 
        deferred.defer(send_admin_email, 
            subject='User Payment - %s' % token, message='User Payment - %s' % token, 
            user=user.key().name(), user_agent=gae_utils.GetUserAgent(), ip=gae_utils.IPAddress(), url=gae_utils.GetUrl())

        db.put([user, payment])
        
            
class RequestInvite(AjaxHandler):

    def get(self):
        from model.user import MailingList
        email = self.get_argument('email','')
        if not email:
            logging.error('invite request w/o email')
            return
        if self.get_argument('plan',''):
            new_item = False
            list_item = MailingList.all().filter('email',email).get()
            if self.get_argument('launch_partner','') == 'true':
                list_item.launch_partner = True
            list_item.plan = self.get_argument('plan')
        else:
            new_item = True
            list_item = MailingList(email=email)
        
        list_item.put()

        if new_item:
            from backend.admin import send_admin_email 
            msg = 'Invite Request - %s <br/>Accept: %s/admin/mail?type=%s&email=%s' % (email, self.context['base_url'], 'invite', email)
            deferred.defer(send_admin_email, subject=msg, message=msg)
            deferred.defer(invite_email, email, _countdown=672)
                    
        self.write(str(list_item.key()))
        return  

def invite_email(email):

    from backend.mail.base import EmailMessage
    email_msg = EmailMessage(
        duplicate_check=False,
        campaign='INVITE_REQUEST',
        sender='james@hiptype.com',
        subject="Setting you up with a Hiptype account", 
        to=email, 
        context={ 'email': email }, 
        template="invite_request.html")
        
    email_msg.send()    
                    
