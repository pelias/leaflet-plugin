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

**Step 3**: Add geocoder powered by pelias!

```javascript

// Minimal
L.control.geocoder().addTo(map);

// Taking just the center of the map (lat/lon) into account
L.control.geocoder({latlon:true, placeholder: 'Search (from the center/latlon)'}).addTo(map);

// Taking just the bounding box of the map view into account
L.control.geocoder({bbox:true, placeholder: 'Search (within map\'s view/bbox)'}).addTo(map);

```

## Options

Coming soon...