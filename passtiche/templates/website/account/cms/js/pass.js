
function updatePassTemplates(){

$.ajax({
type: "GET",
url: "/api/1/pass.find",
data: {'output': 'html'},
success: function(response){
// TODO: JS templating with JSON
renderPassTemplates(response);

}
});	   
};

function renderPassTemplates(resp_html){
     $('#pass_template_list').html(resp_html);
     $('#pass_template_list').find('.edit_pass:first').click();
};

$('#pass_link').parent().on('click', function(){
	updatePassTemplates();
});


$('a.edit_pass').live('click', function(){
       $('#content_edit_wrapper').html($(this).parent().find('.edit').html());
});

$('a#new_pass').on('click', function(){

     $('#content_edit_wrapper').html($('#new_pass_wrapper').html());

});




function SavePassTemplate(fieldset){

	var pass_data = {'output': 'html'};

	var name = fieldset.find('#name').val();
	if (name)
		pass_data['name'] = name;

	var slug = fieldset.find('#slug').val();
	if (slug)
		pass_data['slug'] = slug;

	var description = fieldset.find('#description').val();
	if (description)
		pass_data['description'] = description;

	var neighborhood_name = fieldset.find('#neighborhood_name').val();
	if (neighborhood_name)
		pass_data['neighborhood_name'] = neighborhood_name;

	var location_code = fieldset.find('#location_code').val();
	if (location_code)
		pass_data['location_code'] = location_code;	

	var price = fieldset.find('#price').val();
	if (price)
		pass_data['price'] = price;		

	var price_rating = fieldset.find('#price_rating').find('option:selected');
	if (price_rating.length > 0)
		pass_data['price_rating'] = price_rating.val();		


	var starts = fieldset.find('#starts').val();
	if (starts)
		pass_data['starts'] = starts;

	var ends = fieldset.find('#ends').val();
	if (ends)
		pass_data['ends'] = ends;	

	var weekday_range = fieldset.find('#weekday_range').val();
	if (weekday_range)
		pass_data['weekday_range'] = weekday_range;						

	var times = fieldset.find('#times').val();
	if (times)
		pass_data['times'] = times;		

							
console.log(pass_data);

	$.ajax({
	type: "GET",
	url: "/api/1/pass.update",
	data: pass_data,
	success: function(response){
	// TODO: JS templating with JSON
	renderPassTemplates(response);

	}
	});	   
};

$('.save_pass').live('click', function(){
	var fieldset = $(this).parents('fieldset:first');
	SavePassTemplate(fieldset)
});

