![Passtiche](http://www.passtiche.com/static/images/logo/logo_white_text_small.png)

# Passtiche

# Menu
* [Introduction](#introduction)
* [System Architecture](#system-architecture) 
    * [Overview](#overview)
    * [Badge.js](#badgejs)
    * [Passbook Server](#passes)       
    * [Dashboard](#dashboard)
* [Getting Started](#getting-started)


## Introduction

Passtiche is a thing. It helps you:

* Foo
* Bar
* Di


## System Architecture

* [Overview](#overview)
* [Badge.js](#badgejs)
* [Passbook Server](#passes)
* [Dashboard](#dashboard)

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

## Users

### Create User

    POST /users

    $ curl -X POST -H Content-Type:application/json \
    -u key:secret http://api.crowdtilt.com/v1/users \
    -d'
    {
       "user" : {
          "firstname" : "foo",
          "lastname" : "bar",
          "email" : "user@example.com"
       }
    }'

#### Response Body

    {
        "user": {
            "id": "USREC5",
            "email": "foo.bar@gmail.com",
            "firstname": "Foo",
            "lastname": "Bar",
            "is_verified": 0,
            "img": "http://example.com/profile.png",
            "creation_date": "2011-07-02T14:20:48Z",
            "last_login_date": "2012-09-22T01:55:49Z",
            "uri": "/v1/users/USREC5",
            "campaigns_uri": "/v1/users/USREC5/campaigns",
            "paid_campaigns_uri": "/v1/users/USREC5/paid_campaigns",
            "payments_uri": "/v1/users/USREC5/payments",
            "metadata": {}
        }
    }

#### Response Codes

    201 => Created
    400 => Bad Request


### Verify User

In order for a user to receive money raised from a campaign, the user's identity
needs to be verified.  A user is verified by `POST`ing verification data to the
`/users/:id/verification`.

The verification data is as follows:

* `name` - should be the real name of the user
* `dob` - the date of birth of the user in the format YYYY-MM
* `phone_number` - the user's phone number
* `street_address` - the user's street address
* `postal code` - the user's postal code

In some cases, if the user cannot be fully verified with this information, we
may return a `449` response indicating that we need more info.  In these cases
you should re-post the data with the additional `ssn` field containing the
user's social security number for additional verification.

Once the verification has succeeded, `is_verified` on the user object
will be set to 1 to reflect this change.

    POST /users/:id/verification

    $ curl -X POST -H Content-Type:application/json -u key:secret \
    http://api.crowdtilt.com/v1/users/USREC5 \
    -d'
    {
       "verification" : {
          "name" : "Khaled Hussein",
          "dob" : "1984-07",
          "phone_number" : "(000) 000-0000",
          "street_address" : "324 awesome address, awesome city, CA",
          "postal_code" : "12345"
       }
    }'

#### Response Body

    {}

#### Response Codes

    200 => OK
    400 => Bad Data, or Could not Verify admin information
    449 => Retry with SSN


### Authenticate User

To authenticate a user, you can pass in the user's login credentials, email and
password, as query parameters.

    GET /users/authentication?email=user@example.com&password=mypassword

#### Response Body

    {
       "user" : {
          "id" : "USRB07",
          "firstname" : "foo",
          "lastname" : "bar",
          "img" : null,
          "email" : "user@example.com",
          "is_verified" : 0,
          "creation_date" : "2012-09-26T10:22:03.900529000Z",
          "last_login_date" : "2012-09-26T17:22:20Z"
       }
    }

#### Response Codes

    302 => Found
    401 => Unauthorized


### Get User

    GET  /users/:id

    $ curl -u key:secret \
    https://api.crowdtilt.com/v1/users/USREC5

#### Response Body

    {
        "user": {
            "id": "USREC5",
            "email": "foo.bar@gmail.com",
            "firstname": "Foo",
            "lastname": "Bar",
            "is_verified": 1,
            "img": "http://example.com/profile.png",
            "creation_date": "2011-07-02T14:20:48Z",
            "last_login_date": "2012-09-22T01:55:49Z",
            "uri": "/v1/users/USREC5",
            "campaigns_uri": "/v1/users/USREC5/campaigns",
            "paid_campaigns_uri": "/v1/users/USREC5/paid_campaigns",
            "payments_uri": "/v1/users/USREC5/payments",
            "metadata": {}
        }
    }

#### Response Codes

    200 => OK


### List Users

    GET /users

    $ curl -u key:secret https://api.crowdtilt.com/v1/users

#### Response Body

    {
        "pagination": {
            "total_pages": 1,
            "page": 1,
            "total_entries": 2,
            "per_page": 50
        },
        "users": [
            {
                "id": "USREC5",
                "email": "foo.bar@gmail.com",
                "firstname": "Foo",
                "lastname": "Bar",
                "is_verified": 0,
                "img": "http://example.com/profile.png",
                "creation_date": "2011-07-02T14:20:48Z",
                "last_login_date": "2012-09-22T01:55:49Z",
                "uri": "/v1/users/USREC5",
                "campaigns_uri": "/v1/users/USREC5/campaigns",
                "paid_campaigns_uri": "/v1/users/USREC5/paid_campaigns",
                "payments_uri": "/v1/users/USREC5/payments",
                "metadata": {}
            },
            .
            .
            .
        ]
    }

#### Response Codes

    200 => OK


### Update User

Currently, this request supports partial PUTs. For example, you can do a request
to update a single attribute without having to send the full
[user object](#user-definition).

    PUT /users/:id

    $ curl -X PUT -HContent-Type:application/json -u key:secret \
    http://api.crowdtilt.com/v1/users/USREC5 \
    -d'
    {
        "user": {
            "lastname": "new last name"
        }
    }'

#### Response Body

    {
        "user": {
            "id": "USREC5",
            "email": "foo.bar@gmail.com",
            "firstname": "Foo",
            "lastname": "new last name",
            "is_verified": 0,
            "img": "http://example.com/profile.png",
            "creation_date": "2011-07-02T14:20:48Z",
            "last_login_date": "2012-09-22T01:55:49Z",
            "uri": "/v1/users/USREC5",
            "campaigns_uri": "/v1/users/USREC5/campaigns",
            "paid_campaigns_uri": "/v1/users/USREC5/paid_campaigns",
            "payments_uri": "/v1/users/USREC5/payments",
            "metadata": {}
        }
    }

#### Response Codes

    200 => OK


## Passes

### Get Passes

This resource returns all the campaigns that the user has created as well as the
campaigns that he paid for.

    GET /users/:id/campaigns

    $ curl -u key:secret \
    https://api.crowdtilt.com/v1/users/USREC5/campaigns

#### Response Body

    {
        "pagination": {
            "total_pages": 0,
            "page": 1,
            "total_entries": 0,
            "per_page": 50
        },
        "campaigns": [
            {
                "id": "CMPBDA",
                "user_id": "USREC5",
                "title": "Campaign Title",
                "description": "some description",
                "privacy": 1,
                "tilt_amount": 100,
                "min_payment_amount": 0,
                "fixed_payment_amount": 0,
                "expiration_date": "2000-01-02T01:02:03Z",
                "is_tilted": 0,
                "is_paid": 0,
                "is_expired": 0,
                "tax_id": null,
                "tax_name": null,
                "uri": "/v1/campaigns/CMPBDA",
                "payments_uri": "/v1/campaigns/CMPBDA/payments",
                "admin": { "id": "USREC5", "uri": "/v1/users/USREC5", ... },
                "metadata": { },
                "stats": {
                    "tilt_percent": 0,
                    "raised_amount": 0,
                    "unique_contributors": 0,
                    "number_of_payments": 0
                }
            },
            .
            .
            .
        ]
    }

#### Response Codes

    200 => OK


### Get User Campaign

This resource returns a specific campaign created by this user.

    GET /users/:id/campaigns/:id

    $ curl -u key:secret \
    https://api.crowdtilt.com/v1/users/USREC5/campaigns/CMP96B

#### Response Body

    {
       "campaign" : {
          "img" : null,
          "metadata" : { },
          "id" : "CMP96B",
          "is_paid" : 0,
          "privacy" : 1,
          "is_expired" : 1,
          "fixed_payment_amount" : 0,
          "tilt_amount" : 100,
          "description" : "some description",
          "uri" : "/v1/campaigns/CMP96B",
          "creation_date" : "2012-10-19T15:09:01.869085000Z",
          "first_contributor" : { "id" : "USR123", "uri" : "/v1/users/USR123", ... },
          "tilter" : { "id" : "USR456", "uri" : "/v1/users/USR456", ... },
          "user_id" : "USR521",
          "title" : "some title",
          "modification_date" : "2012-10-19T15:09:01.869085000Z",
          "stats" : {
             "tilt_percent" : 0,
             "raised_amount" : 0,
             "unique_contributors" : 0,
             "number_of_payments" : 0
          },
          "expiration_date" : "2000-01-02T01:02:03Z",
          "is_tilted" : 0,
          "admin": { "id": "USREC5", ... },
          "min_payment_amount" : 0,
          "tax_id" : null,
          "tax_name" : null,
          "payments_uri" : "/v1/campaigns/CMP96B/payments"
       }
    }

#### Response Codes

    200 => OK


### Get User Paid Campaigns

This resource returns all the campaigns that the user paid for.

    GET /users/:id/paid_campaigns

    $ curl -u key:secret \
    https://api.crowdtilt.com/v1/users/USREC5/campaigns/CMP96B

#### Response Body

    {
        "pagination": {
            "total_pages": 0,
            "page": 1,
            "total_entries": 0,
            "per_page": 50
        },
        "campaigns": [
            {
                "id": "CMPBDA",
                "user_id": "USREC5",
                "title": "Campaign Title",
                "description": "some description",
                "privacy": 1,
                "tilt_amount": 100,
                "min_payment_amount": 0,
                "fixed_payment_amount": 0,
                "expiration_date": "2000-01-02T01:02:03Z",
                "is_tilted": 0,
                "is_paid": 0,
                "is_expired": 0,
                "tax_id": null,
                "tax_name": null,
                "uri": "/v1/campaigns/CMPBDA",
                "admin": { "id": "USREC5", "uri": "/v1/users/USREC5", ... },
                "payments_uri": "/v1/campaigns/CMPBDA/payments",
                "metadata": { },
                "stats": {
                    "tilt_percent": 0,
                    "raised_amount": 0,
                    "unique_contributors": 0,
                    "number_of_payments": 0
                }
            },
            .
            .
            .
        ]
    }

#### Response Codes

    200 => OK

## Dashboard

### Create User Card

    POST /users/:id/cards

    $ curl -X POST -u key:secret -H Content-Type:application/json\
    https://api.crowdtilt.com/v1/users/USR50A/cards\
    -d'
    {
        "card": {
            "expiration_year":2023,
            "security_code":123,
            "expiration_month":"01",
            "number":"4111111111111111"
        }
    }
    '

#### Response Body

    {
        "cards" : [
              {
                 "last_four" : "1111",
                 "expiration_year" : 2023,
                 "expiration_month" : "01",
                 "user": { "id" : "USR50A", "uri" : "/v1/users/USR50A", ... },
                 "uri" : "/v1/users/USR50A/cards/CCP6D6",
                 "card_type" : "VISA card",
                 "creation_date" : "2012-08-23T07:42:46.134467000Z",
                 "metadata" : {},
                 "id" : "CCP6D6E7E7C0C5C11E2BD7001E2CFE628C0"
              },
              ...
          ]
    }

#### Response Codes

    201 => Created


### Get User Card

    GET /users/:id/cards/:id

    $ curl -u key:secret \
    https://api.crowdtilt.com/v1/users/USR50A/cards/CCP6D6

#### Response Body

    {
        "card": {
            "last_four" : "1234",
                "expiration_year" : 2034,
                "expiration_month" : "04",
                "user": { "id" : "USR50A", "uri" : "/v1/users/USR50A", ... },
                "uri" : "/v1/users/USR50A/cards/CCP6D6",
                "card_type" : null,
                "creation_date" : "2012-08-23T07:42:46.134467000Z",
                "metadata" : {},
                "id" : "CCP6D6E7E7C0C5C11E2BD7001E2CFE628C0"
        }
    }

#### Response Codes

    200 => OK


### List Dashboard

#### Request

    GET /users/:id/cards

#### Response Body

    {
        "pagination": {
            "total_pages": 0,
            "page": 1,
            "total_entries": 0,
            "per_page": 50
        },
        "cards": []
    }

#### Response Codes

    200 => OK


### Update User Card

Card information cannot be updated once it is set.  You can however, modify
the `metadata` of a Card. That is the only thing modifiable with this
request.  Other fields submitted will be ignored.

    PUT /users/:id/cards/:id

#### Request Body

    {
        "card": {
            "metadata" : {
                "key1" : "value1"
            }
        }
    }

#### Response Body

    {
        "card": {
            "last_four" : "1234",
                "expiration_year" : 2034,
                "expiration_month" : "04",
                "user": { "id": "USR50A", ... },
                "uri" : "/v1/users/USR50A/cards/CCP6D6",
                "card_type" : null,
                "creation_date" : "2012-08-23T07:42:46.134467000Z",
                "metadata" : {
                    "key1" : "value1"
                },
                "id" : "CCP6D6E7E7C0C5C11E2BD7001E2CFE628C0"
        }
    }

#### Response Codes

    200 => OK


### Delete User Card

    DELETE /users/:id/cards/:id

#### Response Codes

    200 => OK


## User Banks

### Create User Bank

    POST /users/:id/banks

    {
        "bank": {
            "account_number" : "1234567890",
            "name" : "Bank Name",
            "bank_code" : "123451234",
        }
    }

#### Response Body

    {
        "bank": {
            "account_number_last_four" : "1234",
            "metadata" : {},
            "id" : "BAP688E65FA0C6D11E28914FE5E5CD73F12",
            "name" : "Bank Name",
            "user": { "id" : "USR54B", "uri" : "/v1/users/USR54B", ... },
            "bank_code_last_four" : "1234",
            "uri" : "/v1/users/USR54B/banks/BAP688"
        }
    }

#### Response Codes

    201 => Created


### Get User Bank

    GET /users/:id/banks/:id

#### Response Body

    {
        "bank" : {
            "account_number_last_four" : "1234",
            "metadata" : {},
            "id" : "BAP688E65FA0C6D11E28914FE5E5CD73F12",
            "name" : "John Doe",
            "user": { "id" : "USR54B", "uri" : "/v1/users/USR54B", ... },
            "bank_code_last_four" : "1234",
            "uri" : "/v1/users/USR54B/banks/BAP688"
        }
    }

#### Response Codes

    200 => OK


### List User Banks

This resource lists the bank accounts associated with this user.

    GET /users/:id/banks

#### Response Body

    {
        "pagination": {
            "total_pages": 0,
            "page": 1,
            "total_entries": 0,
            "per_page": 50
        },
        "banks": [
            {
                "account_number_last_four" : "1234",
                "metadata" : {},
                "id" : "BAP688E65FA0C6D11E28914FE5E5CD73F12",
                "name" : "John Doe",
                "user": { "id" : "USR54B", "uri" : "/v1/users/USR54B", ... },
                "bank_code_last_four" : "1234",
                "uri" : "/v1/users/USR54B/banks/BAP688"
            }
        ]
    }

#### Response Codes

    200 => OK


### Update User Bank

Bank information cannot be updated once it is set.  You can however, modify
the `metadata` of a bank account. That is the only thing modifiable with this
request.  Other fields submitted will be ignored.

    PUT /users/:id/banks/:id

#### Request Body

    {
        "bank" : {
            "metadata" : {
                "key1" : "value1"
            }
        }
    }

#### Response Body

    {
        "bank" : {
            "account_number_last_four" : "1234",
            "metadata" : {
                "key1" : "value1"
            },
            "id" : "BAP688E65FA0C6D11E28914FE5E5CD73F12",
            "name" : "John Doe",
            "user": { "id" : "USR54B", "uri" : "/v1/users/USR54B", ... },
            "bank_code_last_four" : "1234",
            "uri" : "/v1/users/USR54B/banks/BAP688"
        }
    }

#### Response Codes

    200 => OK


### Delete User Bank

    DELETE /users/:id/banks/:id

### Response Codes

    200 => OK


## User Payments

### List User Payments

    GET /users/:id/payments

#### Response Body

    {
        "pagination": {
            "total_pages": 0,
            "page": 1,
            "total_entries": 0,
            "per_page": 50
        },
        "payments": []
    }

#### Response Codes

    Yes.




## Getting Started

The default limits can be changed with ``per_page`` and ``page`` request
parameters. For example:

    GET /users?page=2&per_page=10

Running the Server
=====================================
Download the Google AppEngine Python development environment at http://code.google.com/appengine/downloads.html.

Run with extra flags (Info menu from GAE launcher):
	--datastore_path=PATH



