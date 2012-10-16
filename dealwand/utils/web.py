import re

agents_list = ['Nokia','bMOT','^LGE?b','SonyEricsson',
'Ericsson','BlackBerry','DoCoMo','Symbian',
'Windows CE','NetFront','Klondike','PalmOS',
'PalmSource','portalmm','S[CG]H-','bSAGEM',
'SEC-','jBrowser-WAP','Mitsu','Panasonic-',
'SAMSUNG-','Samsung-','Sendo','SHARP-',
'Vodaphone','BenQ','iPAQ','AvantGo',
'Go.Web','Sanyo-','AUDIOVOX','PG-',
'CDM[-d]','^KDDI-','^SIE-','TSM[-d]',
'^KWC-','WAP','^KGT [NC]',
'Mobile', 'Android', 'iPhone',
]

# cancel out matches in above list (tablets, etc.)
negative_list = ['iPad']

def is_mobile(user_agent):
  for agent in negative_list:
    if re.search(agent, user_agent):    
      return False
  for agent in agents_list:
    if re.search(agent, user_agent):    
      return True
  return False