import logging
import time, datetime
from google.appengine.ext import db
from google.appengine.ext.deferred import deferred
try:
 
    import json
except:
    from django.utils import simplejson as json   


from model.passes import PassTemplate, PassList


class PassPusher(object):

	def __init__(self):
		pass

	def create(self, template, changeMessage, dt=None):
		"""
		create a new PassPush


		@type template: PassTemplate instance
		@param template: template to push to
		@type changeMessage: str
		@param changeMessage: changeMessage for update
		@type dt: datetime
		@param dt: Optional scheduled push time
		"""
		logging.info('creating new PassPush for template %s' % template.key().name())
		from model.passes import push
		now = datetime.datetime.now()
		if not dt:
			dt = now
		self.pass_push = push.PassPush(template=template, changeMessage=changeMessage, pushtime=dt)
		self.pass_push.put()

		if dt == now:
			self.send()

	def send(self):
		logging.info('sending pass push')        	






