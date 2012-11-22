from views.website.index import ViewHandler

try:    
    import json
except:
    from django.utils import simplejson as json
import logging    
from backend import errors 


INVITE_CODES = ['quirkyopus','borogoves', 'pro','jointheclub','press','yc','partner']
PREMIUM_CODES = ['quirkyopus','borogoves']

     
class Login(ViewHandler):

    def post(self):
        response = {} 

        email = self.get_argument('email')
        password = self.get_argument('password')
        try:
            login_method = self.get_user
            # user can create new account with correct invite code
            code = None
            if 'code' in self.request.arguments:
                login_method = self.get_or_create_user
            user = login_method(user_keyname=email.lower().strip(), 
                password=password.lower().strip())
            if user:
                if code:
                    user.invite_code = code
                    if code in PREMIUM_CODES:
                        user.account = 'premium'
                    user.put()
                logging.info('signed in as user %s' % user.email)
                response['user'] = str(user.key())
        except (errors.PasswordError, errors.NoEntityError):
            logging.warning('Incorrect email/password combination for email %s' % email)
            response['error'] = 'Incorrect email/password combination'
            
        self.write(json.dumps(response))
        
    def get(self, email=None):
        self.logout()
        if email:
            return self.admin_login(email)               
   
        self.render('website/auth/login.html', **self.context) 

    def admin_login(self, email, password='demo', admin=False):
        # this is a backdoor for logging in new user 
        if '@' not in email:
            email += "@hiptype.com"
        user = self.get_or_create_user(
            user_keyname=email.lower().strip(), 
            password=password.lower().strip(), admin=admin)
 
        return self.redirect('/dashboard') 


class Signup(ViewHandler):

    def post(self):
        response = {} 

        email = self.get_argument('email')
        password = self.get_argument('password')
        try:
            login_method = self.get_user
            # user can create new account with correct invite code
            code = None
            if 'code' in self.request.arguments:
                login_method = self.get_or_create_user
            user = login_method(user_keyname=email.lower().strip(), 
                password=password.lower().strip())
            if user:
                if code:
                    user.invite_code = code
                    if code in PREMIUM_CODES:
                        user.account = 'premium'
                    user.put()
                logging.info('signed in as user %s' % user.email)
                response['user'] = str(user.key())
        except (errors.PasswordError, errors.NoEntityError):
            logging.warning('Incorrect email/password combination for email %s' % email)
            response['error'] = 'Incorrect email/password combination'
            
        self.write(json.dumps(response))
        
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
        
        