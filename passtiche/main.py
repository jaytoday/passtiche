#!/usr/bin/env python
import os
import os.path
import logging
import tornado.web
import tornado.wsgi
import wsgiref.handlers

            
settings = {

    "title": u"passtiche",
    "description": "Share and Create Fun PassBook Passes",
    "cookie_secret": "49490ja09jfkjapojspokajk20jk",
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    
    
    # URLs
    "domain": "passtiche.com",
    "website": "http://www.passtiche.com",
    "twitter": "passtiche",  

    # API TOKENS
    "facebook_ns": 'passtiche',
    "facebook_id": 264108830333652,
    "facebook_secret": "99668de4468c94f7d58ca0a87e4c4c9e",
    "facebook_admin": "2401963",
    
    # Configuration
    "debug": os.environ['SERVER_SOFTWARE'].startswith('Development'), 
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    #"xsrf_cookies": True,
}        

from views import gae 

from views.website import index, auth

from views.ajax import index as ajax_index, mobile as ajax_mobile

from views.mobile import index as mobile_index


application = tornado.wsgi.WSGIApplication([
    

    # index - # TODO - new dashboard module
    #(r"/", index.LandingPage),
    (r"/", index.PassticheIndex),
    (r"/reference", index.Reference),
 

    (r"/login", auth.Login),
    (r"/logout", auth.Logout),
     # shortcut login
     (r'/login/(?P<email>[^\/]+)/?', auth.Login),

    # ajax
    (r'/ajax/user\.request_invite/?', ajax_index.RequestInvite), 

    # mobile
    (r'/cakepass/new/?', mobile_index.UploadScreenshot),    



    # GAE handlers
     (r'/_ah/channel/disconnected/', gae.ChannelDisconnect),
     (r'/_ah/channel/connected/', gae.ChannelConnect),
     
  
      
    #(r'.*', index.PageNotFound)
    # TODO: for 404 deliver static compiled resource
            
], **settings)

# admin
"""
(r"/admin/bin/([0-9a-zA-Z-_]+)/?", admin.BinView),
(r"/admin/login/(?P<email>[^\/]+)?", auth.AdminLogin),
(r"/admin/mail/?", admin.Email),

# cron
(r'/cron/(?P<package_name>[^\/]+)/?(?P<script_name>[^\/]+)?', cron.CronHandler),
 
"""


def main():
    wsgiref.handlers.CGIHandler().run(application)


if __name__ == "__main__":
    main()