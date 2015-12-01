[![CircleCI](https://img.shields.io/circleci/project/pelias/leaflet-geocoder.svg?style=flat-square)](https://circleci.com/gh/pelias/leaflet-geocoder/)
[![David devDependencies](https://img.shields.io/david/dev/pelias/leaflet-geocoder.svg?style=flat-square)](https://david-dm.org/pelias/leaflet-geocoder/#info=devDependencies)

Leaflet geocoder plugin
========================

A plugin that adds the ability to search (geocode) a Leaflet-powered map using [Mapzen Search](https://mapzen.com/projects/search) or your own hosted version of the [Pelias Geocoder API](https://github.com/pelias/api).

## Requirements

Supports [Leaflet](https://github.com/Leaflet/Leaflet) **v0.7.3** (and higher) and **v1.0.0-beta.1**. (Previous Leaflet versions may work, but these are not targeted.)

## Demo

[Click here](http://pelias.github.io/leaflet-geocoder/)

## Basic usage

**Step 1:** Import the required Leaflet JavaScript and CSS files

```html
<!-- Load Leaflet from CDN -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet.js"></script>

<!-- Load Pelias geocoding plugin after Leaflet -->
<link rel="stylesheet" href="pelias-leaflet-geocoder.css">
<script src="pelias-leaflet-geocoder.js"></script>
```

**Step 2:** Initialize your Leaflet map

```javascript
// This is an example of Leaflet usage; you should modify this for your needs.
var map = L.map('map').setView([40.7259, -73.9805], 12);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```

**Step 3:** Add a custom geocoder

Get a Mapzen Search API key from the [Mapzen developers portal](http://mapzen.com/developers/). It's free!

```javascript
L.control.geocoder('<your-api-key>').addTo(map);
```

**Step 4**: Rejoice!

## Browser support

The Pelias-Leaflet geocoder supports all Leaflet-supported browsers _except_ for Internet Explorer 7. The plugin makes a cross-domain request in Javascript to obtain search results, which is not supported in IE7 without JSONP. Mapzen Search [does not support API requests in JSONP](https://mapzen.com/documentation/search/use-cors/#why-not-jsonp).


## Customizing the plugin

You can optionally specify additional settings to the plugin by passing in an object as a second argument to the `geocoder()` method, like so:

```javascript
var options = {
  bounds: true,
  position: 'topright',
  expanded: true
}

L.control.geocoder('<your-api-key>', options).addTo(map);
```

Here are a list all the settings and their default values.

### Query behavior

Some options affect the Pelias query itself.

option      | description                               | default value
----------- | ----------------------------------------- | ---------------------
**url** | _String._ Host endpoint for a Pelias-compatible search API. | `'https://search.mapzen.com/v1'`
**bounds** | _[Leaflet LatLngBounds object](http://leafletjs.com/reference.html#latlngbounds)_ or _Boolean_. If `true`, search is bounded by the current map view. You may also provide a custom bounding box in form of a LatLngBounds object. | `false`
**latlng** | _[Leaflet LatLng object](http://leafletjs.com/reference.html#latlng)_ or _Boolean_. If `true`, search is biased to prioritize results near the center of the current view. You may also provide a custom LatLng value (in any of the [accepted Leaflet formats](http://leafletjs.com/reference.html#latlng)) to act as the center bias. | `false`
**layers** | _String_ or _Array_. Layers to query (see documentation for more details). If not provided, results will come from all available layers. **NOTE:** layers is not available for the autocomplete query. | `null`

### Interaction behavior

These options affect the plugin's appearance and interaction behavior.

option      | description                               | default value
----------- | ----------------------------------------- | ---------------------
**position** | _String_. Corner in which to place the geocoder control. Values correspond to Leaflet [control positions](http://leafletjs.com/reference.html#control-positions). | `'topleft'`
**attribution** | _String_. Attribution text to include for Pelias. Set to blank or `null` to disable. | `'Geocoding by <a href=\'https://mapzen.com/pelias\'>Pelias</a>'`
**placeholder** | _String_. Placeholder text to display in the search input box. Set to blank or `null` to disable. | `'Search'`
**title** | _String_. Tooltip text to display on the search icon. Set to blank or `null` to disable. | `'Search'`
**panToPoint** | _Boolean_. If `true`, highlighting a search result pans the map to that location. | `true`
**pointIcon** | _String_. Path to the image used to indicate a point result. Set to a falsy value to disable. | `'images/point_icon.png'`
**polygonIcon** | _String_. Path to the image used to indicate a polygon result. Set to a falsy value to disable. | `'images/polygon_icon.png'`
**markers** | _[Leaflet Marker options object](http://leafletjs.com/reference.html#marker-options)_ or _Boolean_. If `true`, search results drops Leaflet's default blue markers onto the map. You may customize this marker's appearance and behavior using Leaflet [marker options](http://leafletjs.com/reference.html#marker-options). | `true`
**fullWidth** | _Integer_ or _Boolean_. If `true`, the input box will expand to take up the full width of the map container. If an integer breakpoint is provided, the full width applies only if the map container width is below this breakpoint. | `650`
**expanded** | _Boolean_. If `true`, the search input is always expanded. It does not collapse into a button-only state. | `false`
**autocomplete** | _Boolean_. If `true`, suggested results are fetched on each keystroke. If `false`, this is disabled and users must obtain results by pressing the Enter key after typing in their query. | `true`

### Examples

```javascript
// Different position
L.control.geocoder('<your-api-key>', {
  position: 'topright'
}).addTo(map);

// Searching nearby [50.5, 30.5]
L.control.geocoder('<your-api-key>', {
  latlng: [50.5, 30.5], // this can also written as {lat: 50.5, lon: 30.5} or L.latLng(50.5, 30.5)
  placeholder: 'Search nearby [50.5, 30.5]'
}).addTo(map);

// Taking just the center of the map (lat/lon) into account
L.control.geocoder('<your-api-key>', {
  latlng: true,
  placeholder: 'Search nearby'
}).addTo(map);

// Searching within a bounding box
var southWest = L.latLng(40.712, -74.227);
var northEast = L.latLng(40.774, -74.125);
var bounds = L.latLngBounds(southWest, northEast);

L.control.geocoder('<your-api-key>', {
  bounds: bounds,
  placeholder: 'Search within ' + bounds.toBBoxString()
}).addTo(map);

// Taking just the bounding box of the map view into account
L.control.geocoder('<your-api-key>', {
  bounds: true,
  placeholder: 'Search within the bounds'
}).addTo(map);

// Coarse Geocoder: search only admin layers
L.control.geocoder('<your-api-key>', {
  layers: 'coarse',
  placeholder: 'Coarse geocoder'
}).addTo(map);

// Address Geocoder: search only (street) address layers
L.control.geocoder('<your-api-key>', {
  layers: 'address',
  placeholder: 'Address geocoder'
}).addTo(map);

// POI Geocoder: search only points of interests
L.control.geocoder('<your-api-key>', {
  layers: 'venue',
  placeholder: 'Venues geocoder'
}).addTo(map);

// Street level Geocoder: search only venue and street addresses
L.control.geocoder('<your-api-key>', {
  layers: ['venue', 'address'],
  placeholder: 'Street Geocoder'
}).addTo(map);

// Customizing icons
L.control.geocoder('<your-api-key>', {
  pointIcon: 'http://www.somewhereontheweb.com/download/img/point.png',
  polygonIcon: 'https://cloud.com/polygon-icon.svg'
}).addTo(map);

// Configure if you want to zoom/pan to a point while browsing the results (up/down arrows)
// panToPoint set to true (by default)
// as per https://github.com/pelias/leaflet-geocoder/issues/6
L.control.geocoder('<your-api-key>', {
  panToPoint: true
}).addTo(map);

// Setting full width on the search text box
// by default: 650 (pixels)
L.control.geocoder('<your-api-key>', {
  fullWidth: true
}).addTo(map);

// Configure if you want to drop a pin for a search results or not
// by default - this is set to true
// as per https://github.com/pelias/leaflet-geocoder/issues/7
L.control.geocoder('<your-api-key>', {
  markers: false
}).addTo(map);

// Ability to collapse to a button instead of a expanded text box
// by default - this is set to false
// as per https://github.com/pelias/leaflet-geocoder/issues/7
L.control.geocoder('<your-api-key>', {
  expanded: false
}).addTo(map);

// Changing attribution
// By default, adds "Geocoding by Pelias" text with a link
// You can remove this if you like, or change the text.
L.control.geocoder('<your-api-key>', {
  attribution: null
}).addTo(map);
```

## Advanced usage

### Alternate syntax

You can initialize a geocoder with the `new` keyword. Notice that the class names are capitalized. This is what actually happens under the hood of `L.control.geocoder()`, so this syntax does not do anything different, but you may prefer it for clarity or stylistic reasons.

```javascript
new L.Control.Geocoder('<your-api-key>').addTo(map);
```

### Scripting with the plugin

After initializing a geocoder you may store an instance of the geocoder object to a variable.

```javascript
var geocoder = L.control.geocoder('<your-api-key>');

// or with `new` keyword
var geocoder = new L.Control.Geocoder('<your-api-key>');

// later
geocoder.addTo(map);
```

The plugin extends Leaflet's [Control](http://leafletjs.com/reference.html#control) class, so you may use any of those methods to modify plugin behavior in your script.

```javascript
// examples
geocoder.setPosition('topright');
var element = geocoder.getContainer();
geocoder.removeFrom(map); // or geocoder.remove() in Leaflet v1
```

### Events

The geocoder includes all of Leaflet's [events methods](http://leafletjs.com/reference.html#events) and adds additional events that you can subscribe to, so that you can customize what happens when users interact with the geocoder. When you instantiate a new geocoder, assign it to variable, as above, and then you can use the event methods to listen for the events that it's firing. For example:

```javascript
geocoder.on('select', function (e) {
  console.log('You’ve selected', e.feature.properties.label);
});
```

All of Leaflet's event methods are available, such as `on`, `off`, `once`, and so on. The exact syntax and how it behaves are inherited from the version of Leaflet you are plugging into, so there are slight differences between the 0.7.x version line and the 1.0.0 version line.

The following events are fired:

event         | description
------------- | ---------------------------------------------------------------
**results**   | Fired when search results are obtained.
**error**     | Fired if there was an error with a search request.
**select**    | Fired when a result is actively selected from the results list (not just highlighted.)
**highlight** | Fired when a result is highlighted by the up/down arrow keys.
**expand**    | Fired when the geocoder is expanded.
**collapse**  | Fired when the geocoder is collapsed.
**reset**     | Fired when the geocoder is reset ("x" button is clicked).

Here is [a demo of the events](http://pelias.github.io/leaflet-geocoder/examples/events.html).

#### Getting data

You can use events to provide additional functionality when certain things occur. Events are also the best way to get Mapzen Search result data out of the plugin so that your application can do other things with it.

##### on `results` or `error`

In addition to the [base event object](http://leafletjs.com/reference.html#event-objects) from Leaflet, the event object will contain these other useful properties:

property      | description
------------- | ---------------------------------------------------------------
**endpoint**  | A string of the Mapzen Search API endpoint that was called.
**requestType** | A string, either `autocomplete` or `search`, depending on the request made.
**params**    | An object containing the parameters that have been passed to the Mapzen Search request.
**results**   | The [original response object](https://mapzen.com/documentation/search/response/) returned from Mapzen Search, including all feature geometries and properties.

If there was an error with the request, the event object will contain the additional properties:

property      | description
------------- | ---------------------------------------------------------------
**errorCode** | The HTTP status code received. [More information](https://mapzen.com/documentation/search/http-status-codes/).
**errorMessage** | The error message string that the geocoder will display.

##### on `select` and `highlight`

property      | description
------------- | ---------------------------------------------------------------
**originalEvent** | The original event (mouse or keyboard) reported by the browser.
**latlng**    | A [Leaflet LatLng](http://leafletjs.com/reference.html#latlng) object representing the coordinates of the result.
**feature**   | The [GeoJSON feature object](https://mapzen.com/documentation/search/response/#list-of-features-returned) from Mapzen Search, including feature geometry and properties.


### Accessing other plugin internals

Properties and methods used internally by the geocoder are also available on the returned object. These are purposefully not private or obscured, but they are also not publicly documented right now, since functionality may fluctuate without notice. Depending on usage and demand we will lock down and document internal properties and methods for general use. [Please let us know in the issues tracker](https://github.com/pelias/leaflet-geocoder/issues) if you have feedback.
