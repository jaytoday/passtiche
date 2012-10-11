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

   
	def create(self, pass_slug, action=None, sender=None, theme=None):
		self.pass_slug = pass_slug
		self.action = action
		self.theme = theme
		self.sender = sender
		pass_json_str = open('resources/pass/%s/pass.json' % self.pass_slug).read() # TODO: open from disk, load and modify
		pass_json = json.loads(pass_json_str)
		"""
			How are themes dealt with? This needs to be upgraded for individual UserPass objects, along with send dialog...
		"""
		#pass_json['eventTicket']['primaryFields'][0]['value'] = 'Item Name'
		if self.theme:
			pass_json['eventTicket']['secondaryFields'][0]['value'] = self.theme
		else:
			pass_json['eventTicket']['secondaryFields'][0]['value'] = 'Requested/Offered By First Last'
		pass_json['eventTicket']['auxiliaryFields'][0]['label'] = datetime.datetime.now().strftime("%A, %B %d")
		return self.createZip(pass_json)

	# Creates .pkpass (zip archive)
	def createZip(self, pass_json):
		self.output = StringIO.StringIO()
		self.zip = zipfile.ZipFile(self.output, mode='w', compression=zipfile.ZIP_DEFLATED)
		# self.z.write('resources/css/widget_frame.css', 'widget.wdgt/css/widget_frame.css')   

		# write pass json 
		self.zip.writestr('pass.json', json.dumps(pass_json))

		# TODO: signature and manifest need to be dynamically created  
		self.zip.write('resources/pass_template/signature', 'signature')
		self.zip.write('resources/pass/_template/manifest.json', 'manifest.json')

		self.zip.write('resources/pass_template/%s/%s.png' % (self.pass_slug, img_name), 'thumbnail.png')

		# images
		for img_name in ['icon', 'logo']:
			self.zip.write('resources/pass/%s/%s.png' % (self.pass_slug, img_name), '%s.png' % img_name)
		#self.zip.write('resources/pass/%s/%s.png' % (self.pass_slug, 'icon'), 'icon@2x.png')	
		self.zip.close()
		self.output.seek(0)

	def write(self, handler):
		while True:
		    buf=self.output.read(2048)
		    if buf=="": 
		        break
		    handler.write(buf)
		handler.set_header("Content-Type", "application/vnd.apple.pkpass")	
		handler.set_header('Content-Disposition', "attachment; filename=%s.pkpass" % self.pass_slug)
		self.output.close()  