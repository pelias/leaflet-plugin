describe('Options', function () {
  var map;
  var el;

  beforeEach(function () {
    el = document.createElement('div');
    // DOM needs to be visible: appended to the body and have dimensions
    // in order for .focus() to work properly
    el.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(el);
    map = L.map(el);
  });

  afterEach(function () {
    document.body.removeChild(el);
  });

  describe('defaults', function () {
    var geocoder;

    beforeEach(function () {
      geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
    });

    it('should not have the expanded state when added to the map', function () {
      expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(false);
    });

    it('should be added to the top left position', function () {
      var controlsClass = geocoder.getContainer().parentNode.classList;
      expect(controlsClass.contains('leaflet-top')).to.be(true);
      expect(controlsClass.contains('leaflet-left')).to.be(true);
    });
  });

  describe('control positions', function () {
    var positions = [
      ['top', 'left'],
      ['top', 'right'],
      ['bottom', 'left'],
      ['bottom', 'right']
    ];

    positions.forEach(function (position) {
      it('adds control to the ' + position[0] + ' ' + position[1] + ' if position value is `' + position[0] + position[1] + '`', function () {
        var geocoder = new L.Control.Geocoder(null, { position: position[0] + position[1] });
        geocoder.addTo(map);
        var controlsClass = geocoder.getContainer().parentNode.classList;
        expect(controlsClass.contains('leaflet-' + position[0])).to.be(true);
        expect(controlsClass.contains('leaflet-' + position[1])).to.be(true);
      });
    });
  });

  describe('expanded = true', function () {
    var geocoder;
    var options = {
      expanded: true
    };

    beforeEach(function () {
      geocoder = new L.Control.Geocoder(null, options);
      geocoder.addTo(map);
    });

    it('should have the expanded state when added to the map', function () {
      expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
    });

    it('should focus on the input when I click on search icon', function () {
      happen.click(geocoder._search);
      expect(document.activeElement.className).to.equal('leaflet-pelias-input');
    });

    it('should not lose the expanded state when I click the search icon', function () {
      happen.click(geocoder._search);
      expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
    });
  });
});
