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


	def __init__(self, user_pass=None, pass_template=None):
		self.user_pass = user_pass
		if user_pass:
			self.pass_template = self.user_pass.template
			self.pass_code = self.user_pass.pass_code
			self.pass_name = self.user_pass.pass_name
			self.action = self.user_pass.action
		else:
			self.pass_template = pass_template
			self.pass_code = pass_template.key().name()
			self.pass_name = pass_template.name
			self.action = 'download'


	def create(self):



		self.pass_json = {

			"headerFields": [  {
			        "key" : "header",
			        "label" : self.pass_template.name, # name
			        "value" : "Header Field" # large
			      }],			
			"primaryFields": [  {
			        "key" : "primary",
			        "label" : "", # on image
			        "value" : ""
			      }],
			"secondaryFields": [  {
			        "key" : "price",
			        "label" : "Price",
			        "value" : self.pass_template.display_price()
			      },{
			        "key" : "secondary2",
			        "label" : "   ",
			        "value" : "   "
			      },{
			        "key" : "date_time",
			        "label" : self.pass_template.display_date(),
			        "value" : self.pass_template.display_time()
			      }],
			"auxiliaryFields": [{
			        "key" : "loc_name",
			        "label" : "at %s" % self.pass_template.location_name,
			        "value" : "",
			        "alignment": "PKTextAlignmentRight",
			      }  ],

			"backFields" : [ # description, location details, 
			      {
			        "key" : "description",
			        "label" : "Event Description",
			        "value" : self.pass_template.description
			      },
			      {
			        "key" : "location",
			        "label" : "",
			        "value" : ""
			      }, 
			      {
			        "key" : "venue",
			        "label" : "",
			        "value" : ""
			      }, 
			      {
			        "key" : "about",
			        "label" : "About This Pass",
			        "value" : "www.passtiche.com - offer and request gifts using PassBook"
			      }
			 ],
			'pass_key': self.pass_code,
			'pass_name': self.pass_name

		}

		self.pass_location = self.pass_template.get_location()
		if self.pass_location:
			self.pass_json['backFields'][1]['label']= 'Event Location'
			self.pass_json['backFields'][1]['value'] = self.pass_location.street_address
			if self.pass_template.neighborhood_name:
				self.pass_json['backFields'][1]['value'] += " (%s)" % self.pass_template.neighborhood_name
			self.pass_json['backFields'][2]['label']= 'Venue Information'
			if self.pass_location.phone:
				self.pass_json['backFields'][2]['value'] += self.pass_location.phone
			if self.pass_location.yelp:
				self.pass_json['backFields'][2]['value'] += " %s" % self.pass_location.yelp



		#self.update_json()
		self.send_info()


	def update_json(self):

		
		# first specify item
		action_verb = self.action.capitalize() + 'ed' 

		# what is the item?
		self.pass_json['primaryFields'][0]['label'] = '%s Item:' % action_verb
		self.pass_json['primaryFields'][0]['key'] = 'p1'
		self.pass_json['primaryFields'][0]['value'] = self.pass_name

		# who made the pass?
		if self.user_pass:
			self.pass_json['secondaryFields'][0]['label'] = '%s By:' % action_verb
			self.pass_json['secondaryFields'][0]['key'] = 's1'
			self.pass_json['secondaryFields'][0]['value'] = self.user_pass.owner_name
		else:
			self.pass_json['secondaryFields'][0]['label'] = ''
			self.pass_json['secondaryFields'][0]['key'] = 's1'
			self.pass_json['secondaryFields'][0]['value'] = ''			

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
		logging.info('sending to heroku: %s' % self.pass_json)
		response = urlfetch.fetch(fetch_url, payload=json.dumps(self.pass_json), method='POST', 
				headers={'Content-Type': 'application/json;charset=UTF-8'}, deadline=60)
		if response.status_code != 200:
			logging.error(response.content)
			from backend.admin import send_admin_email 
			send_admin_email(subject='Heroku Error', message=response.content,
				 user_agent=gae_utils.GetUserAgent(), ip=gae_utils.IPAddress(), url=gae_utils.GetUrl())
			raise ValueError('heroku error')
		logging.info('heroku response: %s' % len(response.content))
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
		handler.set_header('Content-Disposition', "attachment; filename=%s.pkpass" % self.pass_code)
		strIO.close()  	


'''


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
'''		 