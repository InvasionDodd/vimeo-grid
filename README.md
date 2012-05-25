This is a jQuery plugin that creates a resizable full-browser video gallery created from a user's Vimeo stream.

Usage:

Requires 3 HTML elements:

```
<div id="videoThumbContainer"></div>
<div id="videoViewOverlay"></div>
<div id="videoBox"></div>
```

Then to initialize:

``` javascript
$('#container').vimeoGrid({
  vimeoUsername : 'vimeo-username-here'
});
```

View a working example at (http://projects.mikefey.com/vimeo_grid/)