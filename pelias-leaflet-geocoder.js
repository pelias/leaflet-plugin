/*
This adds a geocoder powered by pelias to a leaflet map
TODO: Better comments
*/

var AJAX = {
  serialize: function(params) {
    var data = '';

    for (var key in params){
      if(params.hasOwnProperty(key)){
        var param = params[key];
        var type = param.toString();
        var value;

        if(data.length){
          data += '&';
        }

        switch(type) {
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
  http_request: function(callback, context){
    var httpRequest = new XMLHttpRequest();

    httpRequest.onerror = function(e) {
      httpRequest.onreadystatechange = L.Util.falseFn;

      callback.call(context, {
        error: {
          code: 500,
          message: 'XMLHttpRequest Error'
        }
      }, null);
    };

    httpRequest.onreadystatechange = function(){
      var response;
      var error;

      if (httpRequest.readyState === 4) {
        try {
          response = JSON.parse(httpRequest.responseText);
        } catch(e) {
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

        httpRequest.onerror = L.Util.falseFn;

        callback.call(context, error, response);
      }
    };

    return httpRequest;
  },
  request: function(url, params, callback, context) {
    var paramString   = this.serialize(params);
    var httpRequest   = this.http_request(callback, context);
    
    // TODO check for maximum length for a GET req 
    // TODO alternatively POST if GET cannot be done
    // TODO fallback to JSONP if CORS isnt supported
    httpRequest.open('GET', url + '?' + paramString);
    httpRequest.send(null);
  }
}


L.Control.Geocoder = L.Control.extend({
  options: {
    position: 'topleft',
    icon: 'glyphicon-th-list glyphicon',
    url: '//pelias.mapzen.com/search',
    placeholder: 'Search',
    title: 'Search'
  },

  initialize: function (options) {
    L.Util.setOptions(this, options);
    this.marker;
    this.markers = [];
  },

  search: function(input) {
    L.DomUtil.addClass(this._input, 'pelias-loading');

    AJAX.request(this.options.url, {input: input}, function(err, results) {
      if (results && results.features) {
        L.DomUtil.removeClass(this._input, 'pelias-loading');
        this.showResults(results.features);
      }
    }, this);
  },

  showResults: function(features) {
    var list;
    var results_container = this._results;
    results_container.innerHTML = '';
    results_container.style.display = 'block';
    // manage result box height
    results_container.style.maxHeight = (this._map.getSize().y - results_container.offsetTop - this._container.offsetTop - 10) + 'px';
    
    features.forEach( function( feature ){
      if(!list) {
        list = L.DomUtil.create('ul', 'pelias-list', results_container);
      }

      var result_item = L.DomUtil.create('li', 'pelias-result', list);
      result_item.layer  = feature.properties.layer;
      result_item.coords = feature.geometry.coordinates; 
      result_item.innerHTML = feature.properties.text;
    });

    // feeling lucky
    var first_result = results_container.querySelectorAll('.' + 'pelias-result')[0];
    if (first_result) {
      L.DomUtil.addClass(first_result, 'pelias-selected');
    }
  },

  removeMarkers: function() {
    for (i=0; i<this.markers.length; i++) {
      this._map.removeLayer(this.markers[i]);
    }
    this.markers = [];
  },

  showMarker: function(text, coords) {
    this.removeMarkers();

    var geo = [coords[1], coords[0]];
    this._map.setView( geo, this._map.getZoom() || 8 );
    
    this.marker = new L.marker(geo).bindPopup(text);
    this._map.addLayer(this.marker);
    this.markers.push(this.marker);
    this.marker.openPopup();
  },

  clear: function(){
    this._results.style.display = 'none';
    this._results.innerHTML = '';
    this._input.value = '';
    this._input.placeholder = '';
    this._input.blur();

    L.DomUtil.removeClass(this._container, 'pelias-expanded');
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div',
        'pelias-control leaflet-bar leaflet-control');

    var self = this;
    this._layer = new L.LayerGroup();
    this._layer.addTo(map);

    this._container = container;

    this._input = L.DomUtil.create('input', 'pelias-input leaflet-bar', this._container);
    this._input.title = this.options.title;

    this._results = L.DomUtil.create('div', 'pelias-results leaflet-bar', this._container);

    L.DomEvent
      .on(this._input, 'focus', function(e){
          this._input.placeholder = this.options.placeholder;
          L.DomUtil.addClass(this._container, 'pelias-expanded');
        }, this)
      .on(this._container, 'click', function(e){
          this._input.focus();
        }, this)
      .on(this._input, 'blur', function(e){
          this.clear();
        }, this)
      .on(this._input, 'keydown', function(e){
          var list = this._results.querySelectorAll('.' + 'pelias-result');
          var selected = this._results.querySelectorAll('.' + 'pelias-selected')[0];
          var selectedPosition;

          for (var i = 0; i < list.length; i++) {
            if(list[i] === selected){
              selectedPosition = i;
              break;
            }
          }

          // TODO cleanup
          switch(e.keyCode) {
            // 13 = enter
            case 13:
              if(selected){
                this.showMarker(selected.innerHTML, selected['coords']);
                this.clear();
              } else {
                // TODO show all points on the map and adjust bounds to extents bbox
                L.DomUtil.addClass(list[0], 'pelias-selected');
              }
              L.DomEvent.preventDefault(e);
              break;
            // 38 = up arrow
            case 38:
              if(selected){
                L.DomUtil.removeClass(selected, 'pelias-selected');
              }

              var previousItem = list[selectedPosition-1];

              if(selected && previousItem) {
                L.DomUtil.addClass(previousItem, 'pelias-selected');
              } else {
                L.DomUtil.addClass(list[list.length-1], 'pelias-selected');
              }
              L.DomEvent.preventDefault(e);
              break;
            // 40 = down arrow
            case 40:
              if(selected){
                L.DomUtil.removeClass(selected, 'pelias-selected');
              }

              var nextItem = list[selectedPosition+1];

              if(selected && nextItem) {
                L.DomUtil.addClass(nextItem, 'pelias-selected');
              } else {
                L.DomUtil.addClass(list[0], 'pelias-selected');
              }
              L.DomEvent.preventDefault(e);
              break;
            // all other keys
            default: 
              break;
          } 
        }, this)
      .on(this._input, 'keyup', L.Util.limitExecByInterval(function(e){
          var key = e.which || e.keyCode;
          var text = (e.target || e.srcElement).value;

          // minimum 3 characters for suggestions
          // keyCode 27 = esc key (esc should clear results)
          if(text.length < 2 || key === 27) {
            this._results.innerHTML = '';
            this._results.style.display = 'none';
            L.DomUtil.removeClass(this._input, 'pelias-loading');
            return;
          }

          if(key !== 13 && key !== 38 && key !== 40){
            if(this._input.value !== this._lastValue){
              this._lastValue = this._input.value;
              this.search(text);
            }
          }
        }, 50, this), this)
      .on(this._results, 'mousedown', function(e){
          var selected = e.target;
          this.showMarker(selected.innerHTML, selected['coords']);
          this.clear();
          L.DomEvent.preventDefault(e);
        }, this)
      .on(this._results, 'mouseover', function(e){
          if(map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom){
            map.scrollWheelZoom.disable();
          }
        })
      .on(this._results, 'mouseout', function(e){
          if(!map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom){
            map.scrollWheelZoom.enable();
          }
        });

    L.DomEvent.disableClickPropagation(this._container);
    if (map.attributionControl) {
      map.attributionControl.addAttribution('Geocoding by <a href=\'http://mapzen.com/pelias\'>Pelias</a>');
    }
    return container;
  }
});

L.control.geocoder = function (options) {
  return new L.Control.Geocoder(options);
};
