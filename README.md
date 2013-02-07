##This is a jQuery plugin that creates a resizable full-browser video gallery from a user's Vimeo stream.

###Requires 4 HTML elements:

```
<div id="container">
	<div id="videoThumbContainer"></div>
	<div id="videoViewOverlay"></div>
	<div id="videoBox"></div>
</div>
```

###Then to initialize:

``` javascript
$('#container').vimeoGrid({
  vimeoUsername : 'vimeo-username-here'
});
```

###View a working example at (http://projects.mikefey.com/vimeo_grid/)