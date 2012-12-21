

	var pass_data = { }

	PASSTICHE.dialog_el.find('#error_alert').hide();	
	
	var send_form = jQuery(this).parents('.send_form:first');
    
    pass_data['pass_template'] = PASSTICHE.dialog_el.data('pass_template_code');

	if (send_form.attr('id') == 'send_form_download'){
		var download = true;
	}else{
		if (!PASSTICHE.dialog_el.data('user_pass'))
			console.error('no user pass');
		var download = false;
		pass_data['user_pass'] = PASSTICHE.dialog_el.data('user_pass') 
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

  PASSTICHE.dialog_el.find('#dialog-tab-content').addClass('hidden');
  PASSTICHE.dialog_el.find('#sent-confirmation').removeClass('hidden');

  	window.SendPassCB = function(){
  		console.log('send pass callback');

    
  	}

  	setTimeout(function(){
     	  	PASSTICHE.dialog_el.find('#sent-confirmation').addClass('hidden');
     	  	PASSTICHE.dialog_el.find('#dialog-tab-content').removeClass('hidden');
     	  	PASSTICHE.dialog_el.find('button.close:first').click(); 
     	  }, 2500);

  	pass_data['callback'] = 'SendPassCB';
   jQuery.ajax({
     type: "POST",
     url: PASSTICHE.BASE_URL + "/ajax/pass.send",
     data: pass_data,
     dataType: 'jsonp'
     });

	







