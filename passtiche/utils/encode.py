


def context_to_string(context):
    from google.appengine.ext import db    
    response = ''
    for key, value in context.items():
        response += "__"
        response += str(key)
        response += "--"
        if isinstance(value, db.Model):
            response += str(value.key())
        else:
            response += str(value)
    return response
    
    
    
# this is just used for mail
def html_to_plaintext(string, trim=True):
  import re
  from encoding import htmldecode
  tag_token = re.compile('<(.*?)>')
  # two lines could be used for closing tag, etc. 
  plaintext_string = re.sub(tag_token,'\
  \
  ',string)
  doc = htmldecode(plaintext_string)
  split_doc = doc.split("\n")
  trimdoc = []
  for i, line in enumerate(split_doc):
    if len(line.replace(" ","")) == 0:
      try:
        if len(split_doc[i+1].replace(" ","")) == 0:
          continue
      except IndexError: pass
    trimdoc.append(line)
  doc = "\n".join(trimdoc)
  return doc    