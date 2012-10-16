import logging
import os 

from google.appengine.api import mail, memcache

from utils.encode import html_to_plaintext, context_to_string
from backend.mail.mixpanel_mail import MixpanelEmail
from views.base import BaseHandler

MAIL_PATH = "mail/"


### For support, include self.request.headers['User-Agent']
### For feedback forms, etc. include user info.


class EmailMessage(object):
	
    def __init__(self, duplicate_check=True, no_plaintext=True, 
        handler=None, mixpanel=True, attachments=None, **kwargs):
        """ 
        Required:
            subject, to, context, template 
        Optional:
            sender, reply_to


        email_msg = EmailMessage(subject="Subject", to=to@to.com, 
            context={}, template='email.html', from=from@from.com)    
        """
        if not handler:
            handler = BaseHandler(mock_handler=True)
        if duplicate_check:
            # check that this message hasn't been sent out already
            cache_string = kwargs['subject'] + "_" + kwargs['to'] + (
            context_to_string(kwargs['context']))
            existing_value = memcache.incr(cache_string, namespace='email_history', initial_value=0)
            if existing_value > 1: 
                # special exceptions (forgot password, etc.) should use a random var in the context
                logging.critical('email with cache_string %s has already been sent!' % cache_string)
                return
        # Setup Message Params
        self.message = mail.EmailMessage()
        self.message.sender = kwargs.get('sender',None) or sender()
        self.message.reply_to = reply_to(address= kwargs.get('reply_to',None)  )
        self.message.subject = kwargs['subject']
        if not kwargs.get('to'):
        	logging.error('to argument not provided. User probably does not have email')
        	delattr(self,'message')
        	return None
        self.message.to = kwargs['to']
        if not mail.is_email_valid(self.message.to) or '@' not in self.message.to:
        	logging.error("%s is not a valid email", self.message.to)
        	delattr(self,'message')
        	return None

        # Setup Message Content
        self.template_path = MAIL_PATH + kwargs['template']
        if no_plaintext:
        	self.plaintext_template_path = self.template_path
        else:
        	self.plaintext_template_path = MAIL_PATH + 'text/' + kwargs['template']
        self.context = kwargs['context']
        self.context['subject'] = self.message.subject
        self.context['to'] = self.message.to	


        # Render HTML version of Message
        self.message.html = handler.render_string(
        self.template_path, **self.context)
        # Convert HTML Message to Plaintext
        #from utils.utils import html_to_plaintext		
        self.message.body = handler.render_string(
        self.plaintext_template_path, **self.context)
        # don't overuse this, but useful for linebreaks
        self.message.body = html_to_plaintext(self.message.body)
        
        if attachments:
            self.message.attachments = attachments
        
        
        # TODO: try/except for expected errors
        if mixpanel:
            def add_tracking():
                mp_api = MixpanelEmail(
                "0ea4f90f7b8157d6dec15b1b26c39b38",
                kwargs['campaign'],
                #type='text',
                properties={'subject': self.message.subject },
                #redirect_host='OPTIONAL REDIRECT_HOST HERE',
                click_tracking=True)
            
                self.message.html = mp_api.add_tracking(self.message.to, self.message.html) 
            
            try:
                add_tracking()
            except:
                logging.error('Unable to add Mixpanel tracking to email')
                pass 		

		
    def send(self):
        if not getattr(self,'message',None):
        	return logging.error('unable to send message')
        logging.info('sending message')
        logging.info('message to %s' % self.message.to)
        logging.info('message subject %s' % self.message.subject)
        logging.info('message context %s' % self.context)
        self.message.send()
        return
        if Debug(): # for viewing 
        	from google.appengine.api import memcache
        	debug_email = memcache.get('debug_email')
        	if not debug_email: debug_email = []
        	debug_email.insert(0, self.message)
        	memcache.set('debug_email', debug_email)

		
	


def sender():
	return "passtiche <james@passtiche.com>" # team@fitpledge.com, TODO: change this to support@fitwand.com?

def reply_to(address=None):
	address = address or "hiptype"
	return address + "@" + os.environ['APPLICATION_ID']  + ".appspotmail.com"
