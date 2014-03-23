#!/usr/bin/env python
import os
import os.path
import logging
import tornado.web
import tornado.wsgi
import wsgiref.handlers

           
settings = {

    "title": u"Passtiche",
    "description": "Passbook Badges For Your Website",
    "cookie_secret": "49490ja09jfkjapojspokajk20jk",
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    
    
    # URLs
    "domain": "passtiche.appspot.com",
    "website": "http://www.passtiche.appspot.com",
    "twitter": "passtiche",  

    # API TOKENS
    "facebook_ns": 'passtiche',
    "facebook_id": 264108830333652,
    "facebook_secret": "99668de4468c94f7d58ca0a87e4c4c9e",
    "facebook_admin": "2401963",
    
    # Configuration
    "debug": os.environ.get('SERVER_SOFTWARE','').startswith('Development'), 
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    #"xsrf_cookies": True,
}        

from views import gae 

from views.website import index, auth, account

from views.ajax import index as ajax_index, mobile as ajax_mobile

from views.api import passes as pass_api
from views.api import location as loc_api
from views.api import passlist as list_api


from views import admin, services, resource


application = tornado.wsgi.WSGIApplication([
    

    # index - # TODO - new dashboard module
    #(r"/", index.LandingPage),
    (r"/", index.PassticheIndex),
    (r"/costanza", index.PassticheIndex),

    (r"/confirm/(?P<user_key>[^\/]+)/?", account.ConfirmAccount),   
    (r"/dashboard", account.Dashboard),

 

    (r"/login", auth.Login),
    (r"/logout", auth.Logout),
    (r"/signup", auth.Signup),

    (r"/docs", index.Docs),
    (r"/docs/(?P<path>[^\/]+)?", index.Docs),    
    # shortcut login
    (r'/login/(?P<email>[^\/]+)/?', auth.Login),

    # pass URLs 
    #(r'/pt/(?P<pass_id>[^\/]+)/(?P<letter_code>[^\/]+)/?', index.PassURL),     
    (r'/p/(?P<pass_code>[^\/]+)/?', index.PassDownload),   
    (r'/u/(?P<pass_code>[^\/]+)/?', index.UserPassDownload),   
    (r'/pd/(?P<pass_code>[^\/]+)/?', index.PassDirectDownload),
    (r'/ud/(?P<pass_code>[^\/]+)/?', index.UserPassDirectDownload),               

    # ajax
    (r'/ajax/user\.email_signup/?', ajax_index.EmailSignup), 
    (r'/ajax/user\.edit/?', ajax_index.EditProfile), 


    #(r'/ajax/pass\.save/?', ajax_index.SavePass),    
    (r'/ajax/pass\.send/?', ajax_index.SendPass),     
    (r'/ajax/pass\.callback/?', ajax_index.PassCallback),         


    (r'/api/(?P<api_version>[\d\.]*)/pass\.find/?', pass_api.FindPass), 
    (r'/api/(?P<api_version>[\d\.]*)/pass\.update/?', pass_api.UpdatePass), 
    (r'/api/(?P<api_version>[\d\.]*)/loc\.find/?', loc_api.FindLocation), 
    (r'/api/(?P<api_version>[\d\.]*)/loc\.update/?', loc_api.UpdateLocation), 
    (r'/api/(?P<api_version>[\d\.]*)/list\.find/?', list_api.FindList),  
    (r'/api/(?P<api_version>[\d\.]*)/list\.update/?', list_api.UpdateList), 

    # resources
    #(r"/r/badge\.js", resource.StaticResourceHandler),
    #(r"/r/badge\.css", resource.StaticResourceHandler),    
    (r"/r/([\.0-9a-zA-Z-_]+)/?", resource.StaticResourceHandler),    
    (r"/img/p/([0-9a-zA-Z-_]+)/?", resource.PassImageHandler),   

    # admin
    (r"/admin/login/(?P<email>[^\/]+)?", auth.AdminLogin),
    (r"/admin/mail/?", admin.Email),
    (r"/admin/run/(?P<task>[^\/]+)?", admin.RunTask),

    (r'/_4sq_callback/?', services.FoursquareCallback), 
    (r'/_4sq_push/?', services.FoursquarePush), 

    # Apple registration URL
    (r'/_ps/v1/devices/(?P<deviceID>[^\/]+)/registrations/(?P<pass_type>[^\/]+)/(?P<serial>[^\/]+)?', services.PassbookRegister), 
    (r'/_ps/v1/devices/(?P<deviceID>[^\/]+)/registrations/(?P<pass_type>[^\/]+)/?', services.PassbookGetSerials), 
    (r'/_ps/v1/passes/(?P<pass_type>[^\/]+)/(?P<serial>[^\/]+)?', services.PassbookGetPass), 
    (r'/_ps/v1/log?', services.PassbookLog),     
    # GAE handlers
    (r'/_ah/channel/disconnected/', gae.ChannelDisconnect),
    (r'/_ah/channel/connected/', gae.ChannelConnect),
    
  
     
    (r'.*', index.PageNotFound)
    # TODO: for 404 deliver static compiled resource
           
], **settings)


