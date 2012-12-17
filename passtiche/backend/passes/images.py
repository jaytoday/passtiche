import logging
from model.passes import PassTemplate, PassImage
from google.appengine.ext import db

def save_pass_image(pass_template, imgObj):
	logging.info('saving new image for pass %s' % pass_template.key().name())
	# first get and 'delete' any existing images
	if pass_template.image_key:
		img = PassImage.get(pass_template.image_key)
		img.deleted = True
		img.put()

	pass_img = PassImage(template=pass_template, image=imgObj)
	pass_img.put()
	pass_template.image_key = str(pass_img.key())
	pass_template.put()