

// makeClass - By John Resig (MIT Licensed)
function makeClass(){
  return function(args){
    if ( this instanceof arguments.callee ) {
      if ( typeof this.init == "function" )
        this.init.apply( this, args.callee ? args : arguments );
    } else
      return new arguments.callee( arguments );
  };
}

window.PASSTICHE = makeClass()();

PASSTICHE.PassticheBadger = makeClass();

PASSTICHE.PassticheBadger.prototype.init = function(){ }; // pass args

PASSTICHE.PassticheBadger.prototype.loadResources = function(){
	/* Load additional CSS and JS for Passtiche dialog modal */


      // this should be first thing after jQuery loads
	  jQuery.getScript(PASSTICHE.BASE_URL + '/r/dialog.js', function(){ 
	  	PASSTICHE.dialog.load(); 
	  });
	  jQuery('head').append('<link href="' + PASSTICHE.BASE_URL 
	  	+ '/r/dialog.css" rel="stylesheet" type="text/css">');
	  
};

PASSTICHE.PassticheBadger.prototype.loadBadges = function(){

	/* 
		Loads badges into the DOM from links to pkpass files or
		links with supported data attributes.

		See www.passtiche.com/docs for implementation details 

		Required:
			- loc
		Optional:
			- city
			- name
			- price
			- description
	*/

	console.log(PASSTICHE, 'initiating Passtiche Badger class');

	this.badgelinks = jQuery('a[data-pass-loc], a[data-pass-id], a[href$=pkpass]');
	var timestamp = new Date().getTime();
	callbackName = 'passticheCB_' + timestamp; 

	window[callbackName] = function(response_json){
			// JSONP callback

			console.log('adding dialog html and adding pass content to badges');

			var dialog_html = jQuery(response_json['dialog_html']);
			jQuery('body').append(dialog_html.html());
			jQuery(response_json['passes']).each(PASSTICHE.badger.badgeCallback);

			setTimeout(function(){
				jQuery(document).trigger('passtiche-loaded');
			},50);
	}; // end callback

	this.badge_data = { 'create': true, 'passes': [], 'sdk': true, 'callback': callbackName }; // create passes if they don't already exist 

	// collect badge data for each badge 
	jQuery(this.badgelinks).each(PASSTICHE.badger.addBadge);



	// load additional CSS and JS 
	
	this.loadResources();

	// TODO - JS should contain callback for PassticheBadger.findBadges();
	



}; // end init


PASSTICHE.PassticheBadger.prototype.addBadge = function(){

/* 

TODO: These should be batched for performance!!!!

*/

// add badge image and find or create pass

	var badgeLinkEl = jQuery(this);
	DEFAULT_BADGE_HEIGHT = 40;
	var badge_height = DEFAULT_BADGE_HEIGHT;

	if (badgeLinkEl.attr('data-pass-size')){

		if (parseInt(badgeLinkEl.attr('data-pass-size'))){


			badge_height = parseInt(badgeLinkEl.attr('data-pass-size'));
			if (badge_height > 80 || badge_height < 20)
				badge_height = DEFAULT_BADGE_HEIGHT;
		};

		switch(badgeLinkEl.attr('data-pass-size')){
			case 'xsmall': badge_height = 20;break; 
			case 'small': badge_height = 30;break;  
			case 'large': badge_height = 60;break;  
			case 'xlarge': badge_height = 70;break;  
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

	var badge_img  = jQuery('<img style="' + clearslate_css + dimensions_css + '" src="' + PASSTICHE.BASE_URL + '/badge"></img>');

	var badge_title = badgeLinkEl.text() || 'Add to Passbook';
	badgeLinkEl.html(badge_img);
	if (!badgeLinkEl.attr('title'))
		badgeLinkEl.attr('title', badge_title);


	var pass_data = {};

	if (badgeLinkEl.filter('[href$=pkpass]').length > 0){

		// linked pass
		pass_data['url'] = badgeLinkEl.attr('href');


	}else{
	
	// TODO: if ID, it does not need call 
	jQuery(['loc', 'city', 'name', 'price', 'description', 'id']).each(function(i, attr){

			var attr_val = badgeLinkEl.attr('data-pass-' + attr);
			if (attr_val){
				//console.log(attr_val);
				pass_data[attr] = attr_val;
			}
		});

	}
	
	badgeLinkEl.removeAttr('href'); // TODO: bind fallback link or message

	badgeLinkEl.on('click', PASSTICHE.badger.badgeClick);
	console.log(PASSTICHE.badger);
	PASSTICHE.badger.badge_data['passes'].push(pass_data);	

	};

 PASSTICHE.PassticheBadger.prototype.findBadges = function(){
		console.log('test')
		console.log(this, this.badge_data);

		// make ajax call to get badge data
		console.log('find badges');

	this.badge_data['passes'] = JSON.stringify(this.badge_data['passes']);
	console.log(this.badge_data['passes']);

	var badge_script = jQuery('script')
	.filter('[src$="this.com/js"],[src$="localhost:8080/js"]');
	if (badge_script.attr('account'))
		this.badge_data['code'] = badge_script.attr('account');

	this.badge_data['location'] = window.location.href;


	jQuery.ajax({
			type: "GET",
			url: PASSTICHE.BASE_URL + "/api/1/pass.find",
			dataType: 'jsonp',
			data: this.badge_data
		});	


}; // end findBadges


PASSTICHE.PassticheBadger.prototype.badgeCallback = function(i, pass_dict){

	// this relies on 1-1 match between els and data
	var badgeLinkEl = jQuery(PASSTICHE.badger.badgelinks[i]);
	badgeLinkEl.attr('data-pass-id', pass_dict['short_code']);
	badgeLinkEl.data('pass-info', pass_dict);

};

PASSTICHE.PassticheBadger.prototype.addBadgeLink = function(short_code, badgeLinkEl){
	/* Deprecated - or fallback */
	// add href attribute to a link when pass ID is returned 
	console.log(badgeLinkEl);
	badgeLinkEl.attr('pass-code',short_code);
	badgeLinkEl.attr('href', PASSTICHE.BASE_URL + '/p/' + short_code);
	badgeLinkEl.attr('target', '_blank');

};

PASSTICHE.PassticheBadger.prototype.badgeClick = function(){
	// TODO: check if JS is in place yet - if not then 

	if (!PASSTICHE.dialog)
		return console.error('no passtiche dialog');

	PASSTICHE.dialog.openPassDialog(jQuery(this));
};





(function () {


	PASSTICHE.badger = PASSTICHE.PassticheBadger();

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


	if (window.location.href.indexOf('localhost') > -1)
		PASSTICHE.BASE_URL = 'http://localhost:8080';
	else
		PASSTICHE.BASE_URL = 'http://www.passtiche.com';

    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", 
    	function(){ PASSTICHE.badger.loadBadges() });



})();

