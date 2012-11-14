var JSON;if(!JSON){JSON={};}
(function(){"use strict";function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());


BASE_URL = 'http://localhost:8080'

// TODO: implement as a proper js lib with different methods and options 

/*


 Options include badge size

*/

passtiche = {};

PassticheBadger = {

	init: function(){

			/* 
				Required:
					- loc
				Optional:
					- city
					- name
					- price
					- description
			*/
	

			passtiche.badgelinks = $('a[data-passtiche-loc]');

			passtiche.badge_data = { 'create': true, 'passes': [] }; // create passes if they don't already exist 


			// collect badge data for each badge 
			$(passtiche.badgelinks).each(PassticheBadger.addBadge);

			// make ajax call and find badge
			PassticheBadger.findBadges();


	}, // end init

	addBadge: function(){

		/* 

		TODO: These should be batched for performance!!!!

		*/

		// add badge image and find or create pass

				var badgeLinkEl = $(this);

				var badge_img  = $('<img style="width: 123px; height: 40px;" src="' + BASE_URL + '/badge"></img>');
				badge_img.on('click', PassticheBadger.badgeClick)
				
				badgeLinkEl.html(badge_img);

				badgeLinkEl.attr('href', BASE_URL + '/not_found');



				var pass_data = {};


				$(['loc', 'city', 'name', 'price', 'description']).each(function(i, attr){
		

					var attr_val = badgeLinkEl.attr('data-passtiche-' + attr);
					if (attr_val)
						pass_data[attr] = attr_val;


				});


				passtiche.badge_data['passes'].push(pass_data);	

		},

	 findBadges: function(){
	 			// make ajax call to get badge data

				passtiche.badge_data['passes'] = JSON.stringify(passtiche.badge_data['passes']);

				$.ajax({
					type: "GET",
					url: BASE_URL + "/api/1/pass.find",
					data: passtiche.badge_data,
					success: function(response){

							response_json = JSON.parse(response);
							console.log(response_json)

							$(response_json['passes']).each(PassticheBadger.badgeCallback);
					}
				});	


	}, // end findBadges

	
	badgeCallback: function(i, pass_dict){

		short_code = pass_dict['short_code'];
		// this relies on 1-1 match between els and data
		var badge_el = $(passtiche.badgelinks[i]);
		PassticheBadger.addBadgeLink(short_code, badge_el)

	},

	addBadgeLink: function(short_code, badgeLinkEl){
		// add href attribute to a link when pass ID is returned 
		console.log(badgeLinkEl);
		badgeLinkEl.attr('href', BASE_URL + '/p/' + short_code);
		badgeLinkEl.attr('target', '_blank');

	},

	badgeClick: function(){
		// badge has been clicked 
	}


};// end PassticheBadger





(function () {

    function loadScript(url, callback) {

    	if (window.jQuery)
    		return callback();

        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", PassticheBadger.init);


})();