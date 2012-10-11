
function createUserPass(){
	var name_val = $('#name_form').find('#inputName').val();
	if (!name_val)
		name_val = "Not Specified";
	$('#name_form').hide();

	$('#name_form').find('#continue_btn').button('loading');
	$('#send_form').show().find('#inputName2').val(name_val);


	pass_data = {
		'pass_template': send_pass_modal.data('pass_template_id'),
		'action': send_pass_modal.data('pass_action'),
		'theme': send_pass_modal.find('#inputThemes').find('input:checked').val(),
		'owner_name': name_val
	};

   $.ajax({
     type: "POST",
     url: "/ajax/pass.save",
     data: pass_data,
     success: function(response){
     	console.log(response)
     	send_pass_modal.data('user_pass', response);

		var pass_link =  $(document).data('domain') + '/p/' + response;

		send_pass_modal.find('#inputLink').val(pass_link);
		send_pass_modal.find('#link_text').attr('href','http://' + pass_link);


     }
     });

}


// enter name 
$('#name_form').find('#continue_btn').on('click', createUserPass);




function updateUserPass(){

	pass_data = {
		'user_pass': send_pass_modal.data('user_pass'),
		'action': send_pass_modal.data('pass_action'),
		'theme': send_pass_modal.find('#inputThemes').find('input:checked').val()
	};



   $.ajax({
     type: "POST",
     url: "/ajax/pass.save",
     data: pass_data,
     success: function(response){


     }
     });

};


function incrementPassCount(pass_id, action){

	   $.ajax({
     type: "POST",
     url: "/ajax/pass.save",
     data: {
     	"pass_id": pass_id,
     	"action": action,
     	"increment": true
     },
     success: function(response){


     }
     });

}