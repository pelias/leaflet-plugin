Leaflet geocoder plugin
========================

A plugin that adds the ability to search (geocode) a leaflet powered map using the [Pelias Geocoder API](https://github.com/pelias/api).

# :rotating_light: **Active development warning** :rotating_light:
The Pelias API is in active development and has not been locked in yet. Endpoints and response payloads are subject to change without much warning. Please keep this in mind if you use this plugin for your projects.

## Requirements

Supports [Leaflet](https://github.com/Leaflet/Leaflet) **v0.7.3** and **v1.0.0-beta.1**. (Previous Leaflet versions may work, but we don't test them explicitly.)

## Demo

[Click here](http://pelias.github.io/leaflet-geocoder/)

## Basic usage

**Step 1:** Import the required Leaflet javascript and css files

```html
<!-- Load Leaflet from CDN -->
<link rel="stylesheet" href="//cdn.leafletjs.com/leaflet-0.7.3/leaflet.css">
<script src="//cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>

<!-- Load Pelias geocoding plugin after Leaflet -->
<link rel="stylesheet" href="pelias-leaflet-geocoder.css">
<script src="pelias-leaflet-geocoder.js"></script>
```

**Step 2:** Initialize your Leaflet map

```javascript
// This is regular Leaflet; you should modify this for your needs.
var map = L.map('map').setView([40.7259, -73.9805], 12);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```

**Step 3:** Add a custom geocoder

Get a Pelias API key from the [Mapzen developers portal](http://mapzen.com/developers/). It's free!

```javascript
L.control.geocoder('<your-api-key>').addTo(map);
```

**Step 4**: Rejoice!


## Customizing the plugin

You can optionally specify additional settings to the plugin by passing in an object as a second argument to the `geocoder()` method. Here are a list all the valid settings and their default values.

### Query behavior

Some options affect the Pelias query itself.

option      | description                               | default value
----------- | ----------------------------------------- | ---------------------
**bbox** | _[Leaflet LatLngBounds object](http://leafletjs.com/reference.html#latlngbounds)_ or _Boolean_. If `true`, search is bounded by the current map view. You may also provide a custom bounding box in form of a LatLngBounds object. | `false`
**latlon** | _[Leaflet LatLng object](http://leafletjs.com/reference.html#latlng)_ or _Boolean_. If `true`, search is biased to prioritize results near the center of the current view. You may also provide a custom LatLng value (in any of the [accepted Leaflet formats](http://leafletjs.com/reference.html#latlng)) to act as the center bias. | `false`
**layers** | _String_ or _Array_. Layers to query. | `['poi', 'admin', 'address']`

### Interaction behavior

These options affect the plugin's appearance and interaction behavior.

option      | description                               | default value
----------- | ----------------------------------------- | ---------------------
**position** | _String_. Corner in which to place the geocoder control. Values correspond to Leaflet.js [control positions](http://leafletjs.com/reference.html#control-positions) | `'topleft'`
**attribution** | _String_. Attribution text to include for Pelias. | `'Geocoding by <a href=\'https://mapzen.com/pelias\'>Pelias</a>'`
**url** | _String._ Host endpoint for a Pelias-compatible API. | `'//pelias.mapzen.com'`
**placeholder** | _String_. Placeholder text to display in the search input box. | `'Search'`
**title** | _String_. Tooltip text to display on the search icon. | `'Search'`
**panToPoint** | _Boolean_. If `true`, selecting a search result pans the map to that location. | `true`
**pointIcon** | _String_. Path to the image used to indicate a point result. | `'img/point_icon.png'`
**polygonIcon** | _String_. Path to the image used to indicate a polygon result. | `'img/polygon_icon.png'`
**markers** | _[Leaflet Marker options object](http://leafletjs.com/reference.html#marker-options)_ or _Boolean_. If `true`, search results drops Leaflet's default blue markers onto the map. You may customize this marker's appearance and behavior using Leaflet [marker options](http://leafletjs.com/reference.html#marker-options). | `true`
**expanded** | _Boolean_. If `true`, the search input is always expanded. It does not collapse into a button-only state. | `false`

### Examples

```javascript
// Different position
L.control.geocoder('<your-api-key>', {
  position: 'topright'
}).addTo(map);

// Searching nearby [50.5, 30.5]
L.control.geocoder('<your-api-key>', {
  latlon: [50.5, 30.5], // this can also written as {lat:50.5,lon:30.5} or L.latLng(50.5, 30.5)
  placeholder: 'Search nearby [50.5, 30.5]'
}).addTo(map);

// Taking just the center of the map (lat/lon) into account
L.control.geocoder('<your-api-key>', {
  latlon: true,
  placeholder: 'Search nearby (from the center/latlon)'
}).addTo(map);

// Searching within a bounding box
var southWest = L.latLng(40.712, -74.227);
var northEast = L.latLng(40.774, -74.125);
var bounds = L.latLngBounds(southWest, northEast);

L.control.geocoder('<your-api-key>', {
  bbox: bounds,
  placeholder: 'Search within ' + bounds.toBBoxString() //given bbox
}).addTo(map);

// Taking just the bounding box of the map view into account
L.control.geocoder('<your-api-key>', {
  bbox: true,
  placeholder: 'Search within the bounds' //map\'s view/bbox
}).addTo(map);

// Coarse Geocoder: search only admin layers
L.control.geocoder('<your-api-key>', {
  layers: 'admin',
  placeholder: 'Coarse Geocoder'
}).addTo(map);

// Address Geocoder: search only (street) address layers
L.control.geocoder('<your-api-key>', {
  layers: 'address',
  placeholder: 'Address Geocoder'
}).addTo(map);

// POI Geocoder: search only points of interests
L.control.geocoder('<your-api-key>', {
  layers: 'poi',
  placeholder: 'POI Geocoder'
}).addTo(map);

// Street level Geocoder: search only poi and street addresses
L.control.geocoder('<your-api-key>', {
  layers: 'poi,address',
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
// by default: true - on mobile/ any viewport of 650px and less
// if viewport wider than 650px, its set to false
// and width is defined in the CSS (250px)
// as per https://github.com/pelias/leaflet-geocoder/issues/7
L.control.geocoder('<your-api-key>', {
    fullWidth: true
}).addTo(map);

// Configure if you want to drop a pin for a search results or not
// by default - this is set to true
// as per https://github.com/pelias/leaflet-geocoder/issues/7
L.control.geocoder('<your-api-key>', {
    dropPin: false
}).addTo(map);

// Ability to collapse to a button instead of a expanded text box
// by default - this is set to true
// by default - the text box shows up instead of the button
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
