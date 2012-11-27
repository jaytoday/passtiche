from views.website.index import ViewHandler

try:    
    import json
except:
    from django.utils import simplejson as json
import logging    
from backend import errors 


INVITE_CODES = ['quirkyopus','borogoves', 'pro','jointheclub','press','yc','partner']
PREMIUM_CODES = ['quirkyopus','borogoves']

ACCOUNT_HOME = '' # '/dashboard'

     
class Login(ViewHandler):

    def post(self):

        email = self.get_argument('email','')
        password = self.get_argument('password','')
        try:
            user = self.get_user(user_keyname=email.lower().strip(), 
                password=password.lower().strip())
            if user:
                logging.info('signed in as user %s' % user.email)
        except (errors.PasswordError):
            logging.warning('Incorrect email/password combination for email %s' % email)
            self.error = 'Incorrect email/password combination'
            return self.get()
        except (errors.NoEntityError):
            logging.warning('No entity found for email %s' % email)
            self.error = 'No user found for this email address'           
            return self.get()
            
        self.redirect('/dashboard')
        
    def get(self, email=None):
        self.logout()
        if email:
            return self.admin_login(email)               
        self.render('website/auth/login.html',**self.context) 

    def admin_login(self, email, password='demo', admin=False):
        # this is a backdoor for logging in new user 
        if '@' not in email:
            email += "@passtiche.com"
        user = self.get_or_create_user(
            user_keyname=email.lower().strip(), 
            password=password.lower().strip(), admin=admin)
 
        return self.redirect(ACCOUNT_HOME) 


class Signup(ViewHandler):

    def post(self):
        response = {} 

        email = self.get_argument('email','')

        # TODO - sanitize input, catch expected errors

        user = self.get_or_create_user(user_keyname=email.lower().strip(), **self.flat_args_dict())
        logging.info('signed up as user %s' % user.email)
        self.redirect(ACCOUNT_HOME)
        return
        
        return self.get()
        
    def get(self):
        self.render('website/auth/signup.html', **self.context) 


class AdminLogin(Login):

    def get(self, email=None):
        if email:
            return self.admin_login(email, admin=True)               
   
        
class PreviewLogin(Login):

    def get(self):
        super(PreviewLogin, self).get(email="test")
        
        

          
class Logout(ViewHandler):

    def get(self):
        self.logout()
        self.redirect('/')  
        
        