
function sendPassInit(pass_template, pass_template_id, pass_action){
// use el instead of pass template id?


	send_pass_modal.data('pass_template', pass_template);
	send_pass_modal.data('pass_template_id', pass_template_id);
	send_pass_modal.data('pass_action', pass_action)

	send_pass_modal.find('.pass_action:first').text(pass_action);

	send_pass_modal.find('.pass_template:first').text(pass_template);


	// click default theme
	//send_pass_modal.find('input:first', '#inputThemes').click();


};

// change pass action type
send_pass_modal.find('#pass_action_choices button').on('click',function(){

	sendPassInit(send_pass_modal.data('pass_template'), send_pass_modal.data('pass_template_id'), $(this).attr('id'));
});

// change theme
send_pass_modal.find('#inputThemes input').on('click', function(){
	

	var pass_link = 'http://passtiche.com/p/' + send_pass_modal.data('pass_template_id');
	if ($(this).attr('theme-id'))
		pass_link += "/" + $(this).attr('theme-id');
	send_pass_modal.find('#inputLink').val(pass_link);

});


function resetSendDialog(){

send_pass_modal.find('input[type="text"]').val('');

send_pass_modal.find('input:checked').attr('checked', false);

send_pass_modal.find('#error_alert').hide();

}

$('#send_pass_btn').on('click', function(){
	
	var pass_data = { 'pass_template': send_pass_modal.data('pass_template_id')}
	pass_data['from_email']  = send_pass_modal.find('#inputFrom').val();
	pass_data['to_email'] = send_pass_modal.find('#inputTo').val();	
	pass_data['theme'] = send_pass_modal.find('#inputThemes').find('input:checked').val();

	console.log(pass_data);	

	send_pass_modal.find('#error_alert').hide();	

	if (pass_data['from_email'].indexOf('@') < 1)
		return sendDialogError("Valid 'From' Email Address is Required")
	if (pass_data['to_email'].indexOf('@') < 1)
		return sendDialogError("Valid 'To' Email Address is Required")	



   $.ajax({
     type: "POST",
     url: "/ajax/pass.send",
     data: pass_data,
     success: function(response){
     }
     });

	send_pass_modal.modal('hide');


});

function sendDialogError(err_msg){

send_pass_modal.find('#error_alert').html(err_msg).alert().show();


}
