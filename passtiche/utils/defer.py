import logging
from google.appengine.ext import deferred
import gae as gae_utils

def execute_task(task_fxn, *arg, **kwargs):
    try:
      task_fxn(*arg, **kwargs)
    except:
        if gae_utils.Debug():
            raise
        else:
            if 'AppEngine' not in gae_utils.GetUserAgent():
                raise  # not being run from bg queue
            from backend.admin import send_admin_email
            from utils.gae import error_msg
            error, err_msg = error_msg()
            retry_task = False
            for retry_error in ['DownloadError','DeadlineExceededError']:
                if retry_error in error:
                    retry_task = True
            task_msg = 'Task: %s' % (err_msg)
            subject = 'Task: %s' % (error)
            if retry_task: 
                task_msg = 'Retrying Task - ' + task_msg
                subject = 'Retrying Task - ' + subject                                 
            send_admin_email(subject, task_msg)
            logging.critical(task_msg)
            if retry_task:
                raise       
            raise deferred.PermanentTaskFailure  
            # this stops the task from being retried            
