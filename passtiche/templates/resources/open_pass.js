PASSTICHE.dialog_el = jQuery('#passticheDialogModal'); console.log(PASSTICHE.dialog_el);
if (PASSTICHE.dialog_el.length < 1) return console.error('dialog HTML not found');

	if (PASSTICHE.dialog_el.is(':visible')) return;

	// el can be various buttons and targets
	pass_name = pass_link.data('pass-info')['name'];
	pass_code = pass_link.data('pass-info')['short_code']; // only four characters

	var pass_img_src =  pass_link.data('pass-info')['img'];
	var pass_description = pass_link.data('pass-info')['description'];
	this.resetSendDialog();
	PASSTICHE.dialog_el.removeClass('hidden');



	PASSTICHE.dialog_el.data('pass_template', pass_name);
	PASSTICHE.dialog_el.data('pass_template_code', pass_code);
	PASSTICHE.dialog_el.find('.pass_template:first').text(pass_name);	

	
	// use cached values if possible 
	if (localStorage.getItem('user_email'))
		PASSTICHE.dialog_el.find('#send_form_download').find('#inputToEmail').val(localStorage.getItem('user_email'));

	if (localStorage.getItem('user_phone'))
		PASSTICHE.dialog_el.find('#send_form_download').find('#inputPhone').val(localStorage.getItem('user_phone'));



	// open up default option
	PASSTICHE.dialog_el.find('#passOptions').find('a:first').tab('show');

	//PASSTICHE.dialog_el.find('#inputThemes input:first').click();

	PASSTICHE.dialog_el.find('#pass_preview').attr('src', pass_img_src);

	this.pass_details = pass_link.data('pass-info')['pass_details'];
	
	PASSTICHE.dialog_el.find('.pass_details_wrapper:first').html(this.pass_details);
	


	// setup pass link
	var pass_link =  PASSTICHE.BASE_URL + '/p/' + PASSTICHE.dialog_el.data('pass_template_code');
	var short_pass_link = pass_link.slice(7,pass_link.length);
	if (short_pass_link.indexOf('www.') == 0)
		short_pass_link = short_pass_link.slice(4,short_pass_link.length);
	PASSTICHE.dialog_el.find('#inputLink').val(short_pass_link);
	PASSTICHE.dialog_el.find('#link_text').attr('href',pass_link);

	// setup social links
	PASSTICHE.dialog_el.find('#share-social').find('.twitter').find('a').attr('href','http://twitter.com/intent/tweet?text=http%3A%2F%2Fpasstiche.appspot.com%2Fp%2F' 
		+ PASSTICHE.dialog_el.data('pass_template_code') + '%20Check%20Out%20This%20Pass');

	PASSTICHE.dialog_el.find('#share-social').find('.fb').find('a').attr('href','http://www.facebook.com/share.php?u=http%3A%2F%2Fpasstiche.appspot.com%2Fp%2F' 
		+ PASSTICHE.dialog_el.data('pass_template_code'));	


	PASSTICHE.dialog_el.modal('show');

	PASSTICHE.dialog_el.find('#pass_embed').find('textarea').html('&lt;script src="http://www.passtiche.appspot.com/js"&gt;&lt;/script&gt;\n'
		+ '&lt;a data-pass-id="' + PASSTICHE.dialog_el.data('pass_template_code') + '" &gt;&lt;/a&gt;')
	


	if (PASSTICHE.dialog_el.find('#downloading_pass:visible').length > 0){
		// redirect to direct download page 
		var dd_href = PASSTICHE.BASE_URL;
		if (PASSTICHE.dialog_el.data('user_pass'))
			dd_href += ('/ud/' + PASSTICHE.dialog_el.data('user_pass'));
		else dd_href += ('/pd/' + pass_code);

		setTimeout(function(){
			window.location.href = dd_href;	
		}, 500);
		setTimeout(function(){
			PASSTICHE.dialog_el.modal('hide');
		}, 3000);		

	}