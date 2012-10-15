var hiptype = (function () {
    var app_id;
    var hiptype_id;
    var setKey = function (id) {
        app_id = id;
        console.log("set app_id: " + app_id);
    };
    var uuid_url = "http://hiptypeid.herokuapp.com";
    var device_update_url = "http://www.hiptype.com/api/device.update";
    var event_track_url = "http://www.hiptype.com/api/event.track";
    var xhr = function(method, url, async, data) {
        method = typeof method !== 'undefined' ? method : "GET";
        async = typeof async !== 'undefined' ? async : false;
        var x;
        try {
            x = new XMLHttpRequest();
        } catch (err) {
            try {
                x = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (err) {
                try {
                    x = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (err) {
                    throw "AJAX Not Supported";
                }
            }
        }
        if (method === "POST") {
            x.open(method,url,async);
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var datastring = "";
            if (typeof data === "object") {
                for (var varname in data) {
                    if (datastring === "") {
                        datastring += varname + "=" + data[varname];
                    } else {
                        datastring += "&" + varname + "=" + data[varname];
                    }
                }
            } else {
                datastring = data;
            }
            x.send(datastring);
        } else {
            x.open(method,url,async);
            x.send();
        }
        return x.responseText;
    };
    var xhr_hiptype_id = function () {
        var xhr_id = xhr("GET",uuid_url,false);
        console.log("got xhr_id: " + xhr_id);
        return xhr_id;
    };
    var track_event = function (event_name, callback) {
        console.log("called hiptype.track_event");
        if (event_name === 'undefined') {
            throw "No Event Specified";
        }
        var event_data = {
            advertiser: app_id,
            event: event_name,
            user: hiptype_id
        };
        console.log("track_event: " + JSON.stringify(event_data));
        xhr("POST",event_track_url,false,event_data);
        if (typeof callback !== 'undefined') {
            callback();
        }
        return;
    };
    /*var iframe_hiptype_id = function() {
        var i = document.createElement('iframe');
        i.style.display = 'none';
        i.id = 'hiptype';
        //i.onload = function() { console.log(i.contentDocument.body.innerHTML); i.parentNode.removeChild(i); };
        i.onload = function() { console.log(i.contentDocument.body.innerHTML);};
        i.src = uuid_url;
        document.body.appendChild(i);
    };*/
    var init = function(appid, callback) {
        console.log("called hiptype.init");
        if (typeof appid !== 'undefined') {
            setKey(appid);
        }
        hiptype_id = xhr_hiptype_id();
        // wrapped in try because hiptype server currently doesn't have access-control-allow-origin header set
        try {
            track_event("init");
        } catch(e) {}
        if (typeof callback !== 'undefined') {
            callback();
        }
    };
    var device_info = function(callback) {
        console.log("called hiptype.device_info");
        // will return targeting & conversion data in the future
        return {
            hiptype_id: hiptype_id
        };
        if (typeof callback !== 'undefined') {
            callback();
        }
    };
    return {
        init: init,
        track_event: track_event,
        device_info: device_info
    };
})();