$('.navbar-fixed-top').find('a').on('click', function(){

	if ($(this).attr('href') && $(this).attr('href').indexOf('#') < 0)
		// link to external site
		return;

	if ($(this).hasClass('dropdown-toggle')) return;
	$('.page.container').hide();
	$('.navbar-fixed-top').find('a').removeClass('active');
	// body_link, about, team, developers

	if ($(this).attr('id') == 'body_link'){
		
		$('.pass_title').textfill(30);
		return $('#body_container').show();   
	}
	if ($(this).attr('id') == 'about_link')
		$('#about_container').show();	
	if ($(this).attr('id') == 'team_link')
		$('#about_container').show();
	if ($(this).attr('id') == 'developers_link')
		$('#developers_container').show();	
	if ($(this).attr('id') == 'signup_link')
		$('#signup_container').show();		

	if ($(this).attr('id') == 'publishers_link')
		$('#publishers_container').show();		


	
	$(this).addClass('active');	

});

function navBarInit(){
    initial_url_frag = window.location.hash;    
    if (initial_url_frag == '#about')
        return $('a#about_link:first').click();
    if (initial_url_frag == '#developers')
        return $('a#developers_link:first').click();
    if (initial_url_frag == '#publishers')
        return $('a#publishers_link:first').click(); 
        if (initial_url_frag == '#signup')
        return $('a#signup_link:first').click();        
};

navBarInit();