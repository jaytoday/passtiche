// keep all use of variables to the top in case this JS needs to be static
$(document).data('passtiche-base-url', '{{ base_url }}');

{% include "bootstrap.min.js" %}

{% include "json.js" %}



passtiche_dialog = $('#passticheDialogModal');


PassticheDialog = {


	init: function(){

		passtiche_dialog.find('#pass_embed').find('textarea').live('click', function(){
			$(this).focus(); $(this).select();
		});


		passtiche_dialog.find('#edit_name').live('click', function(){
			/* deprecated for now */

			passtiche_dialog.find('#send_form_share').hide();
			passtiche_dialog.find('#name_form').show();	

		});

		passtiche_dialog.find('.send_pass_btn').live('click', PassticheDialog.sendPass);

		passtiche_dialog.find('button.close').live('click', function(){
				passtiche_dialog.addClass('hidden');
		});

	   // callback to the other JS file 
	   PassticheBadger.findBadges();


	}, // end init

	openPassDialog: function(pass_link){


		{% include "open_pass.js" %}


	}, // end openPassDialog


    sendPass: function(){
    	
    	{% include "send_pass.js" %}
    },

    savePass: function(){
    	{% include "save_pass.js" %}
    },

	resetSendDialog: function(){
		// empties all the inputs

		passtiche_dialog.find('input[type="text"]').val('');

		passtiche_dialog.find('input:checked').attr('checked', false);

		passtiche_dialog.find('#error_alert').hide();

		passtiche_dialog.data('user_pass', false);

	}// end resetSendDialog

} // end PassticheDialog


window.PassticheDialog = PassticheDialog;
