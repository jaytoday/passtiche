
$('#send_pass_btn').on('click', function(){
	
	var pass_data = { 'pass_template': send_pass_modal.data('pass_template_id')}
	pass_data['from_email']  = send_pass_modal.find('#inputFrom').val();
	pass_data['to_email'] = send_pass_modal.find('#inputTo').val();	
	pass_data['theme'] = send_pass_modal.find('#inputThemes').find('input:checked').val();
	pass_data['action'] = send_pass_modal.data('pass_action');

	console.log(pass_data);	

	send_pass_modal.find('#error_alert').hide();	

	if (pass_data['from_email'].indexOf('@') < 1)
		return sendDialogError("Valid 'From' Email Address is Required")
	/* make from email optional? */
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