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
    map.remove();
    document.body.removeChild(el);
  });

  describe('Basic interactions', function () {
    it('focuses on the input when I click on the geocoder', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
      happen.click(geocoder.getContainer());
      expect(document.activeElement).to.be(geocoder._input);
    });
  });

  describe('The × button', function () {
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

  describe('Interacting with results list', function () {
    it.skip('does stuff when keydown', function () {
      var geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
      happen.keydown(geocoder._input);
      // TODO
    });
  });

  describe('Actions that toggle expanded state', function () {
    it.skip('does not collapse if: map is clicked, and geocoder contains input', function () {
      var geocoder = new L.Control.Geocoder();
      var onCollapse = sinon.spy();

      geocoder.addTo(map);
      geocoder.on('collapse', onCollapse);

      // Simulates input
      geocoder.expand();
      geocoder._input.value = 'a';

      // Click the map
      // TODO: This is not actually clicking the map :(
      // happen.click(map);
      expect(onCollapse.called).to.be(false);
      expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
    });

    it.skip('collapses if: map is clicked, and geocoder is blank', function () {
      var geocoder = new L.Control.Geocoder();
      var onCollapse = sinon.spy();

      geocoder.addTo(map);
      geocoder.on('collapse', onCollapse);
      geocoder.expand();

      // Click the map
      // TODO: This is not actually clicking the map :(
      // happen.click(map);
      expect(onCollapse.called).to.be(true);
      expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(false);
    });

    it('collapses if: map is panned, and a result is highlighted');
  });
});
