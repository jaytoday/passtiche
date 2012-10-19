DEFAULT_NAME = "Not Specified";

function getPassData(){
     return {
          'pass_template': send_pass_modal.data('pass_template_id'),
          'action': send_pass_modal.data('pass_action'),
          'theme': send_pass_modal.find('#inputThemes').find('input:checked').val(),
          'owner_name': localStorage.getItem("user_name")
     };

}

function updateUserPassLink(){
     var pass_link =  $(document).data('domain') + '/u/' + pass_item.data('user_pass_id');
     send_pass_modal.find('#inputLink').val(pass_link);
     send_pass_modal.find('#link_text').attr('href','http://' + pass_link);
          
}
function createUserPass(){

     // TODO: if pass is already created, update instead - use user_pass data attr for modal
     var name_val = $('#name_form').find('#inputName').val();
     if (!name_val){
          localStorage.setItem("user_name","");
          name_val = DEFAULT_NAME;
     }
          
     else
          localStorage.setItem("user_name", name_val);
     $('#name_form').hide();
     $('#send_form_share').show().find('#inputName2').val(name_val);

     if (pass_item.data('user_pass_id'))
          return updateUserPass();

	pass_data = getPassData();


   $.ajax({
     type: "POST",
     url: "/ajax/pass.save",
     data: pass_data,
     success: function(response){
     	console.log(response)
     	send_pass_modal.data('user_pass', response);
          pass_item.data('user_pass_id', response);

          updateUserPassLink();


     }
     });

}


// enter name 
$('#name_form').find('#continue_btn').on('click', createUserPass);




function updateUserPass(){

	pass_data = getPassData();
     pass_data['user_pass'] = pass_item.data('user_pass_id');
     updateUserPassLink();



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