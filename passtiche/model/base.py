from google.appengine.ext import db

import datetime
import model.util.properties
import logging


class BaseModel(db.Expando):

    created = db.DateTimeProperty(auto_now_add=True)
    modified = db.DateTimeProperty(auto_now=True)

    status = db.StringProperty(default='enabled')    
    
    def created_time(self, tzoffset=0):
        tzoffset += 600 # TODO: nothing to see here, move along....
        return (self.created + datetime.timedelta(minutes=tzoffset)).strftime("%B %d (%I:%M%p)").replace("PM","pm").replace("AM","am")
    
    def time_since(self, attr='created', time_val=None, bold=False, short=False,**kwargs):
        """ optional 'now' datetime argument """
        import os
        os.environ['DJANGO_SETTINGS_MODULE'] = "main"
        from django.utils.timesince import timesince
        if not time_val:
            time_val = getattr(self, attr)
        time_since = timesince(time_val, **kwargs).split(',')[0]
        if 'millisec' in time_since or time_since.startswith('0 minutes') or 'seconds' in time_since:
            time_since = "a moment"
        if short:
            time_since = time_since.replace('minutes','mins')
        if bold:
            return "<span style='font-weight:700;'>%s</span> ago" % time_since
        return "%s ago" % time_since
                  
        