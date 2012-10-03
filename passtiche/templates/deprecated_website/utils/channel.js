function startChannel(token, channelCallback){

        if (!token)
            return console.error('token is undefined');
            {% if handler_name == "IndexView" and False and settings['debug'] %}
                return console.log('not initiating channel locally');
            {% end %}
        var channel = new goog.appengine.Channel(token);
        console.log('initiated channel', token, channelCallback);
        var socket = channel.open();
        socket.onmessage = channelCallback;         
                
};
                