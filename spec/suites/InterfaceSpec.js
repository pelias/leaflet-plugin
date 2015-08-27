describe('Interface', function () {
  var map;
  var el;

  beforeEach('initialize map', function () {
    el = document.createElement('div');
    // DOM needs to be visible
    el.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(el);
    map = L.map(el);
  });

  afterEach('destroy map', function () {
    document.body.removeChild(el);
  });

  describe('Close button', function () {
    it('should not be visible when control is first added', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
      expect(geocoder._close.classList.contains('leaflet-pelias-hidden')).to.be(true);
    });

    it('should be visible when input has 1 character', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
      // Simulates input action
      geocoder._input.focus();
      geocoder._input.value = 'a';
      happen.keyup(geocoder._input);
      expect(geocoder._close.classList.contains('leaflet-pelias-hidden')).to.be(false);
    });

  });
});
