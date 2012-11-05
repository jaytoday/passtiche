import datetime, time
import logging


def expired(last_time, expire_time, now=None):
    """Accepts the last time a value was updated, and expire_time.
        Optionally accepts the current time value (to be stateless), defaults to time.time().
        Returns boolean if more than expire_time seconds have elapsed since last time.
    """
    now = now if now is not None else time.time()
    return (now - last_time) >= expire_time
    

def valid_since(since):
    '''Accepts string and returns an int'''
    if since == 'day':
        since = int(time.time() - (24*60*60))
    elif since == 'week':
        since = int(time.time() - (24*60*60*7))
    elif since == 'month':
        since = int(time.time() - (24*60*60*30))
    elif not since or since == 'all':
        since = 0
    else:
        try:
            since = int(float(since))
        except:
            since = 0
    return since   
    
    
def time_remaining(seconds=0, timestamp=None, absolute=True, time_format="%A, %B %d"):
    """ return time remaining until a given relative or absolute time """
    current_time = datetime.datetime.fromtimestamp(time.time())
    if not timestamp:
        timestamp = time.time() + seconds
    end_time = datetime.datetime.fromtimestamp(timestamp)
    if absolute and (timestamp - time.time() > 86400):
            time_val = end_time.strftime(time_format)
            time_str = "by"
    else:
        from django.utils.timesince import timesince
        time_val = timesince(current_time, now=end_time)
        time_str = "within"
    if absolute: # use dedicated kwarg instead?
        return "%s %s" % (time_str, str(time_val).replace(' 0', ' '))
    else:
        return time_val
        
        
def american_date_to_iso_date(date_string):
    """Converts American date to iso date.
        10/02/2009 => 2009-10-02
        
    TODO: refactor as more generic date format converter using datetime methods
    """
    try:
        month, day, year = date_string.split('/')
        return '%s-%s-%s' % (year, month, day)
    except:
        return None

def days_hours_minutes(td):
    """ convert timedelta to days, hours, minutes """
    return td.days, td.seconds//3600, (td.seconds//60)%60

def seconds_ago(time_s):
    """ helper function to compute datetime time_s seconds ago """
    return datetime.datetime.now() - datetime.timedelta(seconds=time_s)

def days_ago(time_d):
    """ helper function to compute datetime time_d days ago """
    return datetime.datetime.now().date() - datetime.timedelta(days=time_d)

def days_since(orig_time, time_d):
    """ helper function to compute datetime days before orig_time """
    return orig_time - datetime.timedelta(days=time_d)
