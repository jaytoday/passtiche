from views.website.index import ViewHandler

try:    
    import json
except:
    from django.utils import simplejson as json
import logging    
from backend import errors 

from model.user import User

INVITE_CODES = ['quirkyopus','borogoves', 'pro','jointheclub','press','yc','partner']
PREMIUM_CODES = ['quirkyopus','borogoves']

     
class Dashboard(ViewHandler):

	def get(self):
		if not self.get_current_user():
			return self.redirect('/login')
		self.render("website/account/cms/index.html", get_current_user=True, **self.context)		
		return

     
class ConfirmAccount(ViewHandler):

	def get(self, user_key):
		account = User.get(user_key)
		if not account:
			self.redirect('/')
		if account.confirmed:
			logging.error('user %s is already confirmed' % account.key().name())
		account.confirmed = True
		account.put()
		self.redirect('/dashboard')
