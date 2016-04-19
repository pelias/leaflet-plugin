describe('Results', function () {
  var el;
  var map;
  var geocoder;
  var results;

  before('load the dummy results', function (done) {
    loadJSON('fixtures/search.json', function (response) {
      results = JSON.parse(response);
      done();
    });
  });

  beforeEach('initialize map', function () {
    el = document.createElement('div');
    // DOM needs to be visible: appended to the body and have dimensions
    // in order for .focus() to work properly
    el.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(el);

    map = L.map(el);

    geocoder = new L.Control.Geocoder();
    geocoder.addTo(map);
  });

  afterEach('destroy map', function () {
    map.remove();
    document.body.removeChild(el);
  });

  // Make sure that what you give to showMessage() is what gets displayed.
  // When testing results, cases that result in a message being shown just
  // have to test that showMessage() is called & a string is present, but
  // don't test for actual messages because those can change.
  describe('#showMessage', function () {
    it('shows the message you give it', function () {
      var message = 'message';
      geocoder.showMessage(message);

      expect(el.querySelector('.leaflet-pelias-message').textContent).to.equal(message);

      // TODO: this is a brittle test for visibility
      expect(geocoder._results.style.display).to.be('block');
    });
  });

  describe('#showResults', function () {
    it('displays a message if there are no results', function () {
      // Empty features array. (is response guaranteed to be an array?)
      geocoder.showResults([], 'foo');

      expect(el.querySelector('.leaflet-pelias-message').textContent).to.be.a('string');
    });

    it('displays results', function () {
      geocoder.showResults(results.features, 'foo');

      // No message should be shown
      expect(el.querySelector('.leaflet-pelias-message')).to.not.be.ok();

      // Results elements should be present
      expect(el.querySelectorAll('.leaflet-pelias-result').length).to.be(10);
      expect(el.querySelector('.leaflet-pelias-result').feature).to.be.an('object');
      expect(el.querySelector('.leaflet-pelias-result').textContent).to.be.a('string');
    });

    it('highlights snippets of the text label with the query text', function () {
      // Test case insensitive matching
      geocoder.showResults([{
        'properties': {
          'layer': 'region',
          'label': 'Foo, Bar'
        },
        'geometry': {
          'coordinates': [0, 0]
        }
      }], 'foo');

      expect(el.querySelector('.leaflet-pelias-result').innerHTML).to.contain('<strong>Foo</strong>');
    });

    describe('layer icons', function () {
      it('gets the correct layer icon for layer `venue`', function () {
        var icon = geocoder.getIconType('venue');
        expect(icon.type).to.be('class');
        expect(icon.value).to.contain('point');
      });

      it('gets the correct layer icon for layer `address`', function () {
        var icon = geocoder.getIconType('address');
        expect(icon.type).to.be('class');
        expect(icon.value).to.contain('point');
      });

      it('gets the correct layer icon for layer `country`', function () {
        var icon = geocoder.getIconType('country');
        expect(icon.type).to.be('class');
        expect(icon.value).to.contain('polygon');
      });

      it('gets the correct layer icon for layer `region`', function () {
        var icon = geocoder.getIconType('region');
        expect(icon.type).to.be('class');
        expect(icon.value).to.contain('polygon');
      });

      it('gets the correct layer icon for layer `county`', function () {
        var icon = geocoder.getIconType('county');
        expect(icon.type).to.be('class');
        expect(icon.value).to.contain('polygon');
      });

      it('gets the correct layer icon for layer `locality`', function () {
        var icon = geocoder.getIconType('locality');
        expect(icon.type).to.be('class');
        expect(icon.value).to.contain('polygon');
      });

      it('gets the correct layer icon for layer `localadmin`', function () {
        var icon = geocoder.getIconType('localadmin');
        expect(icon.type).to.be('class');
        expect(icon.value).to.contain('polygon');
      });

      it('gets the correct layer icon for layer `neighbourhood`', function () {
        var icon = geocoder.getIconType('neighbourhood');
        expect(icon.type).to.be('class');
        expect(icon.value).to.contain('polygon');
      });

      it('returns false if point icon option is false', function () {
        geocoder.options.pointIcon = false;
        var icon = geocoder.getIconType('address');
        expect(icon).to.not.be.ok();
      });

      it('returns false if polygon icon option is false', function () {
        geocoder.options.polygonIcon = false;
        var icon = geocoder.getIconType('neighbourhood');
        expect(icon).to.not.be.ok();
      });

      it('returns a path if point icon option is set to a string', function () {
        geocoder.options.pointIcon = 'images/point_icon.png';
        var icon = geocoder.getIconType('venue');
        expect(icon.type).to.be('image');
        expect(icon.value).to.be(geocoder.options.pointIcon);
      });

      it('returns a path if polygon icon option is set to a string', function () {
        geocoder.options.polygonIcon = 'images/polygon_icon.png';
        var icon = geocoder.getIconType('locality');
        expect(icon.type).to.be('image');
        expect(icon.value).to.be(geocoder.options.polygonIcon);
      });
    });
  });

  it('throws away stale results');
});
