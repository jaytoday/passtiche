
import logging
import unittest
import requests
import random
rando = random.randint(9999,99999)
# https://developers.google.com/appengine/docs/python/tools/localunittesting


BASE_URL = 'http://localhost:8080'


class TestCase(unittest.TestCase):
    def setUp(self):
        # Create a WSGI application.
        pass

    def fetch(self, path, **kwargs):

        '''
        Requests module:
            requests.get
            request.post('', params={})
            r.status_code
            r.encoding
            r.text
            r.json

        '''   
        request_method = getattr(requests, kwargs.get('method','get'))
        if 'method' in kwargs: del kwargs['method']
        self.response = request_method(BASE_URL + path, **kwargs)


class WebsiteTestCases(TestCase):

    def __init__(self, *args, **kwargs):
        self.email, self.pw = 'test_%s@test.test' % rando, 'test_%s' % rando
        super(WebsiteTestCases, self).__init__(*args, **kwargs)

    
    def testLandingPage(self):
        self.fetch('/') 
        self.assertEqual(self.response.status_code, 200) 

     
    def testAuth(self):
        self.fetch('/login') 
        self.assertEqual(self.response.status_code, 200)  
        self.fetch('/signup') 
        self.assertEqual(self.response.status_code, 200) 


        # try to go to protected dashboard URL
        self.fetch('/dashboard')
        self.assertEqual(self.response.url, BASE_URL + '/login')  

        # now try login with incorrect info
        self.fetch('/login',method='post',params={'email': self.email, 'password': self.pw})
        self.assertEqual(self.response.status_code, 402)  

        # now register
        self.fetch('/signup',method='post',params={'email': self.email, 'password': self.pw})
        self.assertEqual(self.response.url, BASE_URL + '/dashboard')        

        # now signout 
        self.fetch('/logout',)
        self.assertEqual(self.response.url, BASE_URL + '/')  

        # now login
        self.fetch('/login',method='post',params={'email': self.email, 'password': self.pw})
        self.assertEqual(self.response.url, BASE_URL + '/dashboard')  
    
    def testErrors(self):
        self.fetch('/%s' % rando) 
        self.assertEqual(self.response.status_code, 404) 


if __name__ == '__main__':
    unittest.main()