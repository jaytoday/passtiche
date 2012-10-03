import os
from utils.gae import GetUrl, IPAddress
from utils import defer
from utils.cache import cache


def send_admin_email(*args, **kwargs):
    
    @cache(key='subject', time=1200)
    def task(subject=None, message=None, admins=None, 
    user=None, user_agent=None, ip=None, attachments=None, url=None):
        if not user_agent:
            user_agent = os.environ.get('HTTP_USER_AGENT', 'Unknown User Agent')
        if not url:
            url = GetUrl()
        if not ip:
            ip = IPAddress()
        from backend.mail.base import EmailMessage
        if not admins:
            admins = ['james@hiptype.com','sohail@hiptype.com']
        for admin in admins:
            email_msg = EmailMessage(
                duplicate_check=False,
                subject=subject, 
                to=admin, 
                context={
                    'message': message,
                    'url': url,
                    'ip': ip,
                    'user_agent': user_agent,
                    'user': user
                }, 
                template="admin_report.html",
                attachments=attachments,
                mixpanel=False)
            email_msg.send()  
        
    defer.execute_task(task, *args, **kwargs)        