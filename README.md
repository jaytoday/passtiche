<img src="http://www.passtiche.appspot.com/static/images/logo/logo_black_text_small.png" style="width:00px;"/>

* [Overview](#overview)
* [System Architecture](#system-architecture) 
    * [Badge.js](#badgejs)
    * [APIs](#apis)
    * [Passbook Server](#passes)       
    * [Dashboard](#dashboard)
* [Local Development](#local-development)


## Overview

Passtiche is a website plugin that brings Passbook to your website or mobile app with just a couple lines of code.

* Passtiche auto-generates badges for listings or links to existing Passbook files
* Visitors can download your passes via SMS or email and share them with friends
* Listings passes are automatically enhanced with extra info from Yelp & Foursquare
* Schedule personalized alerts & reminders to be sent as Passbook notifications

See the [Passtiche Documentations](http://www.passtiche.appspot.com/docs) for details.

## System Architecture

Passtiche runs on [Tornado](http://www.tornadoweb.org/). 

The Passtiche stack includes:

* A javascript library that can be included on a website with `<script src="http://passtiche.appspot.com/js>` 
* A Passbook server that creates, updates, signs, and delivers pass files.
* A website with dashboard for managing passes and account settings.

### Framework

Passtiche uses the following object-oriented MVC framework:

* All request handlers inherit from `BaseHandler` in `views.base`
* Website request handlers inherit from ViewHandler` in `views.website.index`
* API request handlers inherit from `AjaxHandler` in `views.api.index`
* Ajax request handlers inherit from `AjaxHandler` in `views.ajax.index`
* Resource request handlers (for images and other media) are in `views.resource` module
* Authentication handlers are in `views.website.auth`, with some helper methods in `BaseHandler`

* Models are in `model` directory and inherit from `BaseModel` in `postal code`.
* A datastore viewier is available at `/_ah/admin` on the local server and from the productin dashboard. 

* Classes and functions for the backend "heavy lifting" are in the `backend` directory. 

* Templates for the website are in the `templates/website` directory. 
* Javascript and CSS are in the `static` directory, with some portions included via the `templates` directory. 

There are more components for emails, third-party API access, utilities, tests, etc. If you get lost, start with `app.yaml` and `main.py`.


## Badge.js

The initial script loaded via `<script src="http://passtiche.appspot.com/js>` is located at `static/js/badge/badge.js`. 
This script contains a `PassticheBadger` class. When initiated, this class finds all links that either link to a *pkpass* file or contain supported data attributes.
From the  `PassticheBadger.addBadge` method, supported links on the page are injected with markup containing an *Add to Passbook* badge image.

The initial `PassticheBadger` class also calls a `PassticheBadger.loadResources` method when initiated, and this method adds HTML tags to the page that retrieve CSS and JS for the badge dialog. 
`dialog.js` and `dialog.css` are in the `templates.resources` directory, and are loaded via `resource.StaticResourceHandler`. 

`dialog.js` contains a `PassticheDialog` class. When initiated, this class calls `PassticheBadger.findBadges` method, which makes an ajax call to the `pass.find` API endpoint.
This API (described below) gets data for each of the passes, creating a new pass and looking up location data when necessary. The ajax call also returns HTML for the badge dialog, which is added to the DOM. 

When a badge is clicked, `PassticheBadger.badgeClick` is triggered, which then calls `PassticheDialog.openPassDialog`. 
The dialog class also contains methods for sending passes and other actions within the dialog.


## APIs

### Pass.Find

### Pass.Update

    
## Passbook Server

The passbook server consists of components on GAE, as well as a Heroku server that handles the security certificate signing (which requires a C-based library). 

When a pass link in the format `/p/$short_code` is visited, the badge dialog is loaded. 
From the request handler in  `views.website.index`, the user agent is checked. If the UA supports passbook, the browser is redirected to `/pd/$short_code`. 

The `views.website.index.PassDirectDownload` request handler redirects to a *pkpass* file if the pass is remotely located. 
Otherwise, it calls `backend.passes.passfile.PassFile`. This class creates the `pass.json` for the pass and sends the JSON and a few other fields to the Heroku server, located in `repo/heroku`.
The heroku server then zips a pkpass file and sends it back to GAE, which writes it along with the correct MIMETYPE. 

### Pass fields

### Push Notifications


## Online Dashboard 

### Managing Passes

### Account Settings


## Local Development

### Getting Setup with GAE

Download the Google AppEngine Python development environment at http://code.google.com/appengine/downloads.html.

Run with extra flags (Info menu from GAE launcher):
	--datastore_path=PATH

### Getting Setup with Heroku 

### Local Python Console

Go to `/console` (admin login required) for a python console that makes it easy to call functions in the codebase and run queries. 




#### Sub-sub

#### Copy

    201 => Created
    400 => Bad Request
    

<table>
    <thead>
        <tr>
            <th>Path</th>
            <th>HTTP Methods</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/users</td>
            <td>
                <a href="#list-users">GET</a>
                <a href="#create-user">POST</a> </td>
            <td> List of users </td>
        </tr>
        <tr>
            <td>/users/authentication</td>
            <td>
                <a href="#authenticate-user">GET</a>
            </td>
            <td> Authenticate a user</td>
        </tr>
        <tr>
            <td>/users/:id</td>
            <td>
                <a href="#get-user">GET</a>
                <a href="#update-user">PUT</a>
            </td>
            <td> A specific user </td>
        </tr>
        <tr>
            <td>/users/:id/verification</td>
            <td>
                <a href="#verify-user">POST</a>
            </td>
            <td> Verify a user to receive payments </td>
        </tr>
        <tr>
            <td>/users/:id/campaigns</td>
            <td>
                <a href="#get-passes">GET</a>
            </td>
            <td> All campaigns the user is involved with </td>
        </tr>
        <tr>
            <td>/users/:id/paid_campaigns</td>
            <td>
                <a href="#get-user-paid-campaigns">GET</a>
            </td>
            <td> Campaigns this user paid for </td>
        </tr>
        <tr>
            <td>/users/:id/cards</td>
            <td>
                <a href="#list-dashboard">GET</a>
                <a href="#create-user-card">POST</a>
            </td>
            <td>User credit cards</td>
        </tr>
        <tr>
            <td>/users/:id/cards/:id</td>
            <td>
                <a href="#get-user-card">GET</a>
                <a href="#update-user-card">PUT</a>
                <a href="#delete-user-card">DELETE</a>
            </td>
            <td>A specific credit card</td>
        </tr>
        <tr>
            <td>/users/:id/banks</td>
            <td>
                <a href="#list-user-banks">GET</a>
                <a href="#create-user-bank">POST</a>
            </td>
            <td>User bank accounts</td>
        </tr>
        <tr>
            <td>/users/:id/banks/:id</td>
            <td>
                <a href="#get-user-bank">GET</a>
                <a href="#update-user-bank">PUT</a>
                <a href="#delete-user-bank">DELETE</a>
            </td>
            <td>A specific bank account</td>
        </tr>
        <tr>
            <td>/users/:id/payments</td>
            <td>
                <a href="#list-user-payments">GET</a>
            </td>
            <td> A list of Users payments</td>
        </tr>
    </tbody>
</table>


The verification data is as follows:

* `name` - should be the real name of the user
* `dob` - the date of birth of the user in the format YYYY-MM
* `phone_number` - the user's phone number
* `street_address` - the user's street address
* `postal code` - the user's postal code

