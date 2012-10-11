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

		pass_json_str = open('resources/pass_template/pass.json').read() # TODO: open from disk, load and modify
		self.pass_json = json.loads(pass_json_str)

		self.update_json()

		return self.create_zip()


	def update_json(self):
		
		# first specify item
		if self.user_pass.action == 'offer':
			self.pass_json['eventTicket']['primaryFields'][0]['label'] = 'Offered Item:'
		if self.user_pass.action == 'request':
			self.pass_json['eventTicket']['primaryFields'][0]['label'] = 'Requested Item:'			
		self.pass_json['eventTicket']['primaryFields'][0]['value'] = self.user_pass.pass_name

		# who made the pass?
		if self.user_pass.action == 'offer':
			self.pass_json['eventTicket']['secondaryFields'][0]['label'] = 'Offered By:'
		if self.user_pass.action == 'request':
			self.pass_json['eventTicket']['secondaryFields'][0]['label'] = 'Requested By:'	
		self.pass_json['eventTicket']['secondaryFields'][0]['value'] = self.user_pass.owner_name

		self.pass_json['eventTicket']['auxiliaryFields'][0]['label'] = datetime.datetime.now().strftime("%A, %B %d")
	

	# Creates .pkpass (zip archive)
	def create_zip(self):
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

	def write(self, handler):
		while True:
		    buf=self.output.read(2048)
		    if buf=="": 
		        break
		    handler.write(buf)
		handler.set_header("Content-Type", "application/vnd.apple.pkpass")	
		handler.set_header('Content-Disposition', "attachment; filename=%s.pkpass" % self.user_pass.pass_slug)
		self.output.close()  