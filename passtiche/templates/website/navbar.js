$('.navbar-fixed-top').find('a').on('click', function(){

	if ($(this).hasClass('dropdown-toggle')) return;
	$('.page.container').hide();
	$('.navbar-fixed-top').find('a').removeClass('active');
	// body_link, about, team, developers

	if ($(this).attr('id') == 'body_link')
		return $('#body_container').show();
	if ($(this).attr('id') == 'about_link')
		$('#about_container').show();	
	if ($(this).attr('id') == 'team_link')
		$('#about_container').show();
	if ($(this).attr('id') == 'developers_link')
		$('#developers_container').show();	

	
	$(this).addClass('active');	

});


    initial_url_frag = window.location.hash;    
    if (initial_url_frag == '#about')
        return $('a#about_link:first').click();
    if (initial_url_frag == '#developers')
        return $('a#developers_link:first').click();
