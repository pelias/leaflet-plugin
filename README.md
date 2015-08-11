Leaflet geocoder plugin
========================

A plugin that adds the ability to search (geocode) a leaflet powered map using the [Pelias Geocoder API](https://github.com/pelias/api).

# :rotating_light: **Active development warning** :rotating_light:
The Pelias API is in active development and has not been locked in yet. Endpoints and response payloads are subject to change without much warning. Please keep this in mind if you use this plugin for your projects.

## Requirements

Works well with ```leaflet-0.7.3```, ```leaflet-0.8-dev```.

Should work with the latest version of leaflet as well. If not, please log an issue

## Demo

[Click here](http://pelias.github.io/leaflet-geocoder/)

## Usage

**Step 1**: Import the required leaflet javascript and css files

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css" />
<link rel="stylesheet" href="//rawgit.com/pelias/leaflet-geocoder/master/pelias-leaflet-geocoder.css" />
<script src="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js"></script>
<script src="//rawgit.com/pelias/leaflet-geocoder/master/pelias-leaflet-geocoder.js"></script>

```

**Step 2**: Initialize your leaflet map

```javascript
var map = L.map('map').setView([40.7259, -73.9805], 12);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

```

**Step 3**: Add a custom geocoder

```javascript

// Minimal
L.control.geocoder().addTo(map);

// Searching nearby [50.5, 30.5]
L.control.geocoder({
  latlon:[50.5, 30.5], // this can also written as {lat:50.5,lon:30.5} or L.latLng(50.5, 30.5)
  placeholder: 'Search nearby [50.5, 30.5]'
}).addTo(map);

// Taking just the center of the map (lat/lon) into account
L.control.geocoder({
  latlon:true,
  placeholder: 'Search nearby (from the center/latlon)'
}).addTo(map);

// Searching within a bounding box
var southWest = L.latLng(40.712, -74.227),
    northEast = L.latLng(40.774, -74.125),
    bounds = L.latLngBounds(southWest, northEast);

L.control.geocoder({
  bbox:bounds,
  placeholder: 'Search within ' + bounds.toBBoxString() //given bbox
}).addTo(map);

// Taking just the bounding box of the map view into account
L.control.geocoder({
  bbox:true,
  placeholder: 'Search within the bounds' //map\'s view/bbox
}).addTo(map);

// Coarse Geocoder: search only admin layers
L.control.geocoder({
  layers: 'admin',
  placeholder: 'Coarse Geocoder'
}).addTo(map);

// Address Geocoder: search only (street) address layers
L.control.geocoder({
  layers: 'address',
  placeholder: 'Address Geocoder'
}).addTo(map);

// POI Geocoder: search only points of interests
L.control.geocoder({
  layers: 'poi',
  placeholder: 'POI Geocoder'
}).addTo(map);

// Street level Geocoder: search only poi and street addresses
L.control.geocoder({
  layers: 'poi,address',
  placeholder: 'Street Geocoder'
}).addTo(map);

// Customizing icons
L.control.geocoder({
  point_icon: 'http://www.somewhereontheweb.com/download/img/point.png',
  polygon_icon: 'https://cloud.com/polygon_icon.svg'
}).addTo(map);

// Configure if you want to zoom/pan to a point while browsing the results (up/down arrows)
// pan_to_point set to true (by default)
// as per https://github.com/pelias/leaflet-geocoder/issues/6
L.control.geocoder({
  pan_to_point: true
}).addTo(map);

// Setting full width on the search text box
// by default: true - on mobile/ any viewport of 650px and less
// if viewport wider than 650px, its set to false
// and width is defined in the CSS (250px)
// as per https://github.com/pelias/leaflet-geocoder/issues/7
L.control.geocoder({
    full_width: true
}).addTo(map);

// Configure if you want to drop a pin for a search results or not
// by default - this is set to true
// as per https://github.com/pelias/leaflet-geocoder/issues/7
L.control.geocoder({
    drop_pin: false
}).addTo(map);

// Ability to collapse to a button instead of a expanded text box
// by default - this is set to true
// by default - the text box shows up instead of the button
// as per https://github.com/pelias/leaflet-geocoder/issues/7
L.control.geocoder({
    expanded: false
}).addTo(map);

```

**Step 4**: Rejoice!
