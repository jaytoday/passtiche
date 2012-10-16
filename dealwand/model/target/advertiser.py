import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User

class Advertiser(BaseModel):
    """ Advertiser ("BooksRUs") """ 
    user = db.ReferenceProperty(User, required=False, collection_name='advertisers')
    name = db.StringProperty()
    # other info

def get_current_advertiser(user):
	ad_user = user.advertisers.get()
	if not ad_user:
		ad_user = Advertiser(user=user)
		ad_user.put()
	return ad_user


   
class AdProject(BaseModel):
    advertiser = db.ReferenceProperty(Advertiser, required=False, collection_name='projects')
    # just a shortcut lookup
    user = db.ReferenceProperty(User, required=False, collection_name='projects')
    name = db.StringProperty()
    segments = model.util.properties.PickledProperty(default=[]) # list of segments 

    def get_segments(self):
    	# TODO: cache
    	from segment import AudienceSegment
    	segments = AudienceSegment.get(self.segments)
    	return segments


    def set_all_segment(self):
    	return # deprecated
    	from segment import AudienceSegment
    	all_segment = AudienceSegment(advertiser=self.advertiser, name="All Activity", all_activity=True)
    	all_segment.put()
    	self.segments.append(str(all_segment.key()))
    	self.put()


    def analytics(self):
        from backend.target import analytics
        event_analytics = analytics.EventAnalytics(self)
        return event_analytics.get()


