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
		self.render("website/account/cms/index.html", **self.context)		
		return
