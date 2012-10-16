{% include "audience_activity.js" %}
{% include "audience_demographics.js" %}

function renderBookAnalytics(){
    console.log('rendering book analytics');
    
        
book_key =  $('#book_profile').find('.book_profile_inner:first').attr('id');     
audience_insights_wrapper = $('#book_profile').find('#audience_insights:first');

renderAudienceActivity();
setTimeout(function(){ 
    renderAudienceDemographics();
    }, 1000);



}; // end renderBookAnalytics
