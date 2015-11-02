/*
 * This adds a geocoder powered by pelias to a leaflet map
 * TODO: Better comments
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

  var MINIMUM_INPUT_LENGTH_FOR_AUTOCOMPLETE = 1;
  var FULL_WIDTH_MARGIN = 20; // in pixels
  var FULL_WIDTH_TOUCH_ADJUSTED_MARGIN = 4; // in pixels
  var RESULTS_HEIGHT_MARGIN = 20; // in pixels
  var API_RATE_LIMIT = 250; // in ms, throttled time between subsequent requests to API

  L.Control.Geocoder = L.Control.extend({
    options: {
      position: 'topleft',
      attribution: 'Geocoding by <a href=\'https://mapzen.com/pelias\'>Pelias</a>',
      url: 'https://search.mapzen.com/v1',
      placeholder: 'Search',
      title: 'Search',
      bounds: false,
      latlng: null,
      layers: null,
      panToPoint: true,
      pointIcon: 'images/point_icon.png',
      polygonIcon: 'images/polygon_icon.png',
      fullWidth: 650,
      markers: true,
      expanded: false,
      autocomplete: true
    },

    initialize: function (apiKey, options) {
      // For IE8 compatibility (if XDomainRequest is present),
      // we set the default value of options.url to the protocol-relative
      // version, because XDomainRequest does not allow http-to-https requests
      // This is set first so it can always be overridden by the user
      if (window.XDomainRequest) {
        this.options.url = '//search.mapzen.com/v1';
      }

      // Now merge user-specified options
      L.Util.setOptions(this, options);
      this.apiKey = apiKey;
      this.marker;
      this.markers = [];
    },

    getLayers: function (params) {
      var layers = this.options.layers;

      if (!layers) {
        return params;
      }

      params.layers = layers;
      return params;
    },

    getBoundingBoxParam: function (params) {
      var bounds = this.options.bounds;

      if (!bounds) {
        return params;
      }

      if ((typeof bounds !== 'object') || !bounds.isValid()) {
        bounds = this._map.getBounds();
      }

      params['boundary.rect.min_lon'] = bounds.getWest();
      params['boundary.rect.min_lat'] = bounds.getSouth();
      params['boundary.rect.max_lon'] = bounds.getEast();
      params['boundary.rect.max_lat'] = bounds.getNorth();

      return params;
    },

    getLatlngParam: function (params) {
      /*
       * this.options.latlng can be one of the following
       * [50, 30] //Array
       * {lon: 30, lat: 50} //Object
       * {lat: 50, lng: 30} //Object
       * L.latLng(50, 30) //Object
       * true //Boolean - take the map center
       * false //Boolean - No latlng to be considered
      */
      var latlng = this.options.latlng;

      if (!latlng) {
        return params;
      }

      if (latlng.constructor === Array) {
        // TODO Check for array size, throw errors if invalid lat/lon
        params['focus.point.lat'] = latlng[0];
        params['focus.point.lon'] = latlng[1];
      } else if (typeof latlng !== 'object') {
        // fallback to the map's center L.latLng()
        latlng = this._map.getCenter();
        params['focus.point.lat'] = latlng.lat;
        params['focus.point.lon'] = latlng.lng;
      } else {
        // TODO Check for valid L.LatLng Object or Object thats in the form of {lat:..,lon:..}
        // TODO Check for valid lat/lon values, Error handling
        params['focus.point.lat'] = latlng.lat;
        params['focus.point.lon'] = latlng.lng ? latlng.lng : latlng.lon;
      }

      return params;
    },

    search: function (input) {
      // Prevent lack of input from sending a malformed query to Pelias
      if (!input) return;

      var url = this.options.url + '/search';
      var params = {
        text: input
      };

      this.callPelias(url, params);
    },

    autocomplete: throttle(function (input) {
      // Prevent lack of input from sending a malformed query to Pelias
      if (!input) return;

      var url = this.options.url + '/autocomplete';
      var params = {
        text: input
      };

      this.callPelias(url, params);
    }, API_RATE_LIMIT),

    // Timestamp of the last response which was successfully rendered to the UI.
    // The time represents when the request was *sent*, not when it was recieved.
    maxReqTimestampRendered: new Date().getTime(),

    callPelias: function (endpoint, params) {
      params = this.getBoundingBoxParam(params);
      params = this.getLatlngParam(params);
      params = this.getLayers(params);

      // Search API key
      if (this.apiKey) {
        params.api_key = this.apiKey;
      }

      L.DomUtil.addClass(this._search, 'leaflet-pelias-loading');

      // Track when the request began
      var reqStartedAt = new Date().getTime();

      AJAX.request(endpoint, params, function (err, results) {
        L.DomUtil.removeClass(this._search, 'leaflet-pelias-loading');

        if (err) {
          switch (err.code) {
            case 429:
              this.showMessage('There were too many requests. Try again in a second.');
              break;
            case 403:
              this.showMessage('A valid API key is needed for this search feature.');
              break;
            case 500:
              this.showMessage('The search service is not working right now. Please try again later.');
              break;
            // Note the status code is 0 if CORS is not enabled on the error response
            default:
              this.showMessage('The search service is having problems :-(');
              break;
          }
        }

        if (results && results.features) {
          // Ignore requests that started before a request which has already
          // been successfully rendered on to the UI.
          if (this.maxReqTimestampRendered < reqStartedAt) {
            this.maxReqTimestampRendered = reqStartedAt;
            this.showResults(results.features);
          }
          // Else ignore the request, it is stale.
        }
      }, this);
    },

    highlight: function (text, focus) {
      var r = RegExp('(' + escapeRegExp(focus) + ')', 'gi');
      return text.replace(r, '<strong>$1</strong>');
    },

    getIconType: function (layer) {
      var pointIcon = this.options.pointIcon;
      var polygonIcon = this.options.polygonIcon;

      if (layer.match('venue') || layer.match('address')) {
        return pointIcon;
      } else {
        return polygonIcon;
      }
    },

    showResults: function (features) {
      // Exit function if there are no features
      if (features.length === 0) {
        this.showMessage('No results were found.');
        return;
      }

      var list;
      var resultsContainer = this._results;

      // Reset and display results container
      resultsContainer.innerHTML = '';
      resultsContainer.style.display = 'block';
      // manage result box height
      resultsContainer.style.maxHeight = (this._map.getSize().y - resultsContainer.offsetTop - this._container.offsetTop - RESULTS_HEIGHT_MARGIN) + 'px';

      if (!list) {
        list = L.DomUtil.create('ul', 'leaflet-pelias-list', resultsContainer);
      }

      for (var i = 0, j = features.length; i < j; i++) {
        var feature = features[i];
        var resultItem = L.DomUtil.create('li', 'leaflet-pelias-result', list);

        resultItem.layer = feature.properties.layer;
        resultItem.coords = feature.geometry.coordinates;

        var iconSrc = this.getIconType(feature.properties.layer);
        if (iconSrc) {
          // Point or polygon icon
          var layerIconContainer = L.DomUtil.create('span', 'leaflet-pelias-layer-icon-container', resultItem);
          var layerIcon = L.DomUtil.create('img', 'leaflet-pelias-layer-icon', layerIconContainer);
          layerIcon.src = iconSrc;
          layerIcon.title = 'layer: ' + feature.properties.layer;
        }

        if (this._input.value.length > 0) {
          resultItem.innerHTML += this.highlight(feature.properties.label, this._input.value);
        }
      }
    },

    showMessage: function (text) {
      var resultsContainer = this._results;

      // Reset and display results container
      resultsContainer.innerHTML = '';
      resultsContainer.style.display = 'block';

      var messageEl = L.DomUtil.create('div', 'leaflet-pelias-message', resultsContainer);
      messageEl.textContent = text;
    },

    removeMarkers: function () {
      if (this.options.markers) {
        for (var i = 0; i < this.markers.length; i++) {
          this._map.removeLayer(this.markers[i]);
        }
        this.markers = [];
      }
    },

    showMarker: function (text, coords) {
      this.removeMarkers();

      var geo = [coords[1], coords[0]];
      this._map.setView(geo, this._map.getZoom() || 8);

      var markerOptions = (typeof this.options.markers === 'object') ? this.options.markers : {};

      if (this.options.markers) {
        this.marker = new L.marker(geo, markerOptions).bindPopup(text); // eslint-disable-line new-cap
        this._map.addLayer(this.marker);
        this.markers.push(this.marker);
        this.marker.openPopup();
      }
    },

    setSelectedResult: function () {
      var selected = this._results.querySelectorAll('.leaflet-pelias-selected')[0];

      if (selected) {
        this._input.value = selected.innerText || selected.textContent;
      }
    },

    resetInput: function () {
      this._input.value = '';
      L.DomUtil.addClass(this._close, 'leaflet-pelias-hidden');
      this.removeMarkers();
      this._input.focus();
    },

    // TODO: Rename?
    clear: function () {
      this.clearResults();
      this._input.blur();
      if (this._input.value === '' && this._results.style.display !== 'none') {
        L.DomUtil.addClass(this._close, 'leaflet-pelias-hidden');
        this.collapse();
      }
    },

    clearResults: function () {
      // Hide results from view
      this._results.style.display = 'none';

      // Destroy contents if input has also cleared
      if (this._input.value === '') {
        this._results.innerHTML = '';
      }
    },

    expand: function () {
      L.DomUtil.addClass(this._container, 'leaflet-pelias-expanded');
      this.setFullWidth();
    },

    collapse: function () {
      // Does not collapse if search bar is always expanded
      if (this.options.expanded) {
        return;
      }

      L.DomUtil.removeClass(this._container, 'leaflet-pelias-expanded');
      this.clearFullWidth();
      this.clearResults();
    },

    // Set full width of expanded input, if enabled
    setFullWidth: function () {
      if (this.options.fullWidth) {
        // If fullWidth setting is a number, only expand if map container
        // is smaller than that breakpoint. Otherwise, clear width
        // Always ask map to invalidate and recalculate size first
        this._map.invalidateSize();
        var mapWidth = this._map.getSize().x;
        var touchAdjustment = L.DomUtil.hasClass(this._map._container, 'leaflet-touch');
        var width = mapWidth - FULL_WIDTH_MARGIN - (touchAdjustment ? FULL_WIDTH_TOUCH_ADJUSTED_MARGIN : 0);
        if (typeof this.options.fullWidth === 'number' && mapWidth >= window.parseInt(this.options.fullWidth, 10)) {
          this.clearFullWidth();
          return;
        }
        this._container.style.width = width.toString() + 'px';
      }
    },

    clearFullWidth: function () {
      // Clear set width, if any
      if (this.options.fullWidth) {
        this._container.style.width = '';
      }
    },

    onAdd: function (map) {
      var container = L.DomUtil.create('div',
          'leaflet-pelias-control leaflet-bar leaflet-control');

      this._body = document.body || document.getElementsByTagName('body')[0];
      this._container = container;
      this._input = L.DomUtil.create('input', 'leaflet-pelias-input', this._container);
      this._input.spellcheck = false;

      // Only set if title option is not null or falsy
      if (this.options.title) {
        this._input.title = this.options.title;
      }

      // Only set if placeholder option is not null or falsy
      if (this.options.placeholder) {
        this._input.placeholder = this.options.placeholder;
      }

      this._search = L.DomUtil.create('a', 'leaflet-pelias-search-icon', this._container);
      this._close = L.DomUtil.create('div', 'leaflet-pelias-close leaflet-pelias-hidden', this._container);
      this._close.innerHTML = '×';
      this._close.title = 'Close';

      this._results = L.DomUtil.create('div', 'leaflet-pelias-results leaflet-bar', this._container);

      if (this.options.expanded) {
        this.expand();
      }

      L.DomEvent
        .on(this._container, 'click', function (e) {
          // Other listeners should call stopProgation() to
          // prevent this from firing too greedily
          this._input.focus();
        }, this)
        .on(this._input, 'focus', function (e) {
          if (this._input.value) {
            this._results.style.display = 'block';
          }
        }, this)
        .on(this._map, 'click', function (e) {
          // Does what you might expect a _input.blur() listener might do,
          // but since that would fire for any reason (e.g. clicking a result)
          // what you really want is to blur from the control by listening to clicks on the map
          this.clear();
        }, this)
        .on(this._search, 'click', function (e) {
          L.DomEvent.stopPropagation(e);

          // If expanded option is true, just focus the input
          if (this.options.expanded === true) {
            this._input.focus();
            return;
          }

          // Toggles expanded state of container on click of search icon
          if (L.DomUtil.hasClass(this._container, 'leaflet-pelias-expanded')) {
            L.DomUtil.addClass(this._close, 'leaflet-pelias-hidden');
            this.collapse();
            this._input.blur();
          } else {
            if (this._input.value.length > 0) {
              L.DomUtil.removeClass(this._close, 'leaflet-pelias-hidden');
            }
            this.expand();
            this._input.focus();
          }
        }, this)
        .on(this._close, 'click', function (e) {
          this.resetInput();
          this.clearResults();
          L.DomEvent.stopPropagation(e);
        }, this)
        .on(this._input, 'keydown', function (e) {
          var list = this._results.querySelectorAll('.leaflet-pelias-result');
          var selected = this._results.querySelectorAll('.leaflet-pelias-selected')[0];
          var selectedPosition;
          var self = this;
          var panToPoint = function (shouldPan) {
            var _selected = self._results.querySelectorAll('.leaflet-pelias-selected')[0];
            if (_selected && shouldPan) {
              self.showMarker(_selected.innerHTML, _selected['coords']);
            }
          };

          for (var i = 0; i < list.length; i++) {
            if (list[i] === selected) {
              selectedPosition = i;
              break;
            }
          }

          // TODO cleanup
          switch (e.keyCode) {
            // 13 = enter
            case 13:
              if (selected) {
                this.setSelectedResult();
                this.showMarker(selected.innerHTML, selected['coords']);
                this.clear();
              } else {
                // perform a full text search on enter
                var text = (e.target || e.srcElement).value;
                this.search(text);
              }
              L.DomEvent.preventDefault(e);
              break;
            // 38 = up arrow
            case 38:
              // Ignore key if there are no results or if list is not visible
              if (!list || this._results.style.display === 'none') {
                return;
              }

              if (selected) {
                L.DomUtil.removeClass(selected, 'leaflet-pelias-selected');
              }

              var previousItem = list[selectedPosition - 1];

              if (selected && previousItem) {
                L.DomUtil.addClass(previousItem, 'leaflet-pelias-selected');
              } else {
                L.DomUtil.addClass(list[list.length - 1], 'leaflet-pelias-selected');
              }

              panToPoint(this.options.panToPoint);

              L.DomEvent.preventDefault(e);
              break;
            // 40 = down arrow
            case 40:
              // Ignore key if there are no results or if list is not visible
              if (!list || this._results.style.display === 'none') {
                return;
              }

              if (selected) {
                L.DomUtil.removeClass(selected, 'leaflet-pelias-selected');
              }

              var nextItem = list[selectedPosition + 1];

              if (selected && nextItem) {
                L.DomUtil.addClass(nextItem, 'leaflet-pelias-selected');
              } else {
                L.DomUtil.addClass(list[0], 'leaflet-pelias-selected');
              }

              panToPoint(this.options.panToPoint);

              L.DomEvent.preventDefault(e);
              break;
            // all other keys
            default:
              break;
          }
        }, this)
        .on(this._input, 'keyup', function (e) {
          var key = e.which || e.keyCode;
          var text = (e.target || e.srcElement).value;

          if (this._input.value.length > 0) {
            L.DomUtil.removeClass(this._close, 'leaflet-pelias-hidden');
          } else {
            L.DomUtil.addClass(this._close, 'leaflet-pelias-hidden');
          }

          // Ignore all further action if the keycode matches an arrow
          // key (handled via keydown event)
          if (key === 13 || key === 38 || key === 40) {
            return;
          }

          // keyCode 27 = esc key (esc should clear results)
          if (key === 27) {
            // If input is blank or results have already been cleared
            // (perhaps due to a previous 'esc') then pressing esc at
            // this point will blur from input as well.
            if (text.length === 0 || this._results.style.display === 'none') {
              this._input.blur();

              if (L.DomUtil.hasClass(this._container, 'leaflet-pelias-expanded')) {
                this.collapse();
                this.clearResults();
              }
            }
            // Clears results
            this._results.innerHTML = '';
            this._results.style.display = 'none';
            L.DomUtil.removeClass(this._search, 'leaflet-pelias-loading');
            return;
          }

          if (this._input.value !== this._lastValue) {
            this._lastValue = this._input.value;

            if (text.length >= MINIMUM_INPUT_LENGTH_FOR_AUTOCOMPLETE && this.options.autocomplete === true) {
              this.autocomplete(text);
            } else {
              this.clearResults();
            }
          }
        }, this)
        .on(this._results, 'click', function (e) {
          L.DomEvent.preventDefault(e);
          L.DomEvent.stopPropagation(e);

          var _selected = this._results.querySelectorAll('.leaflet-pelias-selected')[0];
          if (_selected) {
            L.DomUtil.removeClass(_selected, 'leaflet-pelias-selected');
          }

          var selected = e.target || e.srcElement; /* IE8 */
          var findParent = function () {
            if (!L.DomUtil.hasClass(selected, 'leaflet-pelias-result')) {
              selected = selected.parentElement;
              if (selected) {
                findParent();
              }
            }
            return selected;
          };

          // click event can be registered on the child nodes
          // that does not have the required coords prop
          // so its important to find the parent.
          findParent();

          // If nothing is selected, (e.g. it's a message, not a result),
          // do nothing.
          if (selected) {
            L.DomUtil.addClass(selected, 'leaflet-pelias-selected');
            this.setSelectedResult();
            this.showMarker(selected.innerHTML, selected['coords']);
            this.clear();
          }
        }, this)
        .on(this._results, 'mouseover', function (e) {
          if (map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom) {
            map.scrollWheelZoom.disable();
          }
        })
        .on(this._results, 'mouseout', function (e) {
          if (!map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom) {
            map.scrollWheelZoom.enable();
          }
        });

      // Recalculate width of the input bar when window resizes
      if (this.options.fullWidth) {
        L.DomEvent.on(window, 'resize', function (e) {
          if (L.DomUtil.hasClass(this._container, 'leaflet-pelias-expanded')) {
            this.setFullWidth();
          }
        }, this);
      }

      // Collapse an empty input bar when user interacts with the map
      // Disabled if expanded is set to true
      if (!this.options.expanded) {
        L.DomEvent.on(this._map, 'mousedown', this._onMapInteraction, this);
        L.DomEvent.on(this._map, 'touchstart', this._onMapInteraction, this);
      }

      L.DomEvent.disableClickPropagation(this._container);
      if (map.attributionControl) {
        map.attributionControl.addAttribution(this.options.attribution);
      }
      return container;
    },

    _onMapInteraction: function (event) {
      if (!this._input.value) {
        this.collapse();
      }
    },

    onRemove: function (map) {
      map.attributionControl.removeAttribution(this.options.attribution);
    }
  });

  L.control.geocoder = function (apiKey, options) {
    return new L.Control.Geocoder(apiKey, options);
  };

  /*
   * AJAX Utility function (implements basic HTTP get)
   */
  var AJAX = {
    serialize: function (params) {
      var data = '';

      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          var param = params[key];
          var type = param.toString();
          var value;

          if (data.length) {
            data += '&';
          }

          switch (type) {
            case '[object Array]':
              value = (param[0].toString() === '[object Object]') ? JSON.stringify(param) : param.join(',');
              break;
            case '[object Object]':
              value = JSON.stringify(param);
              break;
            case '[object Date]':
              value = param.valueOf();
              break;
            default:
              value = param;
              break;
          }

          data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
      }

      return data;
    },
    http_request: function (callback, context) {
      if (window.XDomainRequest) {
        return this.xdr(callback, context);
      } else {
        return this.xhr(callback, context);
      }
    },
    xhr: function (callback, context) {
      var xhr = new XMLHttpRequest();

      xhr.onerror = function (e) {
        xhr.onreadystatechange = L.Util.falseFn;
        var error = {
          code: xhr.status,
          message: xhr.statusText
        };

        callback.call(context, error, null);
      };

      xhr.onreadystatechange = function () {
        var response;
        var error;

        if (xhr.readyState === 4) {
          // Handle all non-200 responses first
          if (xhr.status !== 200) {
            error = {
              code: xhr.status,
              message: xhr.statusText
            };
            callback.call(context, error, null);
          } else {
            try {
              response = JSON.parse(xhr.responseText);
            } catch (e) {
              response = null;
              error = {
                code: 500,
                message: 'Parse Error'
              };
            }

            if (!error && response.error) {
              error = response.error;
              response = null;
            }

            xhr.onerror = L.Util.falseFn;

            callback.call(context, error, response);
          }
        }
      };

      return xhr;
    },
    xdr: function (callback, context) {
      var xdr = new window.XDomainRequest();

      xdr.onerror = function (e) {
        xdr.onload = L.Util.falseFn;

        // XDRs have no access to actual status codes
        var error = {
          code: 500,
          message: 'XMLHttpRequest Error'
        };
        callback.call(context, error, null);
      };

      // XDRs have .onload instead of .onreadystatechange
      xdr.onload = function () {
        var response;
        var error;

        try {
          response = JSON.parse(xdr.responseText);
        } catch (e) {
          response = null;
          error = {
            code: 500,
            message: 'Parse Error'
          };
        }

        if (!error && response.error) {
          error = response.error;
          response = null;
        }

        xdr.onerror = L.Util.falseFn;
        callback.call(context, error, response);
      };

      return xdr;
    },
    request: function (url, params, callback, context) {
      var paramString = this.serialize(params);
      var httpRequest = this.http_request(callback, context);

      httpRequest.open('GET', url + '?' + paramString);

      setTimeout(function () {
        httpRequest.send(null);
      }, 0);
    }
  };

  /*
   * throttle Utility function (borrowed from underscore)
   */
  function throttle (func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
      previous = options.leading === false ? 0 : new Date().getTime();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function () {
      var now = new Date().getTime();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  /*
   * escaping a string for regex Utility function
   * from https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
   */
  function escapeRegExp (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }
}));
