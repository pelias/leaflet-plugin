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

  describe('#remove', function () {
    it('removes the geocoder control from the map', function () {
      var geocoder = new L.Control.Geocoder();

      if ('removeFrom' in geocoder) {
        // Leaflet < v1
        geocoder.addTo(map);
        geocoder.removeFrom(map);
      } else {
        // Leaflet v1+
        geocoder.addTo(map).remove();
      }

      expect(map.getContainer().querySelector('.leaflet-pelias-control')).to.equal(null);
    });

    it('calls onRemove if defined', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.onRemove = sinon.spy();

      if ('removeFrom' in geocoder) {
        // Leaflet < v1
        geocoder.addTo(map);
        geocoder.removeFrom(map);
      } else {
        // Leaflet v1+
        geocoder.addTo(map).remove();
      }

      expect(geocoder.onRemove.called).to.be(true);
    });

    it('is a no-op if the geocoder control has not been added (Leaflet v1+ only)', function () {
      var geocoder = new L.Control.Geocoder();
      // The pre-v1 equivalent, removeFrom(map) will throw a DOM exception.
      if (!('removeFrom' in geocoder)) {
        expect(geocoder.remove()).to.equal(geocoder);
      }
    });
  });
});
