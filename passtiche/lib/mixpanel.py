import base64
try:    
    import json
except:
    from django.utils import simplejson as json
import urllib
from google.appengine.api import urlfetch
 
def track(event, properties=None):
    """
        A simple function for asynchronously logging to the mixpanel.com API on App Engine 
        (Python) using RPC URL Fetch object.
        @param event: The overall event/category you would like to log this data under
        @param properties: A dictionary of key-value pairs that describe the event
        See http://mixpanel.com/api/ for further detail. 
        @return Instance of RPC Object
        
        # Example usage:
        track("invite-friends",
             {"method": "email", "number-friends": "12", "ip": "123.123.123.123"})
    """
    if properties == None:
        properties = {}
    token = "'0ea4f90f7b8157d6dec15b1b26c39b38"
    if "token" not in properties:
        properties["token"] = token
    
    params = {"event": event, "properties": properties}
        
    data = base64.b64encode(json.dumps(params))
    request = "http://api.mixpanel.com/track/?data=" + data
    
    rpc = urlfetch.create_rpc()
    urlfetch.make_fetch_call(rpc, request)
    
    return rpc
        
def track_funnel(funnel, step, goal, properties=None):
    if properties == None:
        properties = {}
    properties["funnel"] = funnel
    properties["step"] = step
    properties["goal"] = goal
    track("mp_funnel", properties)
    

    