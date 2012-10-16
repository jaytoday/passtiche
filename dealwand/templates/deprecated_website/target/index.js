

/* Main Index */

 initial_url_frag = window.location.hash;

  
{% if current_user %}

    {% include "nav.js" %}
    {% comment "../utils/channel.js" %}
    {% include "account.js" %}

    {% include "analytics.js" %}


    /* URL Hash 
    
    
    setTimeout(function(){
    // add scripts that aren't needed at first    
    // is raphael needed for anything besides analytics?
    // $('body').append("<script src='/static/js/raphael.js'>\x3C/script>");
  
    if (!initial_url_frag) 
       return loadLandingPage();// $('#intro_video:first').show();
    if (initial_url_frag == '#newbook')
        return $('a#newbook_link:first').click();
    if (initial_url_frag == '#mybooks')
        return $('a#mybooks_link:first').click();
        
        
    if (initial_url_frag == '#pricing')
        return $('#view_pricing:first').click();
        
                
    if (initial_url_frag.indexOf('#book/') > -1){
        var book_id = initial_url_frag.split('#book/')[1];
        console.log('book_id', book_id, $('#book_profile').children(':first').attr('id'));
        if ($('#book_profile').children(':first').attr('id') == book_id){
            console.log('book already loaded'); 
            return $('#book_profile').show();   
        }
        if (book_id.indexOf('/') > -1){
             var split_id = book_id.split('/');
             var book_id = split_id[0];
             var link_id = split_id[1];
             link_selector = 'a[href="' + link_id + '"]';
             if (link_id == 'new')
                 var link_selector = '#new_widget_btn';

                   $('#book_profile').data('callback', function(){
                       setTimeout(function(){
                        console.log('link', $('#book_profile').find(link_selector));
                        $('#book_profile').find(link_selector).click();
                    }, 500);
                    });
           
        }
        return loadBookProfile(book_id);   
  }

   return loadLandingPage();
    

    
    }, 50);
    
   */ 

{% end %}






