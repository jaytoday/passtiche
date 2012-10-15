import os
import sys
import uuid
import logging
import flask

app = flask.Flask(__name__)

logging.basicConfig(
    stream=sys.stdout,
    level=logging.DEBUG,
    format='"%(asctime)s %(levelname)8s %(name)s - %(message)s"',
    datefmt='%H:%M:%S'
)


@app.route('/')
def handler():

    '''
    resp = flask.make_response(new_uuid)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Cache-Control'] = 'public, max-age=9999, must-revalidate'
    resp.headers['Last-Modified'] = 'Tue, 8 Jun 1993 00:00:01 GMT'
    resp.headers['Expires'] = 'Wed, 8 Jun 2033 00:40:40 GMT'
    resp.headers['ETag'] = '"%s"' % new_uuid
    #resp.set_etag(new_uuid)

    logging.info("SENT UUID: %s" % new_uuid)
    '''

    return resp

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)