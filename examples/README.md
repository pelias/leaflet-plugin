Examples
========

## Demos

- **Basic usage**.
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/index.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/index.html)]
  The minimum amount of code needed to get started. There is also a beginner-friendly [tutorial](https://mapzen.com/documentation/search/add-search-to-a-map/) that walks through how this is put together.

- **Basic usage with Leaflet v1.**
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/leaflet-v1.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/leaflet-v1.html)]

### Customizing the geocoder

- **Restricting the search boundary to the current viewport.**
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/bounds.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/bounds.html)]

- **Only coarse geocoding.**
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/coarse.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/coarse.html)]
  [[documentation](https://mapzen.com/documentation/search/search/#filter-by-data-type)]

- **Changing what corner the geocoder is positioned in.**
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/position.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/position.html)]

- **Events.**
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/events.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/events.html)]
  This demo shows when the geocoder fires events. Look at the code to see examples of how you can write scripts that react to these events.

### Use with other libraries

- **Using the geocoder with [Tangram](https://mapzen.com/projects/tangram/).**
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/tangram.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/tangram.html)]
  This demo uses the [Cinnabar (more labels) style](https://github.com/tangrams/cinnabar-style-more-labels).

- **Using the geocoder with [Mapbox.js](https://www.mapbox.com/mapbox.js/api/v2.2.3/).**
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/mapboxjs.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/mapboxjs.html)]
  Includes a snippet of CSS to make the geocoder look like mapbox.js styles!

### Advanced customization

These demos show how you can extend the geocoder with functionality not built into the library.

- **Changing the search icon image.**
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/search-icon-active-state.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/search-icon-active-state.html)]
  You can override the CSS to replace the search icon image. This demo changes the magnifying glass to a blue version when the geocoder is expanded.

- **Placing two geocoders on a map at the same time.**
  [[demo](https://mapzen.github.io/leaflet-geocoder/examples/two-geocoders.html)]
  [[code](https://github.com/mapzen/leaflet-geocoder/blob/master/examples/two-geocoders.html)]
  You can place any number of geocoders on a map. One use case for having two geocoders is to be able to route between two points. This demo shows how some code is needed to make the results list on the first geocoder show up correctly on top of the second geocoder.

## Code snippets

Examples that can be expressed with code snippets or need more explanation are placed here.

### Put the geocoder control above the zoom control

You might want the geocoder control to be placed above the zoom control, especially if you have a geocoder control that is permanently expanded.

Leaflet will insert controls in the order that they are initialized in. The geocoder control will usually appear after the zoom control because the zoom control is created first (by default) and then you add the geocoder later. You can reverse this order in two ways.

The first way is that you can initialize a map with the option `zoomControl: false` so that a zoom control is not created by default. Add the geocoder to the map, then create a zoom control with Leaflet and add it to the map afterwards.

```js
// Initialize a map with zoom control disabled by default
var map = L.map('map', { zoomControl: false });

// Add your geocoder control
L.control.geocoder('<your-api-key>').addTo(map);

// Add zoom control back
L.control.zoom().addTo(map);
```

Alternatively you can add a map as normal and use JavaScript to re-order your DOM elements.

```js
// Initialize a map with zoom control disabled by default
var map = L.map('map');

// Add your geocoder control
var geocoder = new L.Control.Geocoder('<your-api-key>').addTo(map);

// Re-sort control order so that geocoder is on top
// geocoder._container is a reference to the geocoder's DOM element.
geocoder._container.parentNode.insertBefore(geocoder._container, geocoder._container.parentNode.childNodes[0]);
```
