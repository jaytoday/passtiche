// keep all use of variables to the top in case this JS needs to be static


{% include "bootstrap.min.js" %}

{% include "json.js" %}


if (!window.PASSTICHE) console.error('PASSTICHE object not found - badge script has not been loaded');




PASSTICHE.PassticheDialog = makeClass();

PASSTICHE.PassticheDialog.prototype.init = function(){ }; // pass args

PASSTICHE.PassticheDialog.prototype.load = function(){

	PASSTICHE.dialog_el = jQuery('#passticheDialogModal');

	PASSTICHE.dialog_el.find('#pass_embed').find('textarea').live('click', function(){
		jQuery(this).focus(); jQuery(this).select();
	});


	PASSTICHE.dialog_el.find('#edit_name').live('click', function(){
		/* deprecated for now */

		PASSTICHE.dialog_el.find('#send_form_share').hide();
		PASSTICHE.dialog_el.find('#name_form').show();	

	});

	PASSTICHE.dialog_el.find('.send_pass_btn').live('click', this.sendPass);

	PASSTICHE.dialog_el.live('hidden', function(){

		jQuery(this).addClass('hidden');

	});

	PASSTICHE.dialog_el.find('#share-social').find('a').live('click', function(){
	    jQuery.ajax({
	     	type: "GET",
	     	url: PASSTICHE.BASE_URL + "/ajax/pass.callback",
	     	data: { 'type': 'shares', 'pass_template': PASSTICHE.dialog_el.data('pass_template_code') }
		 });

	})

   // callback to the other JS file 
   if (!PASSTICHE.badger)
   		return console.error('passtiche badger js library not found');
   PASSTICHE.badger.findBadges();


}; // end load

 PASSTICHE.PassticheDialog.prototype.openPassDialog = function(pass_link){


		{% include "open_pass.js" %}

		setTimeout(this.viewCallback, 250);


	}; // end openPassDialog


 PASSTICHE.PassticheDialog.prototype.sendPass = function(){
    {% include "send_pass.js" %}
    };

 PASSTICHE.PassticheDialog.prototype.savePass = function(){
    	{% comment "save_pass.js" %}
    };

 PASSTICHE.PassticheDialog.prototype.resetSendDialog = function(){
	// empties all the inputs

	PASSTICHE.dialog_el.find('input[type="text"]').val('');

	PASSTICHE.dialog_el.find('input:checked').attr('checked', false);

	PASSTICHE.dialog_el.find('#error_alert').hide();

	PASSTICHE.dialog_el.data('user_pass', false);

	}; // end resetSendDialog


PASSTICHE.PassticheDialog.prototype.viewCallback = function(){	

     jQuery.ajax({
     	type: "GET",
     	url: PASSTICHE.BASE_URL + "/ajax/pass.callback",
     	data: { 'type': 'views', 'pass_template': PASSTICHE.dialog_el.data('pass_template_code') }
     });
}; // end viewCallback



PASSTICHE.dialog = PASSTICHE.PassticheDialog();
