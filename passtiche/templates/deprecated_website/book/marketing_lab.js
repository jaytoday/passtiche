$('#paymentModal').modal({'show': false});

function submitPayment(token){

            $.ajax({
              type: "POST",
              url: "/ajax/account.payment",
              data: { 'token': token },
              success: function(response){


             $('#paymentModal').modal('hide');
        
             $('#campaign_state').addClass('paid').addClass('active')
             .find('span').text('Enabled').end().find('i').attr('class','icon-check'); 
             
              $(".book_widget_link").each(function(){
                    console.log('activating link', $(this));
                    $(this).addClass('paid').attr('href', $(this).attr('_href'));
                
                }).filter(':first').click();
                 },
               error: function(){
                   alert('error saving payment information');

               },
               complete: function(){

               }
            });
              
};

$('#save_cc').live('click', function(){
     if ($('#prefer_billing').is(':checked'))
           return submitPayment('billing');
            
  
        var cc_number = $('#paymentModal').find('#cc_number').val();
        var cvc = $('#paymentModal').find('#cvc_code').val();
        var exp_month = $('#paymentModal').find('#expiry_month').val();
        var exp_year = '20' + $('#paymentModal').find('#expiry_year').val();
        if (!cc_number)
            return alert('a credit card number is required');
        if (!cvc)
            return alert('a security code is required');      
        if (!exp_month || !exp_year)
         return alert('an expiration date is required');      
                
      //  var amount = 1000; //amount you want to charge in cents
        var payment_options = {
            number: cc_number,
            cvc: cvc,
            exp_month: exp_month, 
            exp_year: exp_year, 
        };
        console.log(payment_options);
        Stripe.createToken(payment_options, function(status, response) {
             if (response.error) 
                return alert(response.error.message);
                
            submitPayment(response['id']);
                
             
        });

        /*
        Send token to server
        {
          id : "tok_u5dg20Gra", // String of token identifier,
          amount : 100, // Integer amount token was created for in cents
          card : {...}, // Dictionary of the card used to create the token
          created : 1324293907, // Integer of date token was created
          currency: "usd", // String currency that the token was created in
          livemode: true, // Boolean of whether this token was created with a live or test API key
          object: "token", // String identifier of the type of object, always "token"
          used : false, // Boolean of whether this token has been used,
        }
        */
         
});

$('#change_daily_budget').find('a').live('click', function(){
   var current_val = parseInt($('#daily_budget_val').text());
   if ($(this).attr('id') == 'plus')
        var new_val = current_val + 50;
    else
        var new_val = current_val - 50;
    if (new_val < 0) new_val = 0;
   $('#daily_budget_val').text(new_val); 
});

$('#campaign_state').live('click', function(){
   
   if (!$(this).hasClass('paid'))
        return $('#paymentModal').find('#analytics_payment').hide().end()
                                 .modal({'show': true});
        
    
});