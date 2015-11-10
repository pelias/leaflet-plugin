describe('Search options', function () {
  var map;
  var el;
  var params;

  beforeEach('initialize map', function () {
    el = document.createElement('div');
    el.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(el);
    map = L.map(el);
    params = {};
  });

  afterEach('destroy map', function () {
    document.body.removeChild(el);
  });

  // Tests return value of getBoundingBoxParam()
  describe('bounds', function () {
    it('should not set boundary.rect parameters by default', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon']).to.be(undefined);
    });

    it('should not set boundary.rect parameters if bounds option is set to false', function () {
      var geocoder = new L.Control.Geocoder('', {
        bounds: false
      });
      geocoder.addTo(map);
      expect(geocoder.options.bounds).to.be(false);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon']).to.be(undefined);
    });

    it('should set boundary.rect to current map viewport if bounds option is set to true', function () {
      var geocoder = new L.Control.Geocoder('', {
        bounds: true
      });
      // Set map zoom and center to an arbitrary amount
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
    });

    it('should set boundary.rect from an L.Bounds object if provided', function () {
      var geocoder = new L.Control.Geocoder('', {
        bounds: new L.LatLngBounds([[10, 10], [40, 60]])
      });
      geocoder.addTo(map);
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
      geocoder.addTo(map);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat']).to.be(10);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon']).to.be(10);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat']).to.be(40);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon']).to.be(60);
    });

    it('should not set boundary.rect if the bounds option is in an improper format', function () {
      var geocoder = new L.Control.Geocoder('', {
        bounds: [30, 40, 50, 60]
      });
      geocoder.addTo(map);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.min_lon']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lat']).to.be(undefined);
      expect(geocoder.getBoundingBoxParam(params)['boundary.rect.max_lon']).to.be(undefined);
    });
  });
});
