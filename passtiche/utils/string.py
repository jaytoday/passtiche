import time, datetime
import random
import hashlib
import re
import logging



def truncate_by_words_if_long(title, limit):
    """Accept title string and max length int.
        Return string, with dots at end if truncated, but none if not.
    """
    shorter = truncate_by_words(title, limit)
    if shorter == title:
        return title
    else:
        return '%s...' % shorter

        
def humanized_list(input_list):
    # return comma-separated list with "and" instead of last comma
    return " and ".join(", ".join(list(set(input_list))).rsplit(", ", 1))   

 
def remove_linebreaks(text):
    return re.sub(r"(?<=[a-z])[\r\n]+"," ", text)
    
def safe_slugify(s):
    return '_'.join(re.findall('[a-z]+', s.lower()))
    
def genkey(longer = False):
    key = md5(str(random.random()) + " " + str(datetime.datetime.now()) + " " + str(random.random()))
    if longer:
        key += datetime.datetime.now().strftime('%s') + str(datetime.datetime.now().microsecond)
        key += str(random.random()).replace(".","")

    return key
    

def remove_punctuation(text):
    return re.sub(r'\W+', ' ', text).strip()    

def truncate(text, size):

    if len(text) > size:
        return text[:size - 3] + "..."
    return text    
    
def strip_html(str, br_to_nl = False):

    if br_to_nl:
        str = str.replace('<br/>', "\n")

    p = re.compile(r'<[^>]*>')
    str = p.sub(' ', str)
    p = re.compile(r' +')
    return p.sub(' ', str) 

    
def emsg(maxTBlevel=5):
    import sys, traceback
    try:
        exc_info = sys.exc_info()
        tb = '\n'.join(traceback.format_exception(*(exc_info or sys.exc_info())))
        return datetime.datetime.now().isoformat() + '\n' + tb
    except:
        return "<no exception>"

html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    ">": "&gt;",
    "<": "&lt;",
}

def htmlentityencode(s):
    """Given string, encodes & => &amp;  and others.
        Returns string.
        http://wiki.python.org/moin/EscapingHtml
    """
    return ''.join(html_escape_table.get(c, c) for c in s)     
    




def truncate_by_words(title, limit):
    """
        Use truncate_by_words_if_long instead!

    """
  
    if not title:
        return ''
    elif len(title) <= limit:
        return title
    else:
        # continue to remove words until it fits
        BUFFER = 30 # no words longer than this...
        return truncate_by_words(' '.join(title[:limit + BUFFER].split(' ')[:-1]), limit)



def md5(str):

    m = hashlib.md5()
    m.update(str)
    return m.hexdigest()

                              