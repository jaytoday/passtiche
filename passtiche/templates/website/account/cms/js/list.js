
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


function SaveList(fieldset){


	var list_data = {'output': 'html'};

	input_vals = ['name', 'passes','delete'];
	$(input_vals).each(function(i, f){
		if (fieldset.find('#' + f).val())
			list_data[f] = fieldset.find('#' + f).val();
	});

							
console.log(list_data);

	$.ajax({
	type: "GET",
	url: "/api/1/list.update",
	data: list_data,
	success: function(response){
	// TODO: JS templating with JSON
	renderLists(response);

	}
	});	   
};

$('.save_list').live('click', function(){
	var fieldset = $(this).parents('fieldset:first');
	SaveList(fieldset)
});
$('.delete_list').live('click', function(){
	if (!confirm('Are you sure you want to delete this?'))
		return;
	var fieldset = $(this).parents('fieldset:first');
	fieldset.find('#delete').val('true');
	SaveList(fieldset)
});