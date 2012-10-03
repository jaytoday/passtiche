from lib import facebook
import logging
import time, datetime
from model.widget import Widget

def profileFromToken(user, access_token):
    graph = facebook.GraphAPI(access_token)
    profile = graph.get_object("me")
    user.fb_access_token = access_token
    user.fb_user_id = profile["id"]
    user.first_name = profile["first_name"]
    user.last_name = profile["last_name"]
    if "username" in profile:
        user.fb_username = profile["username"]
    logging.info('saved FB profile info for user %s' % user.fb_username)
    user.put()
    return user

"""

{
  "id": "2401963", 
  "name": "James Levy", 
  "first_name": "James", 
  "last_name": "Levy", 
  "link": "http://www.facebook.com/jamesalexanderlevy", 
  "username": "jamesalexanderlevy", 
  "gender": "male", 
  "locale": "en_US", 
  "type": "user"
}

"""    
    
def postToTimeline(user, widget_key):
    from main import settings
    graph = facebook.GraphAPI(user.fb_access_token)
    # graph.put_object("me", "feed", message="Hello, world")
    post_response = graph.put_object("me", "%s:read" % settings["facebook_ns"], 
        article="%s/wp/%s" % (settings['website'], widget_key))
    logging.info(post_response)
    logging.info('posted to timeline')
    widget = Widget.get(widget_key)
    share_dict = {'time': datetime.datetime.now(), 'network': 'facebook', 'id': post_response['id'] }
    if not widget.share_info:
        widget.share_info = []
    widget.share_info.insert(0, share_dict)
    widget.put()
    return
    # TODO: We can't like a FB page via API, you need to use weird iframe method or just like the most recent post 
    book = widget.book
    if book.fb_page:
        return
        logging.info('liking FB page: %s' % book.fb_page)
        like_response = graph.put_like(book.fb_page)
        logging.info(like_response)
    

    	                      
 
    
    