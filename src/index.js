/*
 * leaflet-geocoder-mapzen
 * Leaflet plugin to search (geocode) using Mapzen Search or your
 * own hosted version of the Pelias Geocoder API.
 *
 * License: MIT
 * (c) Mapzen
 */
;(function (factory) { // eslint-disable-line no-extra-semi
  var L;
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['leaflet'], factory);
  } else if (typeof module !== 'undefined') {
    // Node/CommonJS
    L = require('leaflet');
    module.exports = factory(L);
  } else {
    // Browser globals
    if (typeof window.L === 'undefined') {
      throw new Error('Leaflet must be loaded first');
    }
    factory(window.L);
  }
}(function (L) {
  'use strict';

  var Geocoder = require('./core');

  // Automatically attach to Leaflet's `L` namespace.
  L.Control.Geocoder = Geocoder;

  L.control.geocoder = function (apiKey, options) {
    return new L.Control.Geocoder(apiKey, options);
  };

  // Also, can be exported as a variable.
  module.exports = Geocoder;
}));
