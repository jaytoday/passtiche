
function updateLocations(){

$.ajax({
type: "GET",
url: "/api/1/loc.find",
data: {'output': 'html'},
success: function(response){
// TODO: JS templating with JSON
renderLocations(response);

}
});	   
};

function renderLocations(resp_html){
     $('#pass_location_list').html(resp_html);
     $('#pass_location_list').find('.edit_location:first').click();
};

$('#location_link').parent().on('click', function(){
	updateLocations();
});


$('a.edit_location').live('click', function(){
       $('#content_edit_wrapper').html($(this).parent().find('.edit').html());
});

$('a#new_location').on('click', function(){

     $('#content_edit_wrapper').html($('#new_location_wrapper').html());

});