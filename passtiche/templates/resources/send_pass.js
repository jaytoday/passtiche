

	var pass_data = { }

	//pass_data['theme'] = dialog_modal.find('#inputThemes').find('input:checked').val();
	pass_data['action'] = dialog_modal.data('pass_action');

	dialog_modal.find('#error_alert').hide();	

		/*
		pass_data['from_email']  = dialog_modal.find('#inputFrom').val();
		if (false && pass_data['from_email'].indexOf('@') < 1)
		return sendDialogError("Valid 'From' Email Address is Required");
	*/
	
	var send_form = $(this).parents('.send_form:first');

	if (send_form.attr('id') == 'send_form_download'){
		var download = true;
		pass_data['pass_template'] = dialog_modal.data('pass_template_keyname');
	}else{
		if (!dialog_modal.data('user_pass'))
			console.error('no user pass');
		var download = false;
		pass_data['user_pass'] = dialog_modal.data('user_pass') 
	}

	to_email = send_form.find('#inputToEmail').val();	
	if (to_email.indexOf('@') > 1 )
		pass_data['to_email'] = to_email;
	
	to_phone = send_form.find('#inputPhone').val();	
	if (to_phone.length > 9)
		pass_data['to_phone'] = to_phone;

	if (!pass_data['to_email'] && !pass_data['to_phone'])	
		return alert("Valid Email Address or Phone Number is Required");	


if (download && pass_data['to_phone'])
	localStorage.setItem('user_phone', pass_data['to_phone']);
if (download && pass_data['to_email'])
	localStorage.setItem('user_email', pass_data['to_email']);

   $.ajax({
     type: "POST",
     url: "/ajax/pass.send",
     data: pass_data,
     success: function(response){


     },
     error: function(response){
     

     }
     });


	send_form.html('<h1>Sent</h1>');
	//dialog_modal.hide();







