# Examples

## Put the geocoder control above the zoom control

You might want the geocoder control to be placed above the zoom control, especially if you have a geocoder control that is permanently expanded.

Leaflet will insert controls in the order that they are initialized in. The geocoder control will usually appear after the zoom control because the zoom control is created first (by default) and then you add the geocoder later. You can reverse this order in two ways.

The first way is that you can initialize a map with the option `zoomControl: false` so that a zoom control is not created by default. Add the geocoder to the map, then create a zoom control with Leaflet and add it to the map afterwards.

```js
// Initialize a map with zoom control disabled by default
var map = L.map('map', { zoomControl: false });

// Add your geocoder control
L.control.geocoder('<pelias-api-key>').addTo(map);

// Add zoom control back
L.control.zoom().addTo(map);
```

Alternatively you can add a map as normal and use JavaScript to re-order your DOM elements.

```js
// Initialize a map with zoom control disabled by default
var map = L.map('map');

// Add your geocoder control
var geocoder = new L.Control.Geocoder('<pelias-api-key>').addTo(map);

// Re-sort control order so that geocoder is on top
// geocoder._container is a reference to the geocoder's DOM element.
geocoder._container.parentNode.insertBefore(geocoder._container, geocoder._container.parentNode.childNodes[0]);
```

## Using geocoder plugin with mapbox.js

You may choose to use the Pelias plugin with [Mapbox.js](https://www.mapbox.com/mapbox.js/). It is based on Leaflet, so the plugin works well with it too. The only difference is that Mapbox.js provides slightly different styling. By adding this custom CSS snippet you can make the Pelias plugin match Mapbox.js styling.

```css
.leaflet-pelias-control:not(.leaflet-pelias-expanded),
.leaflet-touch .leaflet-pelias-control:not(.leaflet-pelias-expanded) {
  width: 28px;
  height: 28px;
}
```

This was tested on Mapbox.js v2.2.2.
