import logging
import os
import datetime, time
import tornado.web
from google.appengine.api import users
from model.user import User, SubUser 
from utils import gae as gae_utils
from google.appengine.ext.deferred import deferred
from backend.admin import send_admin_email 

from backend import errors

class BaseHandler(tornado.web.RequestHandler):
    """Implements Google Accounts authentication methods."""

    def __init__(self, *args, **kwargs):
        self.include_host = True
        self.user = None
        self.error = None # should be dictionary if error needs to be passed to view
        from main import settings
        self._settings = settings.copy()
        
        self.context = {
            'current_user': None, 
            'error': None, 
            'base_url': gae_utils.base_url(), 
            'domain': gae_utils.base_url().replace('http://','').replace('www.',''),
            'user_agent': gae_utils.GetUserAgent(),
            'path': os.environ['PATH_INFO'],
            "handler_name": self.__class__.__name__,
            "handler": self,
            'token': None,
        }
        
        #if '__FOO' in os.environ['SERVER_NAME'].lower():
        #    self._settings["title"] = u"BAR"
      
        if kwargs.get('mock_handler'):
            from main import application
            from tornado.httpclient import HTTPRequest
            self.application = application
            self.request = HTTPRequest('/mock_url')
            self.ui = {}
        else:
            super(BaseHandler, self).__init__(*args, **kwargs)
           
    def post(self, *args, **kwargs):
        return self.get(*args, **kwargs)

    def write_error(self, status_code, **kwargs):
        
        import traceback
        if gae_utils.Debug():
            exc_info = kwargs["exc_info"]
            trace_info = ''.join(["%s<br/>" % line for line in traceback.format_exception(*exc_info)])
            request_info = ''.join(["<strong>%s</strong>: %s<br/>" % (k, self.request.__dict__[k] ) for k in self.request.__dict__.keys()])
            error = exc_info[1]
            self.context['error'] = error
            self.set_header('Content-Type', 'text/html')
            self.finish("""<html>
                             <title>%s</title>
                             <body>
                                <h2>Error</h2>
                                <p>%s</p>
                                <h2>Traceback</h2>
                                <p>%s</p>
                                <h2>Request Info</h2>
                                <p>%s</p>
                             </body>
                           </html>""" % (error, error, 
                                        trace_info, request_info))
                                        
    
    def write_json(self, dict):
        try:    
            import json
        except:
            from django.utils import simplejson as json

        self.write(json.dumps(dict))

    def send_error(self, *args, **kwargs):
        self.set_status(500) # always 500?
        from utils.gae import error_msg
        error, err_msg = error_msg()
        logging.error('%s - %s' % (error, err_msg))
        if gae_utils.Debug():
            logging.info('debug server, not sending admin error report')
            return super(BaseHandler, self).send_error(*args, **kwargs) 
        else:
            for bot_agent in ['google','appengine','alexa','yahoo','bot','bing']:
                if bot_agent in gae_utils.GetUserAgent().lower():
                    return# self.error_output(error, err_msg)
            if '405: Method Not Allowed' in err_msg:
                return self.error_output(error, err_msg)
                
            # TODO: include info about user and session
            # TODO: print out 500 page. And also do the same for 400 page. 
            
            user = self.get_current_user()
            if user: user = user.key().name()
            deferred.defer(send_admin_email, 
                subject='Error - %s' % error, message='Error Traceback - %s' % err_msg, 
                user=user, user_agent=gae_utils.GetUserAgent(), ip=gae_utils.IPAddress(), url=gae_utils.GetUrl())
        
        self._finished = False
        if getattr(self, 'server_error',''):
            self.server_error()
        # TODO: Ajax/API views should have their own error output
        else:
            self.error_output(error, err_msg)
        self._finished = True
        return
        
  
    def get_login_url(self, ret=None):
        if not ret:
            ret = self.request.uri
        return users.create_login_url(ret)

    def get_logout_url(self,ret=''):
        return users.create_logout_url(ret)
    
    def logout(self):
        self.set_secure_cookie("user", '')
        self.user = None
        self.context['current_user'] = None
        
    def render(self, template_file, get_current_user=False, **kwargs):
        kwargs['settings'] = self._settings
        if get_current_user: # forces the get
            kwargs['current_user'] = self.get_current_user()
        else:
            kwargs['current_user'] = self.user
        kwargs['ip_address'] = str(os.environ.get('REMOTE_ADDR','')) 
        kwargs['error'] = self.error
        kwargs['debug'] = gae_utils.Debug()
        if self.error:
            logging.warning('returning error: %s' % self.error)
        return super(BaseHandler, self).render(template_file, **kwargs)
        
    def get_argument_or_raise_error(self, key):
        val = self.get_argument(key, False)
        if val is False:
            raise ValueError('%s argument is required' % key)
        else:
            logging.info('retrieved value %s for argument %s' % (val, key))
            return val  
    
    def render_string(self, template_name, **kwargs):
        # Let the templates access the users module to generate login URLs
        kwargs['settings'] = self._settings
        kwargs['ip_address'] = str(os.environ.get('REMOTE_ADDR','')) 
        kwargs['error'] = self.error
        kwargs['arguments'] = getattr(self.request,'arguments',{})
        kwargs['debug'] = gae_utils.Debug()        
        return tornado.web.RequestHandler.render_string(
            self, template_name, users=users, **kwargs)


    def flat_args_dict(self):
        # utility method for getting request args not in a list
        args = self.request.arguments
        fargs = {}
        for k, v in args.items():
            fargs[k] = v[0]
        return fargs
        

