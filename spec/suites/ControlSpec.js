before(function () {
  console.log('Leaflet version: ' + L.version);
});

describe('Control', function () {
  var map;

  beforeEach('initialize map', function () {
    map = L.map(document.createElement('div'));
  });

  describe('#addTo', function () {
    it('adds the geocoder control to the map if called with new', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
      expect(map.getContainer().querySelector('.leaflet-pelias-control')).to.equal(geocoder.getContainer());
    });

    it('adds the geocoder control to the map if called as function', function () {
      var geocoder = L.control.geocoder();
      geocoder.addTo(map);
      expect(map.getContainer().querySelector('.leaflet-pelias-control')).to.equal(geocoder.getContainer());
    });
  });

  // Note: this is Leaflet v1
  // Previous versions of Leaflet: geocoder.removeFrom(map);
  describe('#remove', function () {
    it('removes the geocoder control from the map', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.addTo(map).remove();
      expect(map.getContainer().querySelector('.leaflet-pelias-control')).to.equal(null);
    });

    it('calls onRemove if defined', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.onRemove = sinon.spy();
      geocoder.addTo(map).remove();
      expect(geocoder.onRemove.called).to.be(true);
    });

    it('is a no-op if the geocoder control has not been added', function () {
      var geocoder = new L.Control.Geocoder();
      expect(geocoder.remove()).to.equal(geocoder);
    });
  });
});
