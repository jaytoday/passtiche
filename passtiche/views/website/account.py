from views.website.index import ViewHandler

try:    
    import json
except:
    from django.utils import simplejson as json
import logging    
from backend import errors 


INVITE_CODES = ['quirkyopus','borogoves', 'pro','jointheclub','press','yc','partner']
PREMIUM_CODES = ['quirkyopus','borogoves']

     
class Dashboard(ViewHandler):

	def get(self):
		if not self.get_current_user():
			return self.redirect('/login')
		self.render("website/account/cms/index.html", get_current_user=True, **self.context)		
		return