COOKIE_DAYS = 30

class CookieHandler(BaseHandler):
    
    def set_current_user(self, user):
        user_key = str(user.key().name())
        #expires = datetime.datetime.utcnow() + datetime.timedelta(days=COOKIE_DAYS)
        self.set_secure_cookie("user", user_key, expires_days=COOKIE_DAYS)
        logging.info('Set Secure Cookie: %s' % user_key)
        self.user = user
        return user_key
            
    def get_current_user(self):

        # custom auth 
        if self.user:
            return self.user
        if getattr(self.request, 'cookies',''):
            user_key = self.get_secure_cookie("user")#, max_age_days=COOKIE_DAYS)
        else: 
            user_key = None
        logging.info('user cookie: %s' % user_key)
        if user_key:
            user = User.get_by_key_name(user_key)
            if not user:
                logging.error('could not get current user with key %s' % user_key)
                return None
            self.user = user
            return self.user
        elif not user_key:
            return None
        
    def get_or_create_user(self,**kwargs):
        return self.get_user(create_user=True, **kwargs)
        
    def get_user(self, create_user=False, user_keyname=None, 
        password=None, old_user=None, set_user=True, admin=False, **kwargs):


        """

        
        """
        if password:
            password = password.lower().strip()
        else:
            raise errors.PasswordError
        user = self.get_current_user()
        if user:
            if not user_keyname:
                return user
            if user.key().name().startswith('auto_gen_'):
                old_user = user   
            else:
                if (user_keyname == user.key().name()):
                    return user
                else:
                    logging.error('get_or_create user got current user %s and also keyname %s' %
                        (user.key().name(), user_keyname))
        if not user_keyname:
            logging.warning('using auto-generated keyname. This may cause issues...')
            #raise ValueError('user keyname is required')
            user_keyname = self.get_auto_keyname()
        user_keyname = user_keyname.lower()
        user_entity = User.get_by_key_name(user_keyname)
        if not user_entity and '@' in user_keyname:
            # try querying by email
            user_entity = User.all().filter('email', user_keyname).get()
        if user_entity:
            logging.info('retrieved user with keyname %s' % user_keyname)
            if admin or (password and user_entity.password == password):
                # the user has just signed in
                if old_user:
                    self.transfer_user_data(old_user, user_entity)
                if set_user:
                    if '@hitype.com' not in user_entity.email:
                        deferred.defer(send_admin_email, 
                            subject='User Login - %s' % user_entity.email, message='User Login - %s' % user_entity.email, 
                            user=user_entity, user_agent=gae_utils.GetUserAgent(), ip=gae_utils.IPAddress(), url=gae_utils.GetUrl())
        
                            
                    self.set_current_user(user_entity)                    
                return user_entity
            else:
                logging.info('password %s did not match user %s password %s' % (
                    password, user_entity.key().name(), user_entity.password))
                raise errors.PasswordError
        else:
            # user doesn't exist
            if create_user:
                new_user = self.create_new_user(user_keyname, password, set_user=set_user, **kwargs)
                if old_user:
                    self.transfer_user_data(old_user, new_user)
                return new_user 
            else:
                if '@' in user_keyname:
                    sub_user_entity = SubUser.all().filter('email', user_keyname).get()
                    if sub_user_entity:
                        logging.info('retrieved subuser with keyname %s' % user_keyname)
                        if not sub_user_entity.password:
                            sub_user_entity.password = password
                            sub_user_entity.status = 'accepted'
                            sub_user_entity.put()
                        if sub_user_entity.password == password:
                            # the subuser has just signed in
                            if set_user:
                                self.set_current_user(sub_user_entity.main_account)
                            return sub_user_entity.main_account
                        else:
                            logging.info('password %s did not match user %s password %s' % (
                                password, sub_user_entity.key().name(), sub_user_entity.password))
                            raise errors.PasswordError
                                
            raise errors.NoEntityError

    
    def create_new_user(self, user_keyname, password, set_user=True, **kwargs):
        logging.info('creating user with keyname %s' % user_keyname)
        user_entity = User(key_name=user_keyname, username=user_keyname)
        if password:
            user_entity.password = password
        if '@passtiche.com' not in user_keyname and not user_keyname.startswith('auto_gen'):
            deferred.defer(send_admin_email, subject='New %s User: %s' % (
                 self._settings['title'], user_keyname),        
                message='User %s just signed up for an account' % user_keyname,
                user=user_keyname, user_agent=gae_utils.GetUserAgent(), url=gae_utils.GetUrl())
        if '@' in user_keyname:
            user_entity.email = user_keyname
            
            #send_welcome_email(user_entity.email, 'Welcome to %s!' % self._settings['title'])
            deferred.defer(send_welcome_email, 
                user_entity.email, 
                'Welcome to %s!' % self._settings['title'], 
                _countdown=10) # 1300 22 minutes

        # optional args
        for k in ['first_name', 'last_name','phone','organization']:
            if kwargs.get(k):
                v = kwargs.get(k)
                setattr(user_entity, k, v)

        from utils import string as str_utils
        code = str_utils.genkey(length=7)
        user_entity.short_code = code

        user_entity.put()
        if set_user:
            self.set_current_user(user_entity)
        return user_entity 
            
    def get_auto_keyname(self):
        keyname = 'auto_gen_' + os.environ.get('REMOTE_ADDR', 'unknown_IP') + os.environ.get('HTTP_USER_AGENT','unknown_UA') + str(
            time.mktime(datetime.datetime.utcnow().timetuple()))
        keyname = keyname.replace(' ','_')
        logging.info('generated keyname %s' % keyname)
        return keyname            


    def transfer_user_data(self, old_user, new_user):
        logging.info('TODO: transfer data from old user %s to new user %s' % (
            old_user.key().name(), new_user.key().name()))


        
def send_welcome_email(to, subject):
    return logging.info('not sending welcome email for now')
    from backend.mail.base import EmailMessage
    email_msg = EmailMessage(
        duplicate_check=False,
        campaign='SIGNUP',
        subject=subject, 
        to=to, 
        context={}, 
        template="beta.html")
    email_msg.send()  
    
       