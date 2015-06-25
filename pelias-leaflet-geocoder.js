/*
 * This adds a geocoder powered by pelias to a leaflet map
 * TODO: Better comments
 */

L.Control.Geocoder = L.Control.extend({
  options: {
    position: 'topleft',
    attribution: 'Geocoding by <a href=\'http://mapzen.com/pelias\'>Pelias</a>',
    url: '//pelias.mapzen.com',
    placeholder: 'Search',
    title: 'Search',
    bbox: false,
    latlon: null,
    layers: 'poi,admin,address',
    point_icon: '/img/point_icon.png',
    polygon_icon: '/img/polygon_icon.png'
  },

  initialize: function (options) {
    L.Util.setOptions(this, options);
    this.marker;
    this.markers = [];

    this.throttle = L.Util.throttle ? L.Util.throttle : L.Util.limitExecByInterval;
  },

  getLayers: function (params) {
    var layers = this.options.layers;

    if ( !layers ) {
      return params;
    }

    params.layers = layers;
    return params;
  },

  getBoundingBoxParam: function (params) {
    var bbox= this.options.bbox;
    
    if ( !bbox ) {
      return params;
    }
    
    if ( (typeof bbox !== 'object') || !bbox.isValid() ) {
      bbox = this._map.getBounds();
    } 

    var bbox_center  = bbox.getCenter();
    params.bbox = bbox.toBBoxString();
    params.lat  = bbox_center.lat;
    params.lon  = bbox_center.lng;
    return params;
  },

  getLatLonParam: function (params) {
    /*
     * this.options.latlon can be one of the following
     * [50, 30] //Array
     * {lon: 30, lat: 50} //Object
     * {lat: 50, lng: 30} //Object
     * L.latLng(50, 30) //Object
     * true //Boolean - take the map center
     * false //Boolean - No latlon to be considered
    */
    var latlon= this.options.latlon;
    
    if ( !latlon ) {
      return params;
    }
    
    if (latlon.constructor === Array) {
      // TODO Check for array size, throw errors if invalid lat/lon
      params.lat = latlon[0];
      params.lon = latlon[1];
    } else if (typeof latlon !== 'object') {
      // fallback to the map's center L.latLng()
      latlon = this._map.getCenter();
    } else {
      // TODO Check for valid L.LatLng Object or Object thats in the form of {lat:..,lon:..}
      // TODO Check for valid lat/lon values, Error handling
      params.lat = latlon.lat;
      params.lon = latlon.lng ? latlon.lng : latlon.lon;
    }
    return params;
  },

  search: function(input) {
    var url = this.options.url + '/search';
    var params = {
      input: input
    };

    this.callPelias(url, params);
  },

  suggest: function(input) {
    var url = this.options.url + '/suggest';
    
    // TODO make geo context optional (with completion suggester v2)
    // /suggest while typing requires lat/lon
    // https://github.com/elasticsearch/elasticsearch/issues/6444
    // https://github.com/elastic/elasticsearch/issues/10746
    var geo = this._map.getCenter();

    var params = {
      input: input,
      lat: geo.lat,
      lon: geo.lng
    };
    
    this.callPelias(url, params);
  },

  callPelias: function(endpoint, params) {
    params = this.getBoundingBoxParam( params );
    params = this.getLatLonParam( params );
    params = this.getLayers( params );
    
    // Since we always use properties.text we dont need the details
    // See https://github.com/pelias/api/releases/tag/1.2.0
    params.details = false;

    L.DomUtil.addClass(this._input, 'pelias-loading');

    AJAX.request(endpoint, params, function(err, results) {
      if (results && results.features) {
        L.DomUtil.removeClass(this._input, 'pelias-loading');
        this.showResults(results.features);
      }
    }, this);
  },
  
  highlight: function( text, focus ){
    var r = RegExp( '('+ focus + ')', 'gi' );
    return text.replace( r, '<strong>$1</strong>' );
  },

  getMeta: function( type ) {
    var point_icon = this.options.point_icon;
    var polygon_icon = this.options.polygon_icon;

    if( type.match('geoname') ){
      return { icon: point_icon, title: 'source: geonames'};
    } else if( type.match('osm') || 
               type.match('osmway')  || 
               type.match('osmnode') || 
               type.match('osmaddress')){
      return { icon: point_icon, title: 'source: openstreetmap'};
    } else if( type.match('admin0') || 
               type.match('admin1') || 
               type.match('admin2') || 
               type.match('locality') ||
               type.match('neighborhood') || 
               type.match('local_admin') ){
      return { icon: polygon_icon, title: 'source: quattroshapes'};
    } else if( type.match('openaddresses') ){
      return { icon: point_icon, title: 'source: openaddresses'};
    }
    return { icon: point_icon, title: 'source: default'};
  },

  showResults: function(features) {
    var list;
    var self = this; 
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
      var result_meta = self.getMeta(feature.properties.layer);

      result_item.layer  = feature.properties.layer;
      result_item.coords = feature.geometry.coordinates; 

      var layer_icon_con = L.DomUtil.create('span', 'layer_icon_container', result_item);
      var layer_icon     = L.DomUtil.create('img', 'layer_icon', layer_icon_con);
      layer_icon.src  = result_meta.icon;
      layer_icon.title= result_meta.title;   
      result_item.innerHTML += self.highlight(feature.properties.text, self._input.value);
    });
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
    // this._results.innerHTML = '';
    // this._input.value = '';
    // this._input.placeholder = '';
    // this._input.blur();

    // L.DomUtil.removeClass(this._container, 'pelias-expanded');
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
          this._results.style.display = 'block';
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
                // perform a full text search on enter
                var text = (e.target || e.srcElement).value;
                this.search(text);
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
      .on(this._input, 'keyup', this.throttle(function(e){
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
              this.suggest(text);
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
      map.attributionControl.addAttribution(this.options.attribution);
    }
    return container;
  },

  onRemove: function (map) {
    map.attributionControl.removeAttribution(this.options.attribution);
  }
});

L.control.geocoder = function (options) {
  return new L.Control.Geocoder(options);
};

/* 
 * AJAX Utitity function (implements basic HTTP get)
 * TODO check for maximum length for a GET req 
 * TODO alternatively POST if GET cannot be done
 * TODO fallback to JSONP if CORS isnt supported
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
    
    httpRequest.open('GET', url + '?' + paramString);
    httpRequest.send(null);
  }
}
