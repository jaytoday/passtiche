import logging
import time, datetime
from model.base import BaseModel
from google.appengine.ext import db
from model.util import properties

ADMINS = ['james@costanza.co']

class User(BaseModel):
    # key name is email?
    email = db.EmailProperty(required=False)   # all lower case
    password = properties.PickledProperty(required=False)
    
    # optional fields
    first_name = db.StringProperty(required=False) # hidden to users?    
    last_name = db.StringProperty(required=False)

    description = db.StringProperty(required=False)
    
    gender = db.StringProperty(required=False) 
    age = db.IntegerProperty(required=False) # this might not be exact (from range)      
    twitter = db.StringProperty(required=False) 
    
    # photo
    thumb = db.BlobProperty(required=False)  # 128?
    small_thumb = db.BlobProperty(required=False) # 32?
    
    book_count = db.IntegerProperty(default=0)

    account = db.StringProperty(required=False)  
    is_paid = db.BooleanProperty(required=False)    
        
    # optional integration
    fb_user_id = db.StringProperty(required=False)
    fb_username = db.StringProperty(required=False) # hidden to users?    
    fb_access_token = db.StringProperty(required=False)    

    # payment info - TODO: keep in separate model
    # TODO: use stripe token instead of storing raw data
    cc_number = db.IntegerProperty(required=False)
    cc_cvc = db.IntegerProperty(required=False)
    cc_expiry_month = db.IntegerProperty(required=False)
    cc_expiry_year = db.IntegerProperty(required=False)
    
    # other info for tracking
    invite_code = db.StringProperty(required=False)
    
    def display_name(self, default=None):
        if self.first_name and not self.last_name: return self.first_name
        if self.last_name and not self.first_name: return self.last_name
        if not self.first_name and not self.last_name: 
            if default:
                return default
            return self.email
        return "%s %s" % (self.first_name, self.last_name)


    def is_admin(self):
        if self.email in ADMINS:
            return True
        
    def photo_url(self):
        # TODO: get FB photo (or gravatar, or uploaded photo)
        if self.thumb:
            return '/image/user/%s' % self.key()
        if self.fb_user_id:
            return 'http://graph.facebook.com/%s/picture?type=large' % self.fb_user_id
        return '/static/images/icons/minimalistica/128x128/user.png'
        
    
    def widgets(self, count=1000):
        if getattr(self, '_widgets', ''):
            return self._widgets
        from model.widget import Widget
        self._widgets = Widget.all().filter('user', self.key()).order('-created').fetch(count)
        return self._widgets

    def get_subuser(self):
        return self.sub_users.fetch(None)

    def create_subuser(self, email_address):
        if not email_address:
            return False
        sub_user = SubUser.all().filter('email', email_address).get()
        if sub_user:
            return False
        sub_user = SubUser(main_account=self, email=email_address)
        sub_user.status = 'invited'
        sub_user.put()
        from backend.mail.base import EmailMessage
        subject = "You've been invited to join %s on Hiptype"%self.email
        to = email_address
        email_msg = EmailMessage(
            duplicate_check=False,
            campaign='SUBACCOUNT',
            subject=subject, 
            to=to, 
            context={
                'main_account_email': self.email,
                'email': email_address
            }, 
            template="subaccount.html")
        email_msg.send()
        return True


class SubUser(BaseModel):
    """ Sub account access to same data (from group_owner account) """
    main_account = db.ReferenceProperty(User, required=True, collection_name='sub_users')
    # status - invited, accepted
    email = db.EmailProperty(required=True)   # all lower case
    password = properties.PickledProperty(required=False)

class UserPayment(BaseModel):
    """ Handle stripe token """
    user = db.ReferenceProperty(User, required=True)
    token = db.StringProperty(required=False)
    billing = db.BooleanProperty(required=False)
    
class MailingList(BaseModel):
    """ Keep in touch with person"""
    name = db.StringProperty(required=False)
    signup_type = db.StringProperty(required=False)
    dev_type = db.StringProperty(required=False)
    email = db.EmailProperty(required=True)
    confirm = db.BooleanProperty(required=False)
    sent_messages = properties.PickledProperty(required=False) # strings   
    document = db.BlobProperty(required=False)  # 128?    
    document_name = db.StringProperty(required=False)
    
    launch_partner = db.BooleanProperty(required=False)
    plan = db.StringProperty(required=False)
    #ip_address = db.StringProperty(required=False) 



class MailingListDocument(BaseModel):
    """ Keep in touch with person"""
    user = db.ReferenceProperty(MailingList, required=True)
    document = db.BlobProperty(required=False)  # 128?    
    document_name = db.StringProperty(required=False)
    #ip_address = db.StringProperty(required=False) 

