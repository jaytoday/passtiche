
{% if is_mobile %}
	$(document).data('is-mobile', true);
	
{% end %}

$(document).data('base-url', '{{ base_url }}');