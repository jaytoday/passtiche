
	
passtiche_dialog = $('#passticheDialogModal');


if (passtiche_dialog.length < 1) return console.error('dialog HTML not found');

	if (passtiche_dialog.is(':visible')) return;

	// el can be various buttons and targets
	pass_name = pass_link.data('pass-info')['name'];
	pass_code = pass_link.data('pass-info')['short_code']; // only four characters

	var pass_img_src =  pass_link.data('pass-info')['img'];
	var pass_description = pass_link.data('pass-info')['description'];
	PassticheDialog.resetSendDialog();
	passtiche_dialog.removeClass('hidden');



	passtiche_dialog.data('pass_template', pass_name);
	passtiche_dialog.data('pass_template_code', pass_code);
	passtiche_dialog.find('.pass_template:first').text(pass_name);	

	
	// use cached values if possible 
	if (localStorage.getItem('user_email'))
		passtiche_dialog.find('#send_form_download').find('#inputToEmail').val(localStorage.getItem('user_email'));

	if (localStorage.getItem('user_phone'))
		passtiche_dialog.find('#send_form_download').find('#inputPhone').val(localStorage.getItem('user_phone'));



	// open up default option
	passtiche_dialog.find('#passOptions').find('a:first').tab('show');

	//passtiche_dialog.find('#inputThemes input:first').click();

	passtiche_dialog.find('#pass_preview').attr('src', pass_img_src);

	var pass_details = pass_link.data('pass-info')['pass_details'];
	console.log(pass_details);
	passtiche_dialog.find('.pass_details_wrapper:first').html(pass_details);
	


	// setup pass link
	var pass_link =  $(document).data('passtiche-base-url') + '/p/' + passtiche_dialog.data('pass_template_code');
	var short_pass_link = pass_link.slice(7,pass_link.length);
	if (short_pass_link.indexOf('www.') == 0)
		short_pass_link = short_pass_link.slice(4,short_pass_link.length);
	passtiche_dialog.find('#inputLink').val(short_pass_link);
	passtiche_dialog.find('#link_text').attr('href',pass_link);

	// setup social links
	passtiche_dialog.find('#share-social').find('.twitter').find('a').attr('href','http://twitter.com/intent/tweet?text=http%3A%2F%2Fpasstiche.com%2Fp%2F' 
		+ passtiche_dialog.data('pass_template_code') + '%20Check%20Out%20This%20Pass');

	passtiche_dialog.find('#share-social').find('.fb').find('a').attr('href','http://www.facebook.com/share.php?u=http%3A%2F%2Fpasstiche.com%2Fp%2F' 
		+ passtiche_dialog.data('pass_template_code'));	


	passtiche_dialog.modal('show');

	passtiche_dialog.find('#pass_embed').find('textarea').html('&lt;script src="http://www.passtiche.com/js"&gt;&lt;/script&gt;\n'
		+ '&lt;a data-pass-id="' + passtiche_dialog.data('pass_template_code') + '" &gt;&lt;/a&gt;')
	


	if (passtiche_dialog.find('#downloading_pass:visible').length > 0){
		// redirect to direct download page 
		var dd_href = PASSTICHE_BASE_URL;
		if (passtiche_dialog.data('user_pass'))
			dd_href += ('/ud/' + passtiche_dialog.data('user_pass'));
		else dd_href += ('/pd/' + pass_code);

		setTimeout(function(){
			window.location.href = dd_href;	
		}, 500);
		setTimeout(function(){
			passtiche_dialog.modal('hide');
		}, 3000);		

	}