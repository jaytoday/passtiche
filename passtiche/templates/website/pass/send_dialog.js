
function openPassDialog(pass_action, el){
	var pass_item = el.parents('.pass_item:first');
	var pass_name = pass_item.attr('name');
	var pass_id = pass_item.attr('pass_id');
	var pass_slug = pass_item.attr('slug');
	var pass_img_src = '/static/images/pass/' + pass_slug + '-small.png';
	var pass_description = pass_item.find('#description').html();
	resetSendDialog();

	sendPassInit(pass_name, pass_id, pass_action);


	send_pass_modal.find('button', '#pass_action_choices').removeClass('active').filter('#' + pass_action).click();

	send_pass_modal.find('#inputThemes input:first').click();

	send_pass_modal.find('#pass_preview').attr('src', pass_img_src);

	
	
	send_pass_modal.find('#send_form').hide();
	send_pass_modal.find('#name_form').show();		
	
	var user_name = localStorage.getItem("user_name");
	if (user_name)
		$('#name_form').find('#inputName').val(user_name).end().find('#continue_btn').click();

	$('#name_form').find('#continue_btn').button('reset');

	

	incrementPassCount(pass_id, pass_action);

}

function sendPassInit(pass_template, pass_template_id, pass_action){
// use el instead of pass template id?


	send_pass_modal.data('pass_template', pass_template);
	send_pass_modal.data('pass_template_id', pass_template_id);
	send_pass_modal.data('pass_action', pass_action);

	send_pass_modal.find('.pass_action:first').text(pass_action);

	send_pass_modal.find('.pass_template:first').text(pass_template);

	// click default theme
	//send_pass_modal.find('input:first', '#inputThemes').click();


};




// change pass action type
send_pass_modal.find('#pass_action_choices button').on('click',function(){

	sendPassInit(send_pass_modal.data('pass_template'), send_pass_modal.data('pass_template_id'), $(this).attr('id'));
	if (send_pass_modal.find('#send_form').is(':visible'))
		updateUserPass();
});

// change theme
send_pass_modal.find('#inputThemes input').on('click', function(){
	send_pass_modal.find('#inputThemes').find('label').removeClass('active');

	$(this).parent().addClass('active');

		if ($(this).attr('theme-id'))
			send_pass_modal.data('pass_theme', $(this).attr('theme-id'));
		else
			send_pass_modal.data('pass_theme', false);

	if (send_pass_modal.find('#send_form').is(':visible'))
		updateUserPass();		


});


$('#edit_name').on('click', function(){

	send_pass_modal.find('#send_form').hide();
	send_pass_modal.find('#name_form').show();	

});



function resetSendDialog(){

send_pass_modal.find('input[type="text"]').val('');

send_pass_modal.find('input:checked').attr('checked', false);

send_pass_modal.find('#error_alert').hide();

send_pass_modal.data('user_pass', false);

}


{% include "send_pass.js" %}
{% include "save_pass.js" %}

