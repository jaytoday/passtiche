import logging
import os
from google.appengine.api import channel as channel_api
try:    
    import json
except:
    from django.utils import simplejson as json
    
def get_channel_name(channel_name):
    """ return unique name for channel """
    if not channel_name:
        channel_name = os.environ.get('REMOTE_ADDR','')
    return channel_name
    
def create_channel(channel_name):
    channel_name = get_channel_name(channel_name)
    logging.info('creating channel %s' % channel_name)
    try:
        token = channel_api.create_channel(channel_name)
        return token
    except channel_api.InvalidChannelClientIdError:
        logging.critical('Invalid Channel Client Id: %s' % channel_name)

def channel_send(message, channel_name=''):
    channel_name = get_channel_name(channel_name)
    logging.info('sending message %s to channel %s' % (message, channel_name))
    try:
        channel_api.send_message(channel_name, json.dumps(message))
        logging.info('success message sent')
    except:
        logging.error('error sending channel message', exc_info=True)
        
        
    
        
                  
                  