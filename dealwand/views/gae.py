import logging
from base import BaseHandler


class GAEHandler(BaseHandler):
    pass
    
    
class ChannelConnect(GAEHandler):
    
    def get(self):
        logging.info('Channel Connection: %s' % self.request.arguments)
        client_id = self.request.arguments.get('from')
        self.write('OK')
        return        


class ChannelDisconnect(GAEHandler):

    def get(self):
        logging.info('Channel Disconnection: %s' % self.request.arguments)
        self.write('OK')
        return        