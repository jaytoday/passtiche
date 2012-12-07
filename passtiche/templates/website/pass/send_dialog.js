
function openPassDialog(pass_action, el){

	if (send_pass_modal.is(':visible')) return;

	// el can be various buttons and targets
	pass_item = el.parents('.pass_item:first');
	pass_name = pass_item.attr('name');
	pass_code = pass_item.attr('code'); // only four characters
	pass_keyname = pass_item.attr('keyname');


	var pass_img_src = pass_item.find('img.pass').attr('src'); 
	var pass_description = pass_item.find('#description').html();
	resetSendDialog();


	send_pass_modal.data('pass_template', pass_name);
	send_pass_modal.data('pass_template_code', pass_code);
	send_pass_modal.data('pass_template_keyname', pass_keyname);
	send_pass_modal.find('.pass_template:first').text(pass_name);	

	//sendPassActionInit(pass_action);

	
	// use cached values if possible 
	if (localStorage.getItem('user_email'))
		send_pass_modal.find('#send_form_download').find('#inputToEmail').val(localStorage.getItem('user_email'));

	if (localStorage.getItem('user_phone'))
		send_pass_modal.find('#send_form_download').find('#inputPhone').val(localStorage.getItem('user_phone'));



	// open up default option
	send_pass_modal.find('#passOptions').find('a:first').tab('show');

	//send_pass_modal.find('#inputThemes input:first').click();

	send_pass_modal.find('#pass_preview').attr('src', pass_img_src);

	var pass_details = pass_item.find('.pass_details_container:last').html();
	send_pass_modal.find('.pass_details_wrapper:first').html(pass_details);


	var pass_link =  $(document).data('domain') + '/p/' + send_pass_modal.data('pass_template_code');
	send_pass_modal.find('#inputLink').val(pass_link);
	send_pass_modal.find('#link_text').attr('href','http://' + pass_link);

send_pass_modal.data('pass_action', pass_action);

	send_pass_modal.modal('show');

	send_pass_modal.find('#pass_embed').find('textarea').html('&lt;script src="http://www.passtiche.com/js"&gt;&lt;/script&gt;\n'
		+ '&lt;a data-pass-id="' + send_pass_modal.data('pass_template_code') + '" &gt;&lt;/a&gt;')
	

	incrementPassCount(pass_keyname, pass_action);

	if (send_pass_modal.find('#downloading_pass:visible').length > 0){
		// redirect to direct download page 
		var dd_href = $(document).data('base-url');
		if (send_pass_modal.data('user_pass'))
			dd_href += ('/ud/' + send_pass_modal.data('user_pass'));
		else dd_href += ('/pd/' + pass_code);

		setTimeout(function(){
			window.location.href = dd_href;	
		}, 100);
		setTimeout(function(){
			send_pass_modal.modal('hide');
		}, 1000);		

	}


}


$('#pass_embed').find('textarea').on('click', function(){
	$(this).focus(); $(this).select();
});

/*
function sendPassActionInit(pass_action){

	send_pass_modal.find('.pass_action:first').text(pass_action);

	send_pass_modal.data('pass_action', pass_action);

	// click default theme
	//send_pass_modal.find('input:first', '#inputThemes').click();

	if (pass_action == 'Share'){
		send_pass_modal.find('.send_form').hide();
		send_pass_modal.find('#name_form').show();		
		
		var user_name = localStorage.getItem("user_name");
		if (user_name)
			$('#name_form').find('#inputName').val(user_name).end().find('#continue_btn').click();

		$('#name_form').find('#continue_btn').button('reset');
	}



};
*/





// change theme
/*send_pass_modal.find('#inputThemes input').on('click', function(){
	send_pass_modal.find('#inputThemes').find('label').removeClass('active');

	$(this).parent().addClass('active');

		if ($(this).attr('theme-id'))
			send_pass_modal.data('pass_theme', $(this).attr('theme-id'));
		else
			send_pass_modal.data('pass_theme', false);

	if (send_pass_modal.find('#send_form').is(':visible'))
		updateUserPass();		


});*/


$('#edit_name').on('click', function(){

	send_pass_modal.find('#send_form_share').hide();
	send_pass_modal.find('#name_form').show();	

});



function resetSendDialog(){
	// empties all the inputs

send_pass_modal.find('input[type="text"]').val('');

send_pass_modal.find('input:checked').attr('checked', false);

send_pass_modal.find('#error_alert').hide();

send_pass_modal.data('user_pass', false);

}


{% include "send_pass.js" %}
{% include "save_pass.js" %}

