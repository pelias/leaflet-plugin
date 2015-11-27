describe('Interface', function () {
  var map;
  var el;

  beforeEach('initialize map', function () {
    el = document.createElement('div');
    // DOM needs to be visible: appended to the body and have dimensions
    // in order for .focus() to work properly
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

    it('should be visible when input has 2 characters', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
      // Simulates input action
      geocoder._input.focus();
      geocoder._input.value = 'bb';
      happen.keyup(geocoder._input);
      expect(geocoder._close.classList.contains('leaflet-pelias-hidden')).to.be(false);
    });

    it('should reset input when clicked', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);

      // Simulates input action
      geocoder._input.focus();
      geocoder._input.value = 'sometext';
      happen.click(geocoder._close);

      expect(geocoder._input.value.length).to.be(0);
      expect(geocoder._close.classList.contains('leaflet-pelias-hidden')).to.be(true);
      expect(geocoder.markers).to.be.empty();
      expect(geocoder._results.style.display).to.be('none');
      expect(geocoder._results.innerHTML.length).to.be(0);
    });
  });
});
