
if (window.location.href.indexOf('localhost') > -1)
	PASSTICHE_BASE_URL = 'http://localhost:8080';
else
	PASSTICHE_BASE_URL = 'http://www.passtiche.com';
window.PASSTICHE_BASE_URL = PASSTICHE_BASE_URL;

// TODO: implement as a proper js lib with different methods and options 
// TODO: dynamically compile and cache 

/*


 TODO: Better default for when something doesn't work or hasn't loaded

*/

passtiche = {};

PassticheBadger = {

	init: function(){

			/* 

				See www.passtiche.com/docs for implementation details 

				Required:
					- loc
				Optional:
					- city
					- name
					- price
					- description
			*/
	
			console.log('initiating Passtiche library');

			passtiche.badgelinks = $('a[data-pass-loc], a[data-pass-id], a[href$=pkpass]');
			var timestamp = new Date().getTime();
			callbackName = 'passticheCB_' + timestamp; 

			window[callbackName] = function(response_json){
					// JSONP callback

							console.log('adding dialog html and adding pass content to badges');

							var dialog_html = $(response_json['dialog_html']);
							$('body').append(dialog_html.html());
							$(response_json['passes']).each(PassticheBadger.badgeCallback);

							setTimeout(function(){
								$(document).trigger('passtiche-loaded');
							},50);
			}

			passtiche.badge_data = { 'create': true, 'passes': [], 'sdk': true, 'callback': callbackName }; // create passes if they don't already exist 


			// collect badge data for each badge 
			$(passtiche.badgelinks).each(PassticheBadger.addBadge);


			// load additional CSS and JS 
			
			PassticheBadger.loadResources();

			// TODO - JS should contain callback for PassticheBadger.findBadges();
			



	}, // end init

	loadResources: function(){

			// add additional CSS and JS

      // this should be first thing after jQuery loads
	  $.getScript(PASSTICHE_BASE_URL + '/r/dialog.js', function(){ PassticheDialog.init(); });
	  $('head').append('<link href="' + PASSTICHE_BASE_URL + '/r/dialog.css" rel="stylesheet" type="text/css">');
	  
	  console.log('loaded resources');
	},

	addBadge: function(){

		/* 

		TODO: These should be batched for performance!!!!

		*/

		// add badge image and find or create pass

				var badgeLinkEl = $(this);

				DEFAULT_BADGE_HEIGHT = 40;
				var badge_height = DEFAULT_BADGE_HEIGHT;

				if (badgeLinkEl.attr('data-pass-size')){

					if (parseInt(badgeLinkEl.attr('data-pass-size'))){
	

						badge_height = parseInt(badgeLinkEl.attr('data-pass-size'));
						if (badge_height > 80 || badge_height < 20)
							badge_height = DEFAULT_BADGE_HEIGHT;
					};

					if (badgeLinkEl.attr('data-pass-size') == 'xsmall'){
						badge_height = 20;
					}

					if (badgeLinkEl.attr('data-pass-size') == 'small'){
						badge_height = 30;
					}
					if (badgeLinkEl.attr('data-pass-size') == 'large'){
						badge_height = 60;
					}					
					if (badgeLinkEl.attr('data-pass-size') == 'xlarge'){
						badge_height = 70;
					}	


				}; // end pass size

				var badge_width = parseInt(badge_height * 3.075);

				var clearslate_css = 'border: none !important; display: block !important;margin: auto !important;outline: none !important;padding: 0 !important;background: none !important;clear: none !important;'
					+ 'float: none !important;max-height: none !important;max-width: none !important;min-height: 0 !important;width: auto!important;height: auto !important;min-width: 0 !important;visibility: visible !important;bottom: auto !important;'
					+ 'clip: auto !important;left: auto !important;overflow: auto !important;position: relative !important;right: auto !important;top: auto !important;vertical-align: top !important;z-index: 1 !important;'
					+ 'color: none !important;cursor:pointer !important;';

				// TODO: better way to override for custom styles
				

				var dimensions_css = 'width: ' + badge_width + 'px !important; height: ' + badge_height + 'px !important;';

				badgeLinkEl.attr('style', clearslate_css + dimensions_css );

				var badge_img  = $('<img style="' + clearslate_css + dimensions_css + '" src="' + PASSTICHE_BASE_URL + '/badge"></img>');

				var badge_title = badgeLinkEl.text() || 'Add to Passbook';
				badgeLinkEl.html(badge_img);
				if (!badgeLinkEl.attr('title'))
					badgeLinkEl.attr('title', badge_title);


				var pass_data = {};

				if (badgeLinkEl.filter('[href$=pkpass]').length > 0){

					// linked pass
					pass_data['href'] = badgeLinkEl.attr('href');


				}else{
				
				// TODO: if ID, it does not need call 
				$(['loc', 'city', 'name', 'price', 'description', 'id']).each(function(i, attr){

						var attr_val = badgeLinkEl.attr('data-pass-' + attr);
						if (attr_val){
							console.log(attr_val);
							pass_data[attr] = attr_val;
						}
					});

				}
				
				badgeLinkEl.removeAttr('href'); // TODO: bind fallback link or message

				badgeLinkEl.on('click', PassticheBadger.badgeClick);

				passtiche.badge_data['passes'].push(pass_data);	

		},

	 findBadges: function(){
	 			// make ajax call to get badge data
	 			console.log('find badges');
				passtiche.badge_data['passes'] = JSON.stringify(passtiche.badge_data['passes']);
				console.log(passtiche.badge_data['passes']);

				var badge_script = $('script').filter('[src$="passtiche.com/js"],[src$="localhost:8080/js"]');
				if (badge_script.attr('account'))
					passtiche.badge_data['code'] = badge_script.attr('account');

				passtiche.badge_data['location'] = window.location.href;


				$.ajax({
					type: "GET",
					url: PASSTICHE_BASE_URL + "/api/1/pass.find",
					dataType: 'jsonp',
					data: passtiche.badge_data
					});	


	}, // end findBadges

	
	badgeCallback: function(i, pass_dict){


		// this relies on 1-1 match between els and data
		var badgeLinkEl = $(passtiche.badgelinks[i]);
		badgeLinkEl.attr('data-pass-id', pass_dict['short_code']);
		badgeLinkEl.data('pass-info', pass_dict);


	},

	addBadgeLink: function(short_code, badgeLinkEl){
		/* Deprecated - or fallback */
		// add href attribute to a link when pass ID is returned 
		console.log(badgeLinkEl);
		badgeLinkEl.attr('pass-code',short_code);
		badgeLinkEl.attr('href', PASSTICHE_BASE_URL + '/p/' + short_code);
		badgeLinkEl.attr('target', '_blank');

	},

	badgeClick: function(){
		// TODO: check if JS is in place yet - if not then 

		if (!window.PassticheDialog)
			return console.error('no passtiche dialog');

		PassticheDialog.openPassDialog($(this));
	}


};// end PassticheBadger

window.PassticheBadger = PassticheBadger; 


(function () {

    function loadScript(url, callback) {

    	/*

					TODO: jQuery can be required for dialog, but not for the bootstrapper! 

		*/

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