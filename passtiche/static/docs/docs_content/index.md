<!--<iframe src="http://ghbtns.com/github-btn.html?user=passtiche&amp;repo=passtiche-client&amp;type=watch&amp;count=true" allowtransparency="true" frameborder="0" scrolling="0" width="110px" height="20px"></iframe>-->

<div style="display:none;">
# Passtiche Overview
</div>

<h2 style="line-height:38px;color:#666;"><a style="color:black;" href="http://www.passtiche.com">Passtiche</a> Enhances Local Listings With<br/> Customizable <i style="color:#333;">Add to Passbook</i> Badges</h2>
<br/>
<div style="height:10px;"></div>

<p>Passtiche helps you add Passbook support to your local listings <i>(events, reviews, etc.)</i> in just a few seconds.</p>


<div style="height:10px;"></div>
<h4 style="line-height:32px;color:#666;">Passbook: A Powerful New Channel for Local Marketing</h4>
<p><a href="http://www.apple.com/ios/whats-new/#passbook" target="_blank">Apple Passbook<sup style="font-size: 11px;margin-right: -1px;top: -7px;">®</sup></a> is where iPhone and iPod Touch owners store and access boarding passes, tickets, coupons and more.
</p> Fortune 500 companies such as Starbucks and startups like AirBnb and Eventbrite are now offering support for Passbook and taking advantage of powerful marketing features that include <b>push notifications</b> and <b>location-based reminders</b>.

<h4 style="line-height:32px;color:#666;">Passtiche Simplifies Passbook for Local Marketers</h4>

</p>Setting up your own Passbook server is time-consuming, difficult, and highly technical. Passtiche provides the marketing benefits with simple snippets of code you can add to your website in a few minutes.</p>
<p> </p>
<p> </p>

<br/>


## Passtiche For Websites

You can add Passbook support to your site by adding the Passtiche Javascript code snippet to your site and using HTML attributes to specify which links to convert into <i>Add to Passbook</i> badges.

### &nbsp; Setup the Passtiche Javascript Library 

<div style="margin: 0 20px 20px;">
Start by pasting the following code snippet to your website:

<div style="width: 100%;
height: 60px;
margin: 20px 20px 0;">
<pre style="float:left;"><code>&lt;script src="http://passtiche.com/js"&gt;&lt;/script&gt;</code></pre>
</div>

This markup should be placed at the bottom of your website's HTML (or generated-HTML) structure, before the closing &lt;body&gt; tag.

</div>



### &nbsp; Add Links With Pass Badge Attributes

<div style="margin: 0 20px 20px;">
Once the javascript library has loaded, it will automatically replace links containing a special <code>data-passtiche</code> attribute with a Passtiche <i>Add to Passbook</i> badge. 

Here is an example of a link that contains a location name:

<div style="width: 100%;
height: 60px;
margin: 20px 20px 0;">
<pre style="float:left;"><code>&lt;a data-passtiche-loc="Roxie Theater" data-passtiche-city="San Francisco" &gt;&lt;/a&gt;</code></pre>
</div>

Here is the badge as it would appear:
<div style="margin:15px;text-align:center;max-width:500px;">
<div  style="height:40px; margin:20px;padding:10px;background:rgba(200,200,200,.3);border-radius:5px;"> <a data-passtiche-loc="Local Pub" data-passtiche-city="San Francisco"></a> </div>
</div>
<br/>
Here is an example of a link that specifies a location as well as an event name, price and description.

<div style="width: 100%;
height: 60px;
margin: 20px 20px 0;">
<pre style="float:left;"><code>&lt;a data-passtiche-loc="21st Amendment" data-passtiche-name="Sample a Dozen Beers" <br/>data-passtiche-price="10" data-passtiche-description="Try this sampling a dozen beers beer beer" data-passtiche-city="San Francisco" &gt;&lt;/a&gt;</code></pre>
</div>

Here is the badge as it would appear:
<div style="margin:15px;text-align:center;max-width:500px;">
<div  style="height:40px; margin:20px;padding:10px;background:rgba(200,200,200,.3);border-radius:5px;"> <a data-passtiche-loc="Local Pub" data-passtiche-city="San Francisco" data-passtiche-name="Sample a Dozen Beers" data-passtiche-price="10" data-passtiche-description="Try this sampling a dozen beers beer beer" ></a> </div>
</div>

More examples will be posted soon that incorporate <a href="http://microformats.org/wiki/hcard">hCard</a> and <a href="http://ogp.me/">Open Graph</a> metadata. 
</div>

<div style="height:10px;"></div>


## Customizing Passes

From the <a>Passtiche Dashboard</a> you can manage the appearance and content of your passes. 
<div style="height:1px;"></div>
### &nbsp; Customizing Pass Appearance:

<div style="margin: 0 20px 20px;">
You can add your own logo and color scheme using optional parameters included with your Passtiche Javascript Library code snippet. You can test these settings using a visual editor. More details coming soon. 
</div>

### &nbsp; Customizing Pass Content:

<div style="margin: 0 20px 20px;">
You can edit the details of any pass you have created using a built-in CMS. More details coming soon. 
</div>

<br/>
### Support

Please contact [Passtiche][email]  <!-- Discussion Group, etc. -->

### Agreement to Passtiche Terms and Apple Guidelines

By using this service you agree to the [Passtiche License and Terms][license] and the <a href="https://developer.apple.com/passbook/AddToPassbookBadgeGuidelines.pdf">Add to Passbook Badge Guidelines</a> provided by Apple. 




[travis]: http://travis-ci.org/tomchristie/django-rest-framework?branch=master
[travis-build-image]: https://secure.travis-ci.org/tomchristie/django-rest-framework.png?branch=restframework2
[urlobject]: https://github.com/zacharyvoase/urlobject
[markdown]: http://pypi.python.org/pypi/Markdown/
[yaml]: http://pypi.python.org/pypi/PyYAML
[0.4]: https://github.com/tomchristie/django-rest-framework/tree/0.4.X
[image]: /static/images/boarding.png
[sandbox]: http://restframework.herokuapp.com/

[quickstart]: tutorial/quickstart.md

[license]: docs/topics/license.md
[find_pass]: api_methods/find_pass.md
[update_pass]: api_methods/update_pass.md
[find_location]: api_methods/find_location.md
[update_location]: api_methods/update_location.md
[find_list]: api_methods/find_list.md
[update_list]: api_methods/update_list.md

[button]: topics/button.md

[request]: api-guide/requests.md
[response]: api-guide/responses.md
[views]: api-guide/views.md
[generic-views]: api-guide/generic-views.md
[parsers]: api-guide/parsers.md
[renderers]: api-guide/renderers.md
[serializers]: api-guide/serializers.md
[fields]: api-guide/fields.md
[authentication]: api-guide/authentication.md
[permissions]: api-guide/permissions.md
[throttling]: api-guide/throttling.md
[pagination]: api-guide/pagination.md
[contentnegotiation]: api-guide/content-negotiation.md
[formatsuffixes]: api-guide/format-suffixes.md
[reverse]: api-guide/reverse.md
[exceptions]: api-guide/exceptions.md
[status]: api-guide/status-codes.md
[settings]: api-guide/settings.md

[csrf]: topics/csrf.md
[browser-enhancements]: topics/button.md
[browsableapi]: topics/browsable-api.md
[rest-hypermedia-hateoas]: topics/rest-hypermedia-hateoas.md
[contributing]: topics/contributing.md
[rest-framework-2-announcement]: topics/rest-framework-2-announcement.md
[release-notes]: topics/release-notes.md
[credits]: topics/credits.md

[group]: https://groups.google.com/forum/?fromgroups#!forum/django-rest-framework
[DabApps]: http://dabapps.com
[email]: mailto:james@passtiche.com
