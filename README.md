[![npm version](https://img.shields.io/npm/v/pelias-leaflet-plugin.svg?style=flat-square)](https://www.npmjs.com/package/pelias-leaflet-plugin)
[![Build Status](https://travis-ci.com/pelias/leaflet-geocoder.svg?branch=master)](https://travis-ci.com/pelias/leaflet-geocoder)
[![Gitter chat](https://img.shields.io/gitter/room/pelias/pelias.svg?style=flat-square)](https://gitter.im/pelias/pelias)
[![Leaflet 1.0.0 ready](https://img.shields.io/badge/Leaflet%201.0.0-%E2%9C%93-brightgreen.svg?style=flat-square)](http://leafletjs.com/)


Leaflet + Pelias geocoding plugin
========================================

_Note:_ This project is currently in the process of being migrated from the [Nextzen](https://github.com/nextzen/) GitHub organization to the Pelias organization. Please report any broken links or other inaccuracies as issues here. Thanks!

A plugin that adds the ability to search (geocode) a Leaflet-powered map using the [Pelias Geocoder](https://pelias.io).

## Requirements

Requires the **[Leaflet](https://github.com/Leaflet/Leaflet)** mapping library. Supports Leaflet **v0.7.3** (and higher) and **v1.0.0**. (Previous Leaflet versions may work, but are not actively tested or supported.)

**Browser support** is IE8+ [(more details below)](#browser-support).

## Basic usage

**Step 1:** In HTML, import the required Leaflet JavaScript and CSS files. Start quickly with hosted libraries on [cdnjs](http://cdnjs.com/libraries/leaflet-geocoder-mapzen)!

```html
<!-- Load Leaflet from CDN -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.js"></script>

<!-- Load geocoding plugin after Leaflet -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet-geocoder-mapzen/1.9.4/leaflet-geocoder-mapzen.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-geocoder-mapzen/1.9.4/leaflet-geocoder-mapzen.js"></script>
```

**Step 2:** In JavaScript, initialize your Leaflet map.

```javascript
// This is an example of Leaflet usage; you should modify this for your needs.
var map = L.map('map').setView([40.7259, -73.9805], 12);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```

**Step 3:** In JavaScript, add your geocoder configuratin with URL and API key (if needed).

```javascript
var options = {
  url: "http://your-pelias-geocoder"
}
L.control.geocoder('<your-api-key>').addTo(map);
```

**Step 4**: Rejoice!

### There is also a tutorial

It has much more detailed walkthrough instructions and is very friendly for beginners. No coding experience is necessary! [Check it out here](https://github.com/pelias/documentation/blob/master/add-search-to-a-map.md).

### Want this as a module?

Experienced developers can install with [npm](https://www.npmjs.com/):

```sh
npm install pelias-leaflet-plugin
```

And then import it in your module system. For instance, with [Browserify](http://browserify.org/):

```javascript
// Require Leaflet first
var L = require('leaflet');

// Requiring the plugin extends Leaflet automatically
require('pelias-leaflet-plugin');

// You can also store a reference to the geocoder constructor in the require()
var MyGeocoderPlugin = require('pelias-leaflet-plugin');

// Now you can do step 2 and 3 from "Basic usage" instructions, above
```

This plugin implements the [Universal Module Definition](https://github.com/umdjs/umd) so you can also use it in AMD and CommonJS environments.

#### ES2015 (ECMAScript 6)

To import this plugin in ES2015 environments, the `import` syntax is supported:

```javascript
import L from 'leaflet';
import 'pelias-leaflet-plugin';

// Alternatively
import MyGeocoderPlugin from 'pelias-leaflet-plugin';
```

## Customizing the plugin

You can optionally specify additional settings to the plugin by passing in an object as a second argument to the `geocoder()` method, like so:

```javascript
var options = {
  bounds: true,
  position: 'topright',
  expanded: true
};

L.control.geocoder('<your-api-key>', options).addTo(map);
```

Here are a list all the settings and their default values.

### Query behavior

Some options affect the Pelias query itself.

option      | description                               | default value
----------- | ----------------------------------------- | ---------------------
**url** | _String._ Host endpoint for a Pelias-compatible search API. | `'https://api.geocode.earth/v1'`
**bounds** | _[Leaflet LatLngBounds object](http://leafletjs.com/reference.html#latlngbounds)_ or _Boolean_. If `true`, search is bounded by the current map view. You may also provide a custom bounding box in form of a LatLngBounds object. _Note: `bounds` is not supported by autocomplete._ | `false`
**focus** | _[Leaflet LatLng object](http://leafletjs.com/reference.html#latlng)_ or _Boolean_. If `true`, search and autocomplete prioritizes results near the center of the current view. You may also provide a custom LatLng value (in any of the [accepted Leaflet formats](http://leafletjs.com/reference.html#latlng)) to act as the center bias. | `true`
**latlng** | _Deprecated._ Please use **focus** instead. |
**layers** | _String_ or _Array_. Filters results by layers ([documentation](https://github.com/pelias/documentation/blob/master/search.md#filter-by-data-type)). If left blank, results will come from all available layers. | `null`
**params** | _Object_. An object of key-value pairs which will be serialized into query parameters that will be passed to the API. This allows custom queries that are not already supported by the convenience options listed above. For a full list of supported parameters, please read the [Pelias documentation](https://github.com/pelias/documentation/blob/master/search.md). **IMPORTANT: some parameters only work with the `/search` endpoint, and do not apply to `/autocomplete` requests! All supplied parameters are passed through; this library doesn't know which are valid parameters and which are not.** In the event that other options conflict with parameters passed passed through `params`, the `params` option takes precedence. | `null`

#### Examples

```javascript
// Searching nearby [50.5, 30.5]
L.control.geocoder('<your-api-key>', {
  focus: [50.5, 30.5], // this can also written as {lat: 50.5, lon: 30.5} or L.latLng(50.5, 30.5)
  placeholder: 'Search nearby [50.5, 30.5]'
}).addTo(map);

// Taking just the center of the map (lat/lon) into account
L.control.geocoder('<your-api-key>', {
  focus: true,
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
  placeholder: 'Street geocoder'
}).addTo(map);

// Custom filtering and bounding parameters
// For valid parameters, see Pelias documentation for
// search (https://github.com/pelias/documentation/blob/master/search.md)
// and autocomplete (https://github.com/pelias/documentation/blob/master/autocomplete.md)
// Note that some parameters use dot notation and so must be quoted
// in JavaScript otherwise it will result in a syntax error
L.control.geocoder('<your-api-key>', {
  params: {
    sources: 'whosonfirst',
    'boundary.country': 'AUS'
  },
  placeholder: 'Results via Who’s on First in Australia'
}).addTo(map);
```

### Interaction behavior

These options affect the plugin's appearance and interaction behavior.

option      | description                               | default value
----------- | ----------------------------------------- | ---------------------
**position** | _String_. Corner in which to place the geocoder control. Values correspond to Leaflet [control positions](http://leafletjs.com/reference.html#control-positions). | `'topleft'`
**attribution** | _String_. Attribution text that will be appended to Leaflet’s [attribution control](http://leafletjs.com/reference-1.0.3.html#control-attribution). Set to a blank string or `null` to disable adding the plugin’s default attribution. | `'Geocoding by <a href="https://geocode.earth">Geocode.earth</a>'`
**textStrings** | _Object_. An object of string values that replace text strings in the geocoder control, so you can provide your own custom messages or localization. | See “Custom text strings” section below.
**placeholder** | _String_. Placeholder text to display in the search input box. This is an alias for **`textStrings.INPUT_PLACEHOLDER`**. Set to a blank string or `null` to disable. | `'Search'`
**title** | _Deprecated._ Please use **`textStrings.INPUT_TITLE_ATTRIBUTE** instead. |
**panToPoint** | _Boolean_. If `true`, highlighting a search result pans the map to that location. | `true`
**pointIcon** | _Boolean_ or _String_. If `true`, an icon is used to indicate a point result, matching the "venue" or "address" [layer types]((https://mapzen.com/documentation/search/search/#filter-by-data-type)). If `false`, no icon is displayed. For custom icons, pass a string containing a path to the image. | `true`
**polygonIcon** | _Boolean_ or _String_. If `true`, an icon is used to indicate a polygonal result, matching any non-"venue" or non-"address" [layer type]((https://mapzen.com/documentation/search/search/#filter-by-data-type)). If `false`, no icon is displayed. For custom icons, pass a string containing a path to the image. | `true`
**markers** | _[Leaflet Marker options object](http://leafletjs.com/reference.html#marker-options)_ or _Boolean_. If `true`, search results drops Leaflet's default blue markers onto the map. You may customize this marker's appearance and behavior using Leaflet [marker options](http://leafletjs.com/reference.html#marker-options). | `true`
**overrideBbox** | _Boolean_. Some search results will zoom to a bounding box if it is available, instead of dropping a point marker. If `true`, selecting a result will always drop a point marker regardless of whether bounding box data is present. | `false`
**fullWidth** | _Integer_ or _Boolean_. If `true`, the input box will expand to take up the full width of the map container. If an integer breakpoint is provided, the full width applies only if the map container width is below this breakpoint. | `650`
**expanded** | _Boolean_. If `true`, the search input is always expanded. It does not collapse into a button-only state. | `false`
**autocomplete** | _Boolean_. If `true`, suggested results are fetched on each keystroke. If `false`, this is disabled and users must obtain results by pressing the Enter key after typing in their query. | `true`
**place** | _Boolean_. If `true`, selected results will make a request to the service [`/place` endpoint](https://github.com/pelias/documentation/blob/master/place.md). If `false`, this is disabled. The geocoder does not handle responses to `/place`, you will need to do handle it yourself in the `results` event listener (see below). | `false`

#### Examples

```javascript
// Different position
L.control.geocoder('<your-api-key>', {
  position: 'topright'
}).addTo(map);

// Customizing layer icons
L.control.geocoder('<your-api-key>', {
  pointIcon: 'http://www.somewhereontheweb.com/download/img/point.png',
  polygonIcon: 'https://cloud.com/polygon-icon.svg'
}).addTo(map);

// Disabling layer icons
L.control.geocoder('<your-api-key>', {
  pointIcon: false,
  polygonIcon: false
}).addTo(map);

// Disable zoom/pan to a point while browsing the results (up/down arrows)
L.control.geocoder('<your-api-key>', {
  panToPoint: false
}).addTo(map);

// Set the geocoder to always be the full width of the map
// By default, the geocoder is only full width when the screen is less than 650 pixels wide
L.control.geocoder('<your-api-key>', {
  fullWidth: true
}).addTo(map);

// Disable markers for search results
L.control.geocoder('<your-api-key>', {
  markers: false
}).addTo(map);

// Force the geocoder to always be in the expanded state
L.control.geocoder('<your-api-key>', {
  expanded: true
}).addTo(map);

// Changing attribution
// By default, adds "Geocoding by Mapzen" text with a link
// You can remove this if you like, or change the text.
L.control.geocoder('<your-api-key>', {
  attribution: null
}).addTo(map);
```

### Custom text strings

These are the text strings that are used by the geocoder control. You can override these strings by passing in a `textStrings` options object containing the names of the string(s) you want to customize. You can use this method to localize the controls for a different language, for instance.

#### UI text

string name             | default value
----------------------- | ------------------------------------------------------
`INPUT_PLACEHOLDER`     | 'Search'
`INPUT_TITLE_ATTRIBUTE` | 'Search'
`RESET_TITLE_ATTRIBUTE` | 'Reset'
`NO_RESULTS`            | 'No results were found.'

#### HTTP status code errors

Learn more about possible error messages in [Pelias HTTP status code documentation](https://github.com/pelias/documentation/blob/master/http-status-codes.md). `ERROR_DEFAULT` is a catch-all error that displays when a request returns an error with an unexpected HTTP status code (or none at all) — one example where this can happen is when a browser is prevented from making a request due to a security concern, such as the lack of CORS headers on the search endpoint.

string name      | default value
---------------- | -------------------------------------------------------------
`ERROR_403`      | 'A valid API key is needed for this search feature.'
`ERROR_404`      | 'The search service cannot be found. :-('
`ERROR_408`      | 'The search service took too long to respond. Try again in a second.'
`ERROR_429`      | 'There were too many requests. Try again in a second.'
`ERROR_500`      | 'The search service is not working right now. Please try again later.'
`ERROR_502`      | 'Connection lost. Please try again later.'
`ERROR_DEFAULT`  | 'The search service is having problems :-('

#### Examples

```javascript
// Uses custom text strings to localise the geocoder control.
L.control.geocoder('<your-api-key>', {
  textStrings: {
    INPUT_PLACEHOLDER: '도시, 지명 등을 검색해보세요.',
    INPUT_TITLE_ATTRIBUTE: '도시, 지명 등을 검색해보세요.',
    RESET_TITLE_ATTRIBUTE: '다시 검색하기',
    NO_RESULTS: '해당 결과가 없습니다.',
    ERROR_403: '해당 서비스를 사용하기 위해서는 API KEY가 필요합니다.',
    ERROR_404: '검색 서비스를 찾을 수 없습니다. :-(',
    ERROR_408: '검색에 예상보다 긴 시간이 소요되고 있습니다. 조금 있다가 다시 시도해보는 건 어떨까요?',
    ERROR_429: '지나치게 많은 리퀘스트가 발생했습니다. 조금 있다가 다시 시도해보는 건 어떨까요?',
    ERROR_500: '검색 서비스가 현재 작동하지 않고있습니다. 조금 있다가 다시 시도해보는 건 어떨까요?',
    ERROR_502: '네트워크 상태가 불안정합니다. 조금 있다가 다시 시도해보는 건 어떨까요?',
    ERROR_DEFAULT: '검색 서비스에 문제가 있는 것으로 보입니다. :-('
  }
}).addTo(map);
```

## Advanced usage

Examples with running code can be found in the [examples](https://github.com/mapzen/leaflet-geocoder/tree/master/examples) directory.

### Alternate syntax

You can instantiate a geocoder with the `new` keyword. Notice that the class names are capitalized. This is what actually happens under the hood of `L.control.geocoder()`, so this syntax does not do anything different, but you may prefer it for clarity or stylistic reasons.

```javascript
new L.Control.Geocoder('<your-api-key>').addTo(map);
```

### Scripting with the plugin

When instantiating a geocoder, you may assign it to a variable. This will allow you to use its methods later on.

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

### With alternate `require()` or `import` syntax

If you `require()` or `import` and set it to a variable, you can also use `new` with that variable.

```javascript
var MyGeocoderPlugin = require('pelias-leaflet-plugin');

// Alternatively
import MyGeocoderPlugin from 'pelias-leaflet-plugin';

// Then
var geocoder = new MyGeocoderPlugin('<your-api-key>');
```

### Properties

You can retrieve the current version of the geocoder.

```javascript
console.log(geocoder.version);
```

### Methods

There are additional methods on the geocoder that you can use.

```js
// Expand the geocoder.
// Fires the `expand` event.
geocoder.expand();

// Collapse the geocoder.
// This works even if the option `expanded` is set to true!
// Fires the `collapse` event.
geocoder.collapse();

// Focus on the geocoder input.
// This will also expand the geocoder if it's collapsed.
geocoder.focus();

// Removes focus from the geocoder input.
// This also clears results and collapses the geocoder (if enabled).
geocoder.blur();

// Clears inputs and results from the geocoder control.
// This does not affect collapse or expanded state, and does not remove focus.
// Fires the `reset` event.
geocoder.reset();
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
**focus**     | Fired when the geocoder is focused on the input.
**blur**      | Fired when the geocoder loses focus on the input.

Here is [a demo of the events](http://mapzen.github.io/leaflet-geocoder/examples/events.html).

#### Getting data

Certain events will pass data as the first argument to the event listener's callback function.

#### on `results` or `error`

In addition to the [base event object](http://leafletjs.com/reference.html#event-objects) from Leaflet, the event object will contain these other useful properties:

property        | description
--------------- | -------------------------------------------------------------
**endpoint**    | A string of the Pelias API endpoint that was called.
**requestType** | A string, either `autocomplete`, `search`, or `place`, depending on the request made.
**params**      | An object containing the parameters that have been passed to the Pelias request.
**results**     | The [original response object](https://mapzen.com/documentation/search/response/) returned from Pelias, including all feature geometries and properties.

If there was an error with the request, the event object will contain the additional properties:

property         | description
---------------- | ------------------------------------------------------------
**errorCode**    | The HTTP status code received. [More information](https://mapzen.com/documentation/search/http-status-codes/).
**errorMessage** | The error message string that the geocoder will display.

#### on `select` and `highlight`

property          | description
----------------- | -----------------------------------------------------------
**originalEvent** | The original event object ([`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) or [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)) reported by the browser.
**latlng**        | A [Leaflet LatLng](http://leafletjs.com/reference.html#latlng) object representing the coordinates of the result.
**feature**       | The [GeoJSON feature object](https://mapzen.com/documentation/search/response/#list-of-features-returned) from Pelias, including feature geometry and properties.

#### on `focus` and `blur`

property          | description
----------------- | -----------------------------------------------------------
**originalEvent** | The original [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) event object reported by the browser.

### Browser support

This plugin supports all Leaflet-supported browsers _except_ for Internet Explorer 7. It makes a cross-domain request in Javascript to obtain search results, which is not supported in IE7 without JSONP. Pelias [does not support API requests in JSONP](https://mapzen.com/documentation/search/use-cors/#why-not-jsonp).

### Accessing other plugin internals

Properties and methods used internally by the geocoder are also available on the returned object. These are purposefully not private or obscured, but they are also not publicly documented right now, since functionality may fluctuate without notice. Depending on usage and demand we will lock down and document internal properties and methods for general use. [Please let us know in the issues tracker](https://github.com/mapzen/leaflet-geocoder/issues) if you have feedback.

### Do you support TypeScript?

Not officially. There are [community-supplied type definitions at DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/leaflet-geocoder-mapzen).

## Projects using this plugin

- [Map My Story](http://www.mapmystory.xyz/)
- [Greenpoint-Williamsburg ToxiCity Map](http://clhenrick.github.io/greenpoint_williamsburg_toxicity_map/)
- [what3emojis](http://what3emojis.com/map/)
- [NYC Community Boards](http://louhuang.com/nyc-community-boards)
- [Wantoid](https://wantoid.com/search/map)

Let us know if you have a project you'd like to share!
