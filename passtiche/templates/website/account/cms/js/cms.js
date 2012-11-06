

{% include "pass.js" %}

{% include "location.js" %}

{% include "list.js" %}


/* Tabs */
$('#main-nav').find('li').on('click',function (e) {
	$('#content_edit_wrapper').html('');
  $(this).find('a').tab('show');
}).filter(':first').click();

