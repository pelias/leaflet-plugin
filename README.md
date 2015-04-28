# Leaflet geocoder plugin

A plugin that adds the ability to search (geocode) a leaflet powered map.

## Requirements

Works well with ```leaflet-0.7.3```. Should work with the latest version of leaflet as well. If not, please log an issue

## Demo

[Click here](http://pelias.github.io/leaflet-geocoder/)

## Usage

**Step 1**: Import the required leaflet javascript and css files

```html
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
<link rel="stylesheet" href="http://rawgit.com/pelias/leaflet-geocoder/master/pelias-leaflet-geocoder.css" />
<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet-src.js"></script>
<script src="http://rawgit.com/pelias/leaflet-geocoder/master/pelias-leaflet-geocoder.js"></script>

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

```

**Step 4**: Rejoice! 

