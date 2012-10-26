import logging

from lib.twilio.rest import TwilioRestClient

account = "ACcb8766923c7bfc4c1dcb436d5fc143a7"
token = "c7df7d35b801fb4c14bc2be1cfdd96d2"


def send_sms(message, number):
	client = TwilioRestClient(account, token)
	message = client.sms.messages.create(to="+" + number, from_="+19252031749",
                                     body=message)
