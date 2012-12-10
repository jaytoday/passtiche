

	var pass_data = { }

	//pass_data['theme'] = passtiche_dialog.find('#inputThemes').find('input:checked').val();

	passtiche_dialog.find('#error_alert').hide();	


		/*
		pass_data['from_email']  = passtiche_dialog.find('#inputFrom').val();
		if (false && pass_data['from_email'].indexOf('@') < 1)
		return sendDialogError("Valid 'From' Email Address is Required");
	*/
	
	var send_form = $(this).parents('.send_form:first');
    
    pass_data['pass_template'] = passtiche_dialog.data('pass_template_code');

	if (send_form.attr('id') == 'send_form_download'){
		var download = true;
	}else{
		if (!passtiche_dialog.data('user_pass'))
			console.error('no user pass');
		var download = false;
		pass_data['user_pass'] = passtiche_dialog.data('user_pass') 
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

  passtiche_dialog.find('#dialog-tab-content').addClass('hidden');
  passtiche_dialog.find('#sent-confirmation').removeClass('hidden');

  	window.SendPassCB = function(){
  		console.log('send pass callback');

     	  setTimeout(function(){
     	  	passtiche_dialog.find('#sent-confirmation').addClass('hidden');
     	  	passtiche_dialog.find('#dialog-tab-content').removeClass('hidden');
     	  	passtiche_dialog.modal('hide'); passtiche_dialog.addClass('hidden');
     	  }, 2500);

  	}

  	pass_data['callback'] = 'SendPassCB';
   $.ajax({
     type: "POST",
     url: PASSTICHE_BASE_URL + "/ajax/pass.send",
     data: pass_data,
     dataType: 'jsonp'
     });

	







