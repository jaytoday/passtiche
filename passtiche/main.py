#!/usr/bin/env python
import os
import os.path
import logging
import tornado.web
import tornado.wsgi
import wsgiref.handlers

PASSBOOK_DESCRIPTION = """

Passbook on iPhone and iPod touch is where 
you store and access all your boarding passes, 
movie tickets, retail coupons, loyalty cards, and 
more.

"""

PASSBOOK_INSTRUCTIONS = """

To add this <pass/ticket/coupon/card> to 
Passbook, open this <email, web page> on 
your iPhone or iPod touch.

"""

            
settings = {

    "title": u"passtiche",
    "description": "Share and Create Fun Passbook Passes",
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

from views import admin


application = tornado.wsgi.WSGIApplication([
    

    # index - # TODO - new dashboard module
    #(r"/", index.LandingPage),
    (r"/", index.PassticheIndex),

 

    (r"/login", auth.Login),
    (r"/logout", auth.Logout),
     # shortcut login
     (r'/login/(?P<email>[^\/]+)/?', auth.Login),

     # pass URLs 
     #(r'/pt/(?P<pass_id>[^\/]+)/(?P<letter_code>[^\/]+)/?', index.PassURL),     
     (r'/p/(?P<pass_code>[^\/]+)/?', index.PassDownload),   
     (r'/d/(?P<pass_code>[^\/]+)/?', index.PassDirectDownload),               

    # ajax
    (r'/ajax/user\.request_invite/?', ajax_index.RequestInvite), 

    (r'/ajax/pass\.save/?', ajax_index.SavePass),    
    (r'/ajax/pass\.send/?', ajax_index.SendPass),     


    # mobile
    #(r'/mobile/?', mobile_index.UploadScreenshot),    

    # admin
    (r"/admin/login/(?P<email>[^\/]+)?", auth.AdminLogin),
    (r"/admin/mail/?", admin.Email),
    (r"/admin/run/(?P<task>[^\/]+)?", admin.RunTask),



    # Apple push service URL
     (r'/_ps/?', gae.ChannelDisconnect), # TODO

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
