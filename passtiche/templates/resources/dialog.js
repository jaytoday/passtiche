// keep all use of variables to the top in case this JS needs to be static
$(document).data('passtiche-base-url', '{{ base_url }}');

{% include "json.js" %}



dialog_modal = $('#passticheDialogModal');


PassticheDialog = {


	init: function(){

		dialog_modal.find('#pass_embed').find('textarea').on('click', function(){
			$(this).focus(); $(this).select();
		});


		dialog_modal.find('#edit_name').on('click', function(){

			dialog_modal.find('#send_form_share').hide();
			dialog_modal.find('#name_form').show();	

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

		dialog_modal.find('input[type="text"]').val('');

		dialog_modal.find('input:checked').attr('checked', false);

		dialog_modal.find('#error_alert').hide();

		dialog_modal.data('user_pass', false);

	}// end resetSendDialog

} // end PassticheDialog


window.PassticheDialog = PassticheDialog;
