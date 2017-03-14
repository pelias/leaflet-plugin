/*
 * leaflet-geocoder-mapzen
 * Leaflet plugin to search (geocode) using Mapzen Search or your
 * own hosted version of the Pelias Geocoder API.
 *
 * License: MIT
 * (c) Mapzen
 */
;(function (root, factory) { // eslint-disable-line no-extra-semi
  var L;
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['leaflet'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    L = require('leaflet');
    module.exports = factory(L);
  } else {
    // Browser globals (root is window)
    if (typeof root.L === 'undefined') {
      throw new Error('Leaflet must be loaded first');
    }
    root.Geocoder = factory(root.L);
  }
}(this, function (L) {
  'use strict';

  var Geocoder = require('./core');

  // Automatically attach to Leaflet's `L` namespace.
  L.Control.Geocoder = Geocoder;

  L.control.geocoder = function (apiKey, options) {
    return new L.Control.Geocoder(apiKey, options);
  };

  // Return value defines this module's export value.
  return Geocoder;
}));
