
function updateLocations(){

$.ajax({
type: "GET",
url: "/api/1/loc.find",
data: {'output': 'html', 'account': $(document).data('current_user')},
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
       $('#content_edit_wrapper').html($(this).parent().find('.edit').html()).show();
});

$('a#new_location').on('click', function(){

     $('#content_edit_wrapper').html($('#new_location_wrapper').html()).show();

});




function SaveLocation(fieldset){

	var location_data = {'output': 'html', 'account': $(document).data('current_user')};

	input_vals = ['name', 'code','phone','yelp','opentable','website','neighborhood_name','street_address','region_name', 'region_code', 'delete'];
	$(input_vals).each(function(i, f){
		if (fieldset.find('#' + f).val())
			location_data[f] = fieldset.find('#' + f).val();
	});

							
console.log(location_data);

	$.ajax({
	type: "GET",
	url: "/api/1/loc.update",
	data: location_data,
	success: function(response){
	// TODO: JS templating with JSON
	renderLocations(response);

	}
	});	   
};

$('.save_location').live('click', function(){
	var fieldset = $(this).parents('fieldset:first');
	SaveLocation(fieldset)
});
$('.delete_location').live('click', function(){
	if (!confirm('Are you sure you want to delete this?'))
		return;
	var fieldset = $(this).parents('fieldset:first');
	fieldset.find('#delete').val('true');
	SaveLocation(fieldset)
});