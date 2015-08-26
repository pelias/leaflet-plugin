describe('Options', function () {
  var map;
  var el;
  var options = {
    expanded: true
  };

  beforeEach(function () {
    el = document.createElement('div');
    // DOM needs to be visible: appended to body and with dimensions
    // in order for .focus() to work properly
    el.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(el);
    map = L.map(el);
  });

  afterEach(function () {
    document.body.removeChild(el);
  });

  describe('expanded = true', function () {
    it('has the expanded state when added to the map', function () {
      var geocoder = new L.Control.Geocoder(null, options);
      geocoder.addTo(map);
      expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
    });

    it('focuses on the input when I click on search icon', function () {
      var geocoder = new L.Control.Geocoder(null, options);
      geocoder.addTo(map);
      happen.click(geocoder._search);
      expect(document.activeElement.className).to.equal('leaflet-pelias-input');
    });

    it('does not lose the expanded state when I click the search icon', function () {
      var geocoder = new L.Control.Geocoder(null, options);
      geocoder.addTo(map);
      happen.click(geocoder._search);
      expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
    });
  });

});
