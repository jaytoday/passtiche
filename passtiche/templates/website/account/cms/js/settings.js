

$('a#account_settings').on('click', function(){
     $('#content_edit_wrapper').html($('#account_settings_inner').html()).show();
});


$('a#edit_profile').on('click', function(){
     $('#content_edit_wrapper').html($('#edit_profile_inner').html()).show();
});


	$('#settings_links').find('.btn').on('click', function(){
			$('#settings_links').find('.btn').removeClass('active');
			$(this).addClass('active');
	});


	$('#settings_link').on('click', function(){
		setTimeout(function(){
		if ($('#settings_links').find('.btn.active').length > 0)
			$('#settings_links').find('.btn.active').click();
		else
			$('#settings_links').find('.btn:first').click();
	},50);
		
	});

	

$('#save_account_settings').live('click', function(){

	settings_data = {};

	$.each(['domains'], function(i, k){
		var input_val = $('#content_edit_wrapper').find('input#' + k).val();
		if (input_val)
			settings_data[k] = input_val;
	});

	$.each(['template'], function(i, k){
		var input_val = $('#content_edit_wrapper').find('select#' + k).find('option:selected').val();
		if (input_val)
			settings_data[k] = input_val;
	});

	$.each(['foursquare_data','yelp_data','facebook_data'], function(i, k){
		var input_val = $('#content_edit_wrapper').find('input#' + k).attr('checked');
		if (input_val)
			settings_data[k] = input_val;
	});	


	$.ajax({
	type: "POST",
	url: "/ajax/user.edit",
	data: settings_data,
	success: editCallback,
	error: function(response){
		showDialog('Error: Unable to save account settings');
	}
});

});	 


$('#save_profile').live('click', function(){

	profile_data = {};
	$.each(['first_name','image_url', 'last_name','organization','phone','email','website'], function(i, k){
		if ($('#content_edit_wrapper').find('input#' + k).val())
			profile_data[k] = $('#content_edit_wrapper').find('input#' + k).val();
	});

	$.ajax({
	type: "POST",
	url: "/ajax/user.edit",
	data: profile_data,
	success: editCallback,
	error: function(response){
		showDialog('Error: Unable to save profile');
	}
	});	 

});

function editCallback(response){
	// TODO: JS templating with JSON

	$('#content_edit_wrapper').find('fieldset:first').find('.alert-error').remove();

		// TODO: NOT GOOD, USE JSON
		if (response)
			$('#content_edit_wrapper').find('fieldset:first').prepend('<div style="float:left; margin:20px;" class="alert alert-error">' + response + '</div>');
	};
