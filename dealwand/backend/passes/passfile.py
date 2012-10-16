import logging
import datetime
import zipfile
import StringIO
from utils import gae as gae_utils

try:    
    import json
except:
    from django.utils import simplejson as json

class PassFile(object):



	def create(self, user_pass):

		self.user_pass = user_pass

		self.pass_json = {
			"primaryFields": [{}],
			"secondaryFields": [{}],
			"auxiliaryFields": [{}],
			'pass_slug': self.user_pass.pass_slug,
			'pass_name': self.user_pass.pass_name

		}

		self.update_json()
		self.send_info()


	def update_json(self):

		
		# first specify item
		action_verb = self.user_pass.action.capitalize() + 'ed' 

		# what is the item?
		self.pass_json['primaryFields'][0]['label'] = '%s Item:' % action_verb
		self.pass_json['primaryFields'][0]['key'] = 'p1'
		self.pass_json['primaryFields'][0]['value'] = self.user_pass.pass_name

		# who made the pass?
		self.pass_json['secondaryFields'][0]['label'] = '%s By:' % action_verb
		self.pass_json['secondaryFields'][0]['key'] = 's1'
		self.pass_json['secondaryFields'][0]['value'] = self.user_pass.owner_name

		# when was the pass made?
		self.pass_json['auxiliaryFields'][0]['label'] = '%s On %s' % (
				action_verb, datetime.datetime.now().strftime("%A, %B %d"))
		self.pass_json['auxiliaryFields'][0]['key'] = 'a1'
		self.pass_json['auxiliaryFields'][0]['value'] = ''



	def send_info(self):
		from google.appengine.api import urlfetch
		if gae_utils.Debug():
			fetch_url = 'http://0.0.0.0:5000'
		else:
			fetch_url = 'http://passtiche.herokuapp.com'
		response = urlfetch.fetch(fetch_url, payload=json.dumps(self.pass_json), method='POST', 
				headers={'Content-Type': 'application/json;charset=UTF-8'}, deadline=60)
		if response.status_code != 200:
			logging.error(response.content)
			raise ValueError('heroku error')
		self.pass_file = response.content

	def write(self, handler):
		strIO = StringIO.StringIO()
		strIO.write(self.pass_file)
		strIO.seek(0)
		while True:
		    buf=strIO.read(2048)
		    if buf=="": 
		        break
		    handler.write(buf)
		handler.set_header("Content-Type", "application/vnd.apple.pkpass")	
		handler.set_header('Content-Disposition', "attachment; filename=%s.pkpass" % self.user_pass.pass_slug)
		strIO.close()  	




	def _create(self, user_pass):

		self.user_pass = user_pass

		pass_json_str = open('resources/pass_template/pass.json').read() # TODO: open from disk, load and modify
		self.pass_json = json.loads(pass_json_str)

		self.update_json()

		return self.create_zip()


	def _update_json(self):
		
		# first specify item
		action_verb = self.user_pass.action.capitalize() + 'ed' 

		# what is the item?
		self.pass_json['eventTicket']['primaryFields'][0]['label'] = '%s Item:' % action_verb
		self.pass_json['eventTicket']['primaryFields'][0]['value'] = self.user_pass.pass_name

		# who made the pass?
		self.pass_json['eventTicket']['secondaryFields'][0]['label'] = '%s By:' % action_verb
		self.pass_json['eventTicket']['secondaryFields'][0]['value'] = self.user_pass.owner_name

		# when was the pass made?
		self.pass_json['eventTicket']['auxiliaryFields'][0]['label'] = '%s On %s' % (
				action_verb, datetime.datetime.now().strftime("%A, %B %d"))
	

	# Creates .pkpass (zip archive)
	def _create_zip(self):
		self.output = StringIO.StringIO()
		self.zip = zipfile.ZipFile(self.output, mode='w', compression=zipfile.ZIP_DEFLATED)
		# self.z.write('resources/css/widget_frame.css', 'widget.wdgt/css/widget_frame.css')   

		# write pass json 

		self.zip.writestr('pass.json', json.dumps(self.pass_json))

		# TODO: signature and manifest need to be dynamically created !!!! 
		self.zip.write('resources/pass_template/signature', 'signature')
		self.zip.write('resources/pass_template/manifest.json', 'manifest.json')

		self.zip.write('resources/pass_template/background/%s.png' % self.user_pass.pass_slug, 'background.png')

		# images
		for img_name in ['icon', 'logo']:
			self.zip.write('resources/pass_template/%s.png' % img_name, '%s.png' % img_name)

		self.zip.close()
		self.output.seek(0)

	def _write(self, handler):
		while True:
		    buf=self.output.read(2048)
		    if buf=="": 
		        break
		    handler.write(buf)
		handler.set_header("Content-Type", "application/vnd.apple.pkpass")	
		handler.set_header('Content-Disposition', "attachment; filename=%s.pkpass" % self.user_pass.pass_slug)
		self.output.close()  