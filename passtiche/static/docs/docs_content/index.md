<!--<iframe src="http://ghbtns.com/github-btn.html?user=passtiche&amp;repo=passtiche-client&amp;type=watch&amp;count=true" allowtransparency="true" frameborder="0" scrolling="0" width="110px" height="20px"></iframe>-->

<div style="display:none;">
# Passtiche Overview
</div>

<h2 style="line-height:38px;color:#666;"><a style="color:black;" href="http://www.passtiche.com">Passtiche</a> Enhances Websites &amp; Apps <br/>With Custom <i style="color:#333;">Add to Passbook</i> Badges</h2>
<br/>
<div style="height:10px;"></div>

<p style="
    font-size: 16px;
"><img src="/badge" style="
    height: 40px;
    width: 123px;
    float: left;
    margin-right: 41px;
"> <a>Passtiche</a> is a website plugin that adds Passbook support to your website or mobile app in just a few seconds.</p>


<div style="height:15px;"></div>

<a href="/#about">Learn more about how Passtiche helps marketers</a>

<div style="height:20px;"></div>


## Add Passtiche To Your Website

You can add Passbook support to your site by adding the Passtiche Javascript code snippet and following the directions below to convert normal links into <i>Add to Passbook</i> badges.

<div style="margin: 0 20px 20px;">
Start by pasting the following code snippet to your website:

<div style="width: 100%;
height: 60px;
margin: 20px 20px 0;">
<pre style="float:left;"><code style="font-size:1.3em;">&lt;script src="<span class="atv">http://passtiche.com/js</span>"&gt;&lt;/script&gt;</code></pre>
</div>

This markup should be placed at the bottom of your website's HTML (or generated-HTML) structure, before the closing &lt;body&gt; tag.

</div>
<div style="height:30px;"></div>


## Create Badges for Existing Passes

You can specify the location of an existing pass file to use the Passtiche download dialog and sharing features while using your own Passbook server or the Pass creation tool of your choice.

To generate a badge for a pass file, include the Passtiche javascript library on the page and link to your pass file like you normally would:


<div style="width: 100%;
height: 60px;
margin: 20px 20px 0;">
<pre style="float:left;"><code>&lt;a <span class="kwd">href</span>="<span class="atv">http://www.passtiche.com/demo.pkpass</span>"&gt;Download My Pass&lt;/a&gt;</code></pre>
</div>

Here is the badge rendered when this link is on a page with the Passtiche JS library:
<div style="margin:15px;text-align:center;max-width:500px;">
<div  style="height:40px; margin:20px;padding:10px;background:rgba(200,200,200,.3);border-radius:5px;"> <a href="http://www.passtiche.com/demo.pkpass">Download My Pass</a> </div>
</div>

<div style="height:45px;"></div>
## Create Badges for New Passes

If you don't already have a pass created, you can use special <code>data-pass</code> attributes for <i>Add to Passbook</i> badges that link to automatically generated passes.  

Here is an example of a link that specifies the name of a location with a <code>data-pass-loc</code> attribute:

<div style="width: 100%;
height: 60px;
margin: 20px 20px 0;">
<pre style="float:left;"><code>&lt;a <span class="atv">data-pass-loc</span>="<span class="kwd">Roxie Theater</span>" <span class="atv">data-pass-city</span>="<span class="kwd">San Francisco</span>" &gt;&lt;/a&gt;</code></pre>
</div>

Here is the badge rendered when this link is on a page with the Passtiche JS library:
<div style="margin:15px;text-align:center;max-width:500px;">
<div  style="height:40px; margin:20px;padding:10px;background:rgba(200,200,200,.3);border-radius:5px;"> <a data-pass-loc="Roxie Theater" data-pass-city="San Francisco"></a> </div>
</div>

<div style="height:15px;"></div>


<h3>Add Optional Event/Activity Info</h3>

Here's the markup and resulting badge for for a link containing <code>data-pass</code> attributes for an activity name and price.

<div style="width: 100%;
height: 60px;
margin: 20px 20px 0;">
<pre style="float:left;"><code>&lt;a <span class="atv">data-pass-loc</span>="<span class="kwd">21st Amendment</span>" <span class="atv">data-pass-name</span>="<span class="kwd">Sample a Dozen Beers</span>"<br/> <span class="atv">data-pass-price</span>=<span class="kwd">"10</span>" <span class="atv">data-pass-city</span>="<span class="kwd">San Francisco</span>" &gt;&lt;/a&gt;</code></pre>
</div>
<div style="margin:15px;text-align:center;max-width:500px;">
<div  style="height:40px; margin:20px;padding:10px;background:rgba(200,200,200,.3);border-radius:5px;"> <a data-pass-loc="Local Pub" data-pass-city="San Francisco" data-pass-name="Sample a Dozen Beers" data-pass-price="10" ></a> </div>
</div>

<div style="margin:5px 0 0 20px;">

<h4 style="color:#666;">Data Attribute Details</h4>

<i>Remember to prefix these attributes with <code>data-pass-</code></i>

<div style="height:10px;"></div>

<ul>
	<li><b>loc</b> - (<b><i>required</i></b>) Name of location</li>
	<li><b>city</b> - (<b><i>required</i></b>) Name of city containing location</li>
	<div style="height:10px;"></div>
	<li><b>name</b> - (<b><i>required</i></b>) Name of activity/event</li>
	<li><b>price</b> - (<b><i>required</i></b>) Price of activity/event</li>
	<li><b>description</b> - (<b><i>required</i></b>) Description of activity/event</li>
</ul>

<div style="height:1px;"></div>

You can also use <code>data-pass-id</code> to specify a 4-character ID code for an existing pass. <div style="height:2px;"></div><i style="font-size:.8em;">No other attributes are required when an ID is specified.</i>

</div>

<div style="height:15px;"></div>

<div class="alert">
	<b>Passtiche now also supports open standards!</b> <div style="height:10px;"></div> You can use <a href="http://microformats.org/wiki/hcard">hCard</a> and <a href="http://ogp.me/">Open Graph</a> in addition to <code>data-pass</code> attributes.
</div>


<div style="height:30px;"></div>



## Customize Your Passes

From the <a>Passtiche Dashboard</a> you can manage the appearance and content of your passes. 
<div style="height:5px;"></div>
### &nbsp; Customizing Pass Appearance:

<div style="margin: 0 20px 20px;">
You can add your own logo and color scheme using optional parameters included with your Passtiche Javascript Library code snippet. You can test these settings using a visual editor. More details coming soon. 
</div>

### &nbsp; Customizing Pass Content:

<div style="margin: 0 20px 20px;">
You can edit the details of any pass you have created using a built-in CMS. More details coming soon. 
</div>

<br/>
<div style="display:none;">
### Support

Please contact [Passtiche][email]  <!-- Discussion Group, etc. -->

</div>



### Add Passtiche To Your Android App 

Email us at <a href="mailto:support@passtiche.com">support@passtiche.com</a> for first access to the Passtiche for Android SDK.

<div style="height:15px;"></div>



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
