// enter name 
$('#name_form').find('#continue_btn').on('click', function(){
	var name_val = $('#name_form').find('#inputName').val();
	if (!name_val)
		name_val = "Not Specified";
	$('#name_form').hide();

	// TODO: ajax to server, get user pass keyname
	$(this).button('loading');
	$('#send_form').show().find('#inputName2').val(name_val);


	pass_data = {
		'pass_template': send_pass_modal.data('pass_template_id'),
		'action': send_pass_modal.data('pass_action'),
		'theme': send_pass_modal.find('#inputThemes').find('input:checked').val(),
		'from_name': name_val
	};

   $.ajax({
     type: "POST",
     url: "/ajax/pass.save",
     data: pass_data,
     success: function(response){
     	console.log(response)
     	send_pass_modal.data('user_pass', response);

     }
     });

});

