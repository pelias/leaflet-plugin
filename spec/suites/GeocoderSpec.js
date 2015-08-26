describe('Geocoder', function () {
  var map;
  var options = {
    expanded: true
  };

  beforeEach(function () {
    var el = document.createElement('div');
    el.id = 'map';
    el.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(el);
    map = L.map(el);
  });

  afterEach(function () {
    document.body.removeChild(document.getElementById('map'));
  });

  describe('#focus', function () {
    it('should focus on the input if expanded is true and I click on the search icon', function () {
      var geocoder = new L.Control.Geocoder(null, options);
      geocoder.addTo(map);

      function click (el) {
        var ev = document.createEvent('MouseEvent');
        ev.initMouseEvent(
          'click',
          true, true,
          window, null,
          0, 0, 0, 0,
          false, false, false, false,
          0, null
        );
        el.dispatchEvent(ev);
      }
      click(geocoder._search);
      expect(document.activeElement.className).to.be('leaflet-pelias-input');
    });
  });

  describe('#expanded', function () {
    it('is at the expanded width when added to the map', function () {
      var geocoder = new L.Control.Geocoder(null, options);
      geocoder.addTo(map);

      expect(geocoder.getContainer().getBoundingClientRect().width).to.be(280);
    });
  });

});
