
	
dialog_modal = $('#passticheDialogModal');

if (dialog_modal.length < 1) return console.error('dialog HTML not found');

	if (dialog_modal.is(':visible')) return;

	// el can be various buttons and targets
	pass_name = pass_link.data('pass-info')['name'];
	pass_code = pass_link.data('pass-info')['short_code']; // only four characters

	var pass_img_src =  pass_link.data('pass-info')['img'];
	var pass_description = pass_link.data('pass-info')['description'];
	PassticheDialog.resetSendDialog();


	dialog_modal.data('pass_template', pass_name);
	dialog_modal.data('pass_template_code', pass_code);
	dialog_modal.find('.pass_template:first').text(pass_name);	

	
	// use cached values if possible 
	if (localStorage.getItem('user_email'))
		dialog_modal.find('#send_form_download').find('#inputToEmail').val(localStorage.getItem('user_email'));

	if (localStorage.getItem('user_phone'))
		dialog_modal.find('#send_form_download').find('#inputPhone').val(localStorage.getItem('user_phone'));



	// open up default option
	dialog_modal.find('#passOptions').find('a:first').tab('show');

	//dialog_modal.find('#inputThemes input:first').click();

	dialog_modal.find('#pass_preview').attr('src', pass_img_src);

	/*

	TODO: pass details should be added as hidden content to link, or just data 

	var pass_details = pass_link.find('.pass_details_container:last').html();
	dialog_modal.find('.pass_details_wrapper:first').html(pass_details);
	*/


	// setup pass link
	var pass_link =  $(document).data('passtiche-base-url') + '/p/' + dialog_modal.data('pass_template_code');
	dialog_modal.find('#inputLink').val(pass_link);
	dialog_modal.find('#link_text').attr('href','http://' + pass_link);

	// setup social links
	dialog_modal.find('#share-social').find('.twitter').find('a').attr('href','http://twitter.com/intent/tweet?text=http%3A%2F%2Fpasstiche.com%2Fp%2F' 
		+ dialog_modal.data('pass_template_code') + '%20Check%20Out%20This%20Pass');

	dialog_modal.find('#share-social').find('.fb').find('a').attr('href','http://www.facebook.com/share.php?u=http%3A%2F%2Fpasstiche.com%2Fp%2F' 
		+ dialog_modal.data('pass_template_code'));	


	dialog_modal.modal('show');

	dialog_modal.find('#pass_embed').find('textarea').html('&lt;script src="http://www.passtiche.com/js"&gt;&lt;/script&gt;\n'
		+ '&lt;a data-pass-id="' + dialog_modal.data('pass_template_code') + '" &gt;&lt;/a&gt;')
	


	if (dialog_modal.find('#downloading_pass:visible').length > 0){
		// redirect to direct download page 
		var dd_href = $(document).data('base-url');
		if (dialog_modal.data('user_pass'))
			dd_href += ('/ud/' + dialog_modal.data('user_pass'));
		else dd_href += ('/pd/' + pass_code);

		setTimeout(function(){
			window.location.href = dd_href;	
		}, 100);
		setTimeout(function(){
			dialog_modal.modal('hide');
		}, 1000);		

	}