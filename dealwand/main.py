#!/usr/bin/env python
import os
import os.path
import logging
import tornado.web
import tornado.wsgi
import wsgiref.handlers

            
settings = {

    "title": u"DealWand",
    "description": "Mobile Coupon Recommendations",
    "cookie_secret": "49490ja09jfkjapojspokajk20jk",
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    
    
    # URLs
    "domain": "dealwand.com",
    "website": "http://www.dealwand.com",
    "twitter": "dealwand",  

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


from views.website import index, auth



application = tornado.wsgi.WSGIApplication([
    

    # index - # TODO - new dashboard module
    #(r"/", index.LandingPage),
    (r"/", index.IndexView),

  
      
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
