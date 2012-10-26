from google.appengine.api import users
from google.appengine.ext import db

import datetime, time
import logging
from google.appengine.api import urlfetch

from views.base import BaseHandler, CookieHandler
from backend.user import auth
from google.appengine.ext.deferred import deferred
from utils import gae as gae_utils
from utils import string as str_utils
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


class SavePass(AjaxHandler):

    def get(self):
        if self.get_argument('increment', ''):
            return self.increment()
        from model.passes import UserPass, PassTemplate

        self.user = self.get_current_user()
        self.action = self.get_argument('action')

        # TODO: first check if there is user_pass key name
        if self.get_argument('user_pass',''):         
            self.update()
        else:
            self.create()

        self.user_pass.put()

        self.write(self.user_pass.key().name())



    def create(self):
        from model.passes import UserPass, PassTemplate
        
        self.pass_template_keyname = self.get_argument('pass_template')
        pass_template = PassTemplate.get_by_key_name(self.pass_template_keyname)
        if not pass_template:
            raise ValueError('pass_template')
        self.pass_template = pass_template

        code = str_utils.genkey(length=5)
        self.user_pass = UserPass(key_name=code, code=code,owner=self.user, 
                template=self.pass_template, pass_name=self.pass_template.name, pass_code=self.pass_template.short_code, action=self.action.lower())
        if self.get_argument('owner_name',''):
            self.user_pass.owner_name = self.get_argument('owner_name')
        if self.get_argument('theme',''):
            self.user_pass.theme = self.get_argument('theme')


    def update(self):
        from model.passes import UserPass, PassTemplate

        self.user_pass = UserPass.get_by_key_name(self.get_argument('user_pass'))
        self.user_pass.action = self.action.lower()
        if self.get_argument('theme',''):
            self.user_pass.theme = self.get_argument('theme')
        if self.get_argument('owner_name',''):
            self.user_pass.owner_name = self.get_argument('owner_name')            

        # template ID, name, action, theme

    def increment(self):
        from model.passes import UserPass, PassTemplate
        pass_template = PassTemplate.get_by_key_name(self.get_argument('pass'))
        action = self.get_argument('action').lower()
        if action == 'offer':
            pass_template.shares += 1
        if action == 'request':
            pass_template.saves +=1

        pass_template.put()

        return


        

class SendPass(AjaxHandler):

    def get(self):
        action = self.get_argument('action','').lower()
        getattr(self, action)()


    def share(self):

        to_email = self.get_argument('to_email','')
        to_phone = self.get_argument('to_phone','')
        theme = self.get_argument('theme','')
        
        current_user = self.get_current_user()
        
        # TODO: refactor this to backend API

        from model.passes import UserPass, PassTemplate
        
        self.user_pass = UserPass.get_by_key_name(self.get_argument('user_pass'))
        pass_template = self.user_pass.template

        if to_email:
            self.user_pass.to_email = to_email
        if to_phone:
            self.user_pass.to_phone = self.sanitize_phone(to_phone)


        pass_template.shares += 1

        db.put([self.user_pass, pass_template])
        self.context['user_pass'] = self.user_pass


        # two different emails - one for recipient, one for sender
        if to_email:
            self.share_email_recipient()
        if to_phone:
            self.share_phone_recipient()
        #self.share_email_sender()   

        self.write('OK')




    def download(self):
        # TODO: create new UserPass to record that this user has this pass? 

        to_email = self.get_argument('to_email','')
        to_phone = self.get_argument('to_phone','')
        theme = self.get_argument('theme','')
        
        current_user = self.get_current_user()
        
        # TODO: refactor this to backend API

        from model.passes import UserPass, PassTemplate
        pass_template = PassTemplate.get_by_key_name(self.get_argument('pass_template'))
        code = str_utils.genkey(length=5)
        self.user_pass = UserPass(key_name=code, code=code,owner=current_user, 
                template=pass_template, pass_name=pass_template.name, pass_code=pass_template.short_code, action='download')

        if to_email:
            self.user_pass.to_email = to_email
        if to_phone:
            self.user_pass.to_phone = self.sanitize_phone(to_phone)

        pass_template.saves += 1

        db.put([self.user_pass, pass_template])
        self.context['user_pass'] = self.user_pass

        if to_email:
            self.download_email()
        if to_phone:
            self.download_phone()

        self.write('OK')        

    def download_email(self):
        from backend.mail.base import EmailMessage
        email_msg = EmailMessage(subject="Here is your PassBook pass", to=self.user_pass.to_email, 
            context=self.context, template='pass/download.html')
        email_msg.send()  

    def download_phone(self):
        from backend.phone import send_sms
        send_sms("Download Your Pass: %s" % self.user_pass.url(), self.user_pass.to_phone)

    def share_phone_recipient(self):
        from backend.phone import send_sms
        send_sms("Download a Pass From %s: %s" % (self.user_pass.owner_name, self.user_pass.url()), self.user_pass.to_phone)


    def share_email_recipient(self):
        from backend.mail.base import EmailMessage
        email_msg = EmailMessage(subject="You have been sent a PassBook pass", to=self.user_pass.to_email, 
            context=self.context, template='pass/recipient.html', sender=self.user_pass.from_email)
        email_msg.send()      

    def share_email_sender(self):
        from backend.mail.base import EmailMessage
        email_msg = EmailMessage(subject="Here is your PassBook pass", to=self.user_pass.from_email, 
            context=self.context, template='pass/sender.html')   
        email_msg.send()

    def sanitize_phone(self, number):
        number = number.replace('-','').replace(' ','').replace('(','').replace(')','')  
        if not number.startswith('1'): number = "1" + number
        return number 
        
        
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
                    
