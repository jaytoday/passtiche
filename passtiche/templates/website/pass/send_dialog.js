
function openPassDialog(pass_action, el){
	var pass_item = el.parents('.pass_item:first');
	var pass_img_src = pass_item.find('img.pass').attr('src');

	var pass_name = pass_item.attr('name');
	var pass_id = pass_item.attr('pass_id');
	var pass_description = pass_item.find('#description').html();
	resetSendDialog();

	sendPassInit(pass_name, pass_id, pass_action);

	if (pass_description)
		send_pass_modal.find('#pass_description').html(pass_description)

	send_pass_modal.find('button', '#pass_action_choices').removeClass('active').filter('#' + pass_action).click();

	send_pass_modal.find('#inputThemes input:first').click();

	send_pass_modal.find('#pass_preview').attr('src', pass_img_src);

	send_pass_modal.find('#send_form').hide();
	send_pass_modal.find('#name_form').show();

	$('#name_form').find('#continue_btn').button('reset');

}

function sendPassInit(pass_template, pass_template_id, pass_action){
// use el instead of pass template id?


	send_pass_modal.data('pass_template', pass_template);
	send_pass_modal.data('pass_template_id', pass_template_id);
	send_pass_modal.data('pass_action', pass_action);

	send_pass_modal.find('.pass_action:first').text(pass_action);

	send_pass_modal.find('.pass_template:first').text(pass_template);

	resetLink(); 
	// click default theme
	//send_pass_modal.find('input:first', '#inputThemes').click();


};




// change pass action type
send_pass_modal.find('#pass_action_choices button').on('click',function(){

	sendPassInit(send_pass_modal.data('pass_template'), send_pass_modal.data('pass_template_id'), $(this).attr('id'));
});

// change theme
send_pass_modal.find('#inputThemes input').on('click', function(){
	send_pass_modal.find('#inputThemes').find('label').removeClass('active');

	$(this).parent().addClass('active');

		if ($(this).attr('theme-id'))
			send_pass_modal.data('pass_theme', $(this).attr('theme-id'));
		else
			send_pass_modal.data('pass_theme', false);

		resetLink(); 
});

function resetLink(){
	return; // DEPRECATED
		var pass_link =  $(document).data('base-url') + '/p/' + send_pass_modal.data('pass_template_id') + "/" + send_pass_modal.data('pass_action')[0].toLowerCase();
	if (send_pass_modal.data('pass_theme'))
			pass_link += send_pass_modal.data('pass_theme');

	send_pass_modal.find('#inputLink').val(pass_link);
	send_pass_modal.find('#link_text').attr('href',pass_link);

}


function resetSendDialog(){

send_pass_modal.find('input[type="text"]').val('');

send_pass_modal.find('input:checked').attr('checked', false);

send_pass_modal.find('#error_alert').hide();

send_pass_modal.data('user_pass', false);

}


{% include "send_pass.js" %}
{% include "save_pass.js" %}

