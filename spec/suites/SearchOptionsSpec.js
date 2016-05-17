describe('Search options', function () {
  var params;

  beforeEach('initialize empty params object', function () {
    params = {};
  });

  // Maps are not necessary for all of the options, so create when needed
  function createMap () {
    var el = document.createElement('div');
    el.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(el);
    return L.map(el);
  }

  // Don't forget to clean up the map and DOM after you're done
  function destroyMap (map) {
    var el = map.getContainer();
    map.remove();
    document.body.removeChild(el);
  }

  // API keys
  describe('api key', function () {
    it('should accept an API key', function () {
      var geocoder = new L.Control.Geocoder('search-xxxxxx', {});

      expect(geocoder.apiKey).to.be('search-xxxxxx');
      // TODO: check api key is on params
    });

    it('should not fail without an API key', function () {
      var geocoder = new L.Control.Geocoder();

      expect(geocoder.apiKey).to.not.be.ok();
      // TODO: check api key is not on params
    });

    it('should not be set if API key is undefined', function () {
      var geocoder = new L.Control.Geocoder(undefined, {});

      expect(geocoder.apiKey).to.not.be.ok();
      // TODO: check api key is not on params
    });

    it('should not be set if API key is null', function () {
      var geocoder = new L.Control.Geocoder(null, {});

      expect(geocoder.apiKey).to.not.be.ok();
      // TODO: check api key is not on params
    });

    it('should still pick up options if the API key is parameter is omitted entirely', function () {
      var geocoder = new L.Control.Geocoder({});

      expect(geocoder.apiKey).to.not.be.ok();
      // TODO: check api key is not on params
    });
  });

  // Tests return value of getBoundingBoxParam()
  describe('bounds', function () {
    it('should not set boundary.rect parameters by default', function () {
      var geocoder = new L.Control.Geocoder();

      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon']).to.be(undefined);
    });

    it('should not set boundary.rect parameters if option is set to false', function () {
      var geocoder = new L.Control.Geocoder('', {
        bounds: false
      });

      expect(geocoder.options.bounds).to.be(false);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon']).to.be(undefined);
    });

    it('should set boundary.rect to current map viewport if option is set to true', function () {
      var geocoder = new L.Control.Geocoder('', {
        bounds: true
      });

      // Set map zoom and center to an arbitrary amount
      var map = createMap();
      map.setView([30, 30], 10);
      geocoder.addTo(map);
      expect(geocoder.options.bounds).to.be(true);

      // Actual bounds depends on the viewport, just test to see that a number is returned
      // and that they are properly ordered
      var minLat = geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat'];
      var minLon = geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon'];
      var maxLat = geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat'];
      var maxLon = geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon'];

      expect(minLat).to.be.a('number');
      expect(maxLat).to.be.a('number');
      expect(minLat).to.be.lessThan(maxLat);
      expect(minLon).to.be.a('number');
      expect(maxLon).to.be.a('number');
      expect(minLon).to.be.lessThan(maxLon);

      destroyMap(map);
    });

    it('should set boundary.rect from an L.Bounds object if provided', function () {
      var geocoder = new L.Control.Geocoder('', {
        bounds: new L.LatLngBounds([[10, 10], [40, 60]])
      });

      expect(geocoder.options.bounds.isValid()).to.be(true);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat']).to.be(10);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon']).to.be(10);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat']).to.be(40);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon']).to.be(60);
    });

    it('should set boundary.rect from a simple array format if provided', function () {
      var geocoder = new L.Control.Geocoder('', {
        bounds: [[10, 10], [40, 60]]
      });

      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat']).to.be(10);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon']).to.be(10);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat']).to.be(40);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon']).to.be(60);
    });

    it('should not set boundary.rect if the bounds option is in an improper format', function () {
      var geocoder = new L.Control.Geocoder('', {
        bounds: [30, 40, 50, 60]
      });

      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon']).to.be(undefined);
    });
  });

  // Tests return value of getFocusParam()
  describe('focus', function () {
    it('should set focus.point parameters by default', function () {
      var geocoder = new L.Control.Geocoder();

      // Set map zoom and center to an arbitrary amount
      var map = createMap();
      map.setView([30, 30], 10);
      geocoder.addTo(map);

      expect(geocoder.getFocusParam(params)['focus.point.lat']).to.be(30);
      expect(geocoder.getFocusParam(params)['focus.point.lon']).to.be(30);

      destroyMap(map);
    });

    it('should not set focus.point parameters if option is set to false', function () {
      var geocoder = new L.Control.Geocoder('', {
        focus: false
      });

      expect(geocoder.options.focus).to.be(false);
      expect(geocoder.getFocusParam(params)['focus.point.lat']).to.be(undefined);
      expect(geocoder.getFocusParam(params)['focus.point.lon']).to.be(undefined);
    });

    it('should set focus.point to current map center if option is set to true', function () {
      var geocoder = new L.Control.Geocoder('', {
        focus: true
      });

      // Set map zoom and center to an arbitrary amount
      var map = createMap();
      map.setView([30, 30], 10);
      geocoder.addTo(map);

      // Make sure option is set to the correct boolean
      expect(geocoder.options.focus).to.be(true);

      // Make sure the params match the map center we set it to
      expect(geocoder.getFocusParam(params)['focus.point.lat']).to.be(30);
      expect(geocoder.getFocusParam(params)['focus.point.lon']).to.be(30);

      destroyMap(map);
    });

    it('should set focus.point from an array [lat, lng] if provided', function () {
      var geocoder = new L.Control.Geocoder('', {
        focus: [50, 30]
      });

      expect(geocoder.getFocusParam(params)['focus.point.lat']).to.be(50);
      expect(geocoder.getFocusParam(params)['focus.point.lon']).to.be(30);
    });

    it('should set focus.point from an object {lon, lat} if provided', function () {
      var geocoder = new L.Control.Geocoder('', {
        focus: {lon: 30, lat: 50}
      });

      expect(geocoder.getFocusParam(params)['focus.point.lat']).to.be(50);
      expect(geocoder.getFocusParam(params)['focus.point.lon']).to.be(30);
    });

    it('should set focus.point from an object {lat, lng} if provided', function () {
      var geocoder = new L.Control.Geocoder('', {
        focus: {lat: 50, lng: 30}
      });

      expect(geocoder.getFocusParam(params)['focus.point.lat']).to.be(50);
      expect(geocoder.getFocusParam(params)['focus.point.lon']).to.be(30);
    });

    it('should set focus.point from an L.LatLng object if provided', function () {
      var geocoder = new L.Control.Geocoder('', {
        focus: L.latLng(50.5, 30.5)
      });

      expect(geocoder.getFocusParam(params)['focus.point.lat']).to.be(50.5);
      expect(geocoder.getFocusParam(params)['focus.point.lon']).to.be(30.5);
    });
  });

  // Tests return value of getLayers()
  describe('layers', function () {
    it('should not set layers parameters by default', function () {
      var geocoder = new L.Control.Geocoder();

      expect(geocoder.getLayers(params)['layers']).to.be(undefined);
    });

    it('should not set layers parameters if option is set to false', function () {
      var geocoder = new L.Control.Geocoder('', {
        layers: false
      });

      expect(geocoder.options.layers).to.be(false);
      expect(geocoder.getLayers(params)['layers']).to.be(undefined);
    });

    it('should set layers parameter if a string is provided', function () {
      var geocoder = new L.Control.Geocoder('', {
        layers: 'coarse'
      });

      expect(geocoder.getLayers(params)['layers']).to.be('coarse');
    });

    it('should set layers parameter if an array is provided', function () {
      var geocoder = new L.Control.Geocoder('', {
        layers: ['venue', 'address']
      });

      expect(geocoder.getLayers(params)['layers']).to.eql(['venue', 'address']);
    });
  });

  // Pass-through query parameters
  describe('query parameters', function () {
    it('should return original parameters if option is not set', function () {
      var geocoder = new L.Control.Geocoder({
        layers: 'coarse', // Convenience option for parameter
        focus: false      // This just prevents geocoder from looking for the map
      });
      var params = geocoder.getParams();
      var testParams = {
        layers: 'coarse'
      };

      expect(params).to.eql(testParams);
    });

    it('should return original parameters if option is a falsy value', function () {
      // Test `params: false`
      var geocoder1 = new L.Control.Geocoder({
        layers: 'coarse', // Convenience option for parameter
        focus: false,     // This prevents geocoder from requiring that Leaflet is initialized
        params: false
      });
      var params1 = geocoder1.getParams();

      // Test `params: null`
      var geocoder2 = new L.Control.Geocoder({
        layers: 'coarse', // Convenience option for parameter
        focus: false,     // This prevents geocoder from requiring that Leaflet is initialized
        params: null
      });
      var params2 = geocoder2.getParams();

      var testParams = {
        layers: 'coarse'
      };

      expect(params1).to.eql(testParams);
      expect(params2).to.eql(testParams);
    });

    it('should return combined parameters if option is set', function () {
      var geocoder = new L.Control.Geocoder({
        layers: 'coarse', // Convenience option for parameter
        focus: false,     // This prevents geocoder from requiring that Leaflet is initialized
        params: {
          'boundary.rect.min_lat': -10,
          'boundary.country': 'AUS',
          'sources': 'oa'
        }
      });
      var params = geocoder.getParams();
      var testParams = {
        'layers': 'coarse',
        'boundary.rect.min_lat': -10,
        'boundary.country': 'AUS',
        'sources': 'oa'
      };

      expect(params).to.eql(testParams);
    });

    it('should overwrite parameters set by convenience options', function () {
      var geocoder = new L.Control.Geocoder({
        layers: ['venue', 'address'], // Convenience option for parameter
        focus: false,     // This prevents geocoder from requiring that Leaflet is initialized
        params: {
          layers: 'coarse'
        }
      });
      var params = geocoder.getParams();
      var testParams = {
        'layers': 'coarse'
      };

      expect(params).to.eql(testParams);
    });

    it('should not remove unknown parameters', function () {
      var geocoder = new L.Control.Geocoder({
        layers: 'coarse', // Convenience option for parameter
        focus: false,     // This prevents geocoder from requiring that Leaflet is initialized
        params: {
          unknownParam: false
        }
      });
      var params = geocoder.getParams();
      var testParams = {
        'layers': 'coarse',
        'unknownParam': false
      };

      expect(params).to.eql(testParams);
    });
  });
});
