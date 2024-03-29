from lib.twilio.rest.resources.notifications import Notifications
from lib.twilio.rest.resources.recordings import Recordings
from lib.twilio.rest.resources.util import normalize_dates, parse_date
from lib.twilio.rest.resources import InstanceResource, ListResource


class Call(InstanceResource):
    """ A call resource """

    BUSY = "busy"
    CANCELED = "canceled"
    COMPLETED = "completed"
    FAILED = "failed"
    IN_PROGRESS = "in-progress"
    NO_ANSWER = "no-answer"
    QUEUED = "queued"
    RINGING = "ringing"

    subresources = [
        Notifications,
        Recordings,
    ]

    def hangup(self):
        """ If this call is currenlty active, hang up the call.
        If this call is scheduled to be made, remove the call
        from the queue
        """
        a = self.parent.hangup(self.name)
        self.load(a.__dict__)

    def cancel(self):
        """ If the called is queued or rining, cancel the calls.
        Will not affect in progress calls
        """
        a = self.parent.cancel(self.name)
        self.load(a.__dict__)

    def route(self, **kwargs):
        """Route the specified :class:`Call` to another url.

        :param url: A valid URL that returns TwiML.
        :param method: HTTP method Twilio uses when requesting the above URL.
        """
        a = self.parent.route(self.name, **kwargs)
        self.load(a.__dict__)


class Calls(ListResource):
    """ A list of Call resources """

    name = "Calls"
    instance = Call

    @normalize_dates
    def list(self, from_=None, ended_after=None,
             ended_before=None, ended=None, started_before=None,
             started_after=None, started=None, **kwargs):
        """
        Returns a page of :class:`Call` resources as a list. For paging
        informtion see :class:`ListResource`

        :param date after: Only list calls started after this datetime
        :param date before: Only list calls started before this datetime
        """
        kwargs["from"] = from_
        kwargs["StartTime<"] = started_before
        kwargs["StartTime>"] = started_after
        kwargs["StartTime"] = parse_date(started)
        kwargs["EndTime<"] = ended_before
        kwargs["EndTime>"] = ended_after
        kwargs["EndTime"] = parse_date(ended)
        return self.get_instances(kwargs)

    def create(self, to, from_, url, status_method=None, **kwargs):
        """
        Make a phone call to a number.

        :param string to: The phone number to call
        :param string `from_`: The caller ID (must be a verified Twilio number)
        :param string url: The URL to read TwiML from when the call connects
        :param method: The HTTP method Twilio should use to request the url
        :type method: None (defaults to 'POST'), 'GET', or 'POST'
        :param string fallback_url: A URL that Twilio will request if an error
            occurs requesting or executing the TwiML at url
        :param string fallback_method: The HTTP method that Twilio should use
            to request the fallback_url
        :type fallback_method: None (will make 'POST' request), 'GET', or 'POST'
        :param string status_callback: A URL that Twilio will request when the
            call ends to notify your app.
        :param string status_method: The HTTP method Twilio should use when
            requesting the above URL.
        :param string if_machine: Tell Twilio to try and determine if a machine
            (like voicemail) or a human has answered the call.
            See more in our `answering machine documentation
            <http://www.twilio.com/docs/api/rest/making_calls#handling-outcomes-answering-machines">`_.
        :type if_machine: None, 'Continue', or 'Hangup'
        :param string send_digits: A string of keys to dial after
            connecting to the number.
        :type send_digits: None or any combination of
            (0-9), '#', '*' or 'w' (to insert a half second pause).
        :param int timeout: The integer number of seconds that Twilio should
            allow the phone to ring before assuming there is no answer.
        :param string application_sid: The 34 character sid of the application
            Twilio should use to handle this phone call.
            Should not be used in conjunction with the url parameter.

        :return: A :class:`Call` object
        """
        kwargs["from"] = from_
        kwargs["to"] = to
        kwargs["url"] = url
        kwargs["status_callback_method"] = status_method
        return self.create_instance(kwargs)

    def update(self, sid, **kwargs):
        return self.update_instance(sid, kwargs)

    def cancel(self, sid):
        """ If this call is queued or ringing, cancel the call.
        Will not affect in-progress calls.

        :param sid: A Call Sid for a specific call
        :returns: Updated :class:`Call` resource
        """
        return self.update(sid, status=Call.CANCELED)

    def hangup(self, sid):
        """ If this call is currently active, hang up the call. If this call is
        scheduled to be made, remove the call from the queue.

        :param sid: A Call Sid for a specific call
        :returns: Updated :class:`Call` resource
        """
        return self.update(sid, status=Call.COMPLETED)

    def route(self, sid, url, method="POST"):
        """Route the specified :class:`Call` to another url.

        :param sid: A Call Sid for a specific call
        :param url: A valid URL that returns TwiML.
        :param method: The HTTP method Twilio uses when requesting the URL.
        :returns: Updated :class:`Call` resource
        """
        return self.update(sid, url=url, method=method)
