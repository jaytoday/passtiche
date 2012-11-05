
function updateLists(){

$.ajax({
type: "GET",
url: "/api/1/list.find",
data: {'output': 'html'},
success: function(response){
// TODO: JS templating with JSON
renderLists(response);

}
});	   
};

function renderLists(resp_html){
     $('#pass_list_list').html(resp_html);
     $('#pass_list_list').find('.edit_list:first').click();
};

$('#list_link').parent().on('click', function(){
	updateLists();
});


$('a.edit_list').live('click', function(){
       $('#content_edit_wrapper').html($(this).parent().find('.edit').html());
});

$('a#new_list').on('click', function(){

     $('#content_edit_wrapper').html($('#new_list_wrapper').html());

});