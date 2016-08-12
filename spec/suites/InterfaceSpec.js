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

  describe('The × button (reset)', function () {
    var geocoder;

    beforeEach('initialize geocoder', function () {
      geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);

      // Prevent geocoder.callPelias() from getting called during these tests, so stub it
      sinon.stub(geocoder, 'callPelias');
    });

    it('should not be visible when control is first added', function () {
      expect(geocoder._reset.classList.contains('leaflet-pelias-hidden')).to.be(true);
    });

    it('should be visible when input has 1 character', function () {
      // Simulates input action
      geocoder._input.focus();
      geocoder._input.value = 'a';
      happen.keyup(geocoder._input);
      expect(geocoder._reset.classList.contains('leaflet-pelias-hidden')).to.be(false);
    });

    it('should be visible when input has 2 characters', function () {
      // Simulates input action
      geocoder._input.focus();
      geocoder._input.value = 'bb';
      happen.keyup(geocoder._input);
      expect(geocoder._reset.classList.contains('leaflet-pelias-hidden')).to.be(false);
    });

    it('should reset input when clicked', function () {
      // Simulates input action
      geocoder._input.focus();
      geocoder._input.value = 'sometext';
      happen.click(geocoder._reset);

      expect(geocoder._input.value.length).to.be(0);
      expect(geocoder._reset.classList.contains('leaflet-pelias-hidden')).to.be(true);
      expect(geocoder.markers).to.be.empty();
      expect(geocoder._results.style.display).to.be('none');
      expect(geocoder._results.innerHTML.length).to.be(0);
    });

    it('fires `reset` event', function () {
      var onReset = sinon.spy();
      geocoder.on('reset', onReset);

      happen.click(geocoder._reset);

      expect(onReset.called).to.be(true);
      expect(onReset.callCount).to.be.lessThan(2);
    });
  });

  describe('Input element', function () {
    it('performs a search when I press enter', function () {
      var geocoder = new L.Control.Geocoder();
      var stub = sinon.stub(geocoder, 'callPelias');

      geocoder.addTo(map);
      geocoder._input.value = 'foo';
      happen.keydown(geocoder._input, { keyCode: 13 });

      expect(stub.called).to.be(true);
    });

    it('does not perform a search when the input is blank', function () {
      var geocoder = new L.Control.Geocoder();
      var stub = sinon.stub(geocoder, 'callPelias');

      geocoder.addTo(map);
      happen.keydown(geocoder._input, { keyCode: 13 });

      expect(stub.called).to.be(false);
    });

    it('does not perform a search when an element is highlighted');
    it('performs autocomplete when enabled');
    it('does not perform autocomplete when disabled');
    it('clears current input and results when I press enter');
  });

  describe('Results list', function () {
    var results;
    var geocoder;

    before('load the dummy results', function (done) {
      loadJSON('fixtures/search.json', function (response) {
        results = JSON.parse(response);
        done();
      });
    });

    beforeEach('simulate input and results', function () {
      geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
      geocoder.expand();
      geocoder.showResults(results.features, 'foo');
    });

    it('has no highlighted result at first', function () {
      expect(document.querySelector('.leaflet-pelias-selected')).to.be.null;
    });

    it('highlights the first result when I press down', function () {
      happen.keydown(geocoder._input, { keyCode: 40 });
      expect(document.querySelector('.leaflet-pelias-selected')).to.be(document.querySelectorAll('.leaflet-pelias-result')[0]);
    });

    it('highlights the last result when I press up', function () {
      happen.keydown(geocoder._input, { keyCode: 38 });
      expect(document.querySelector('.leaflet-pelias-selected')).to.be(document.querySelectorAll('.leaflet-pelias-result')[9]);
    });

    it('highlights the next item when I press down twice', function () {
      happen.keydown(geocoder._input, { keyCode: 40 });
      happen.keydown(geocoder._input, { keyCode: 40 });
      expect(document.querySelector('.leaflet-pelias-selected')).to.be(document.querySelectorAll('.leaflet-pelias-result')[1]);
    });

    it('highlights the correct result after a bunch of up/down presses', function () {
      happen.keydown(geocoder._input, { keyCode: 38 });
      happen.keydown(geocoder._input, { keyCode: 38 });
      happen.keydown(geocoder._input, { keyCode: 40 });
      happen.keydown(geocoder._input, { keyCode: 38 });
      happen.keydown(geocoder._input, { keyCode: 38 });
      happen.keydown(geocoder._input, { keyCode: 40 });
      happen.keydown(geocoder._input, { keyCode: 40 });
      happen.keydown(geocoder._input, { keyCode: 40 });
      expect(document.querySelector('.leaflet-pelias-selected')).to.be(document.querySelectorAll('.leaflet-pelias-result')[0]);
    });

    it('selects the currently highlighted result when I press enter', function () {
      var onSelect = sinon.spy();
      geocoder.on('select', onSelect);
      happen.keydown(geocoder._input, { keyCode: 40 });
      happen.keydown(geocoder._input, { keyCode: 40 });
      var selectedEl = document.querySelector('.leaflet-pelias-selected');
      happen.keydown(geocoder._input, { keyCode: 13 });
      expect(selectedEl.feature).to.eql(onSelect.args[0][0].feature);
    });

    it('selects a result when I click it', function () {
      var onSelect = sinon.spy();
      geocoder.on('select', onSelect);
      var selectedEl = document.querySelectorAll('.leaflet-pelias-result')[5];
      happen.click(selectedEl);
      expect(selectedEl.feature).to.eql(onSelect.args[0][0].feature);
    });

    it('replaces the input with the result label after being selected', function () {
      geocoder._input.value = 'foo';
      var onSelect = sinon.spy();
      geocoder.on('select', onSelect);
      var selectedEl = document.querySelectorAll('.leaflet-pelias-result')[4];
      happen.click(selectedEl);
      expect(geocoder._input.value).to.not.be('foo');
      expect(geocoder._input.value).to.be(onSelect.args[0][0].feature.properties.label);
    });

    it('pans the map when a result is highlighted', function () {
      var selectedEl, mapCenter, coords;
      var onSelect = sinon.spy();
      geocoder.on('select', onSelect);
      map.setView([20, 20], 10);

      // The test expectations round numbers down in order to
      // to prevent the tests from throwing errors such as
      // "Error: expected 43.000629854450025 to equal 43.00035"
      // see: https://circleci.com/gh/mapzen/leaflet-geocoder/194

      // First pan
      happen.keydown(geocoder._input, { keyCode: 40 });
      selectedEl = document.querySelector('.leaflet-pelias-selected');
      mapCenter = map.getCenter();
      coords = selectedEl.feature.geometry.coordinates;
      expect(Math.floor(mapCenter.lat)).to.be(Math.floor(coords[1]));
      expect(Math.floor(mapCenter.lng)).to.be(Math.floor(coords[0]));

      // Second pan
      happen.keydown(geocoder._input, { keyCode: 40 });
      selectedEl = document.querySelector('.leaflet-pelias-selected');
      mapCenter = map.getCenter();
      coords = selectedEl.feature.geometry.coordinates;
      expect(Math.floor(mapCenter.lat)).to.be(Math.floor(coords[1]));
      expect(Math.floor(mapCenter.lng)).to.be(Math.floor(coords[0]));
    });

    it('does not pan the map when a result is highlighted', function () {
      var selectedEl, mapCenter, coords;
      geocoder.options.panToPoint = false;
      map.setView([20, 20], 10);

      // First pan
      happen.keydown(geocoder._input, { keyCode: 40 });
      selectedEl = document.querySelector('.leaflet-pelias-selected');
      mapCenter = map.getCenter();
      coords = selectedEl.feature.geometry.coordinates;
      expect(mapCenter.lat).to.not.be(coords[1]);
      expect(mapCenter.lng).to.not.be(coords[0]);

      // Second pan
      happen.keydown(geocoder._input, { keyCode: 40 });
      selectedEl = document.querySelector('.leaflet-pelias-selected');
      mapCenter = map.getCenter();
      coords = selectedEl.feature.geometry.coordinates;
      expect(mapCenter.lat).to.not.be(coords[1]);
      expect(mapCenter.lng).to.not.be(coords[0]);
    });

    it('fires `highlight` event', function () {
      // Also checks that `select` is not fired
      var onHighlight = sinon.spy();
      var onSelect = sinon.spy();
      geocoder.on('highlight', onHighlight);
      geocoder.on('select', onSelect);
      happen.keydown(geocoder._input, { keyCode: 40 });
      expect(onHighlight.called).to.be(true);
      expect(onSelect.called).to.be(false);
    });

    it('fires `select` event', function () {
      var onSelect = sinon.spy();
      geocoder.on('select', onSelect);
      happen.keydown(geocoder._input, { keyCode: 40 });
      happen.keydown(geocoder._input, { keyCode: 13 });
      expect(onSelect.called).to.be(true);
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

    it('collapses if: map is dragged, and a result is highlighted');
  });

  describe('#focus', function () {
    var geocoder;

    beforeEach('initialize geocoder', function () {
      geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
    });

    it('focuses on input when .focus() method is called', function () {
      geocoder.focus();

      expect(document.activeElement).to.be(geocoder._input);
    });

    it('fires `focus` event', function () {
      var onFocus = sinon.spy();
      geocoder.on('focus', onFocus);

      geocoder.focus();

      expect(onFocus.called).to.be(true);
      expect(onFocus.callCount).to.be.lessThan(2);
      expect(onFocus.args[0][0].type).to.be('focus');
    });

    it('passes an event object containing the `originalEvent` property', function () {
      var onFocus = sinon.spy();
      geocoder.on('focus', onFocus);

      geocoder.focus();

      expect(typeof onFocus.args[0][0].originalEvent).to.be('object');
    });
  });

  describe('#blur', function () {
    var geocoder;

    beforeEach('initialize geocoder', function () {
      geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
    });

    it('blurs from input when .blur() method is called', function () {
      geocoder._input.focus();
      expect(document.activeElement).to.be(geocoder._input);

      geocoder.blur();

      expect(document.activeElement).to.not.be(geocoder._input);
    });

    it('fires `blur` event', function () {
      var onBlur = sinon.spy();
      geocoder.on('blur', onBlur);

      // Focus first, then blur
      geocoder._input.focus();
      geocoder.blur();

      expect(onBlur.called).to.be(true);
      expect(onBlur.callCount).to.be.lessThan(2);
      expect(onBlur.args[0][0].type).to.be('blur');
    });

    it('passes an event object containing the `originalEvent` property', function () {
      var onBlur = sinon.spy();
      geocoder.on('blur', onBlur);

      // Focus first, then blur
      geocoder._input.focus();
      geocoder.blur();

      expect(typeof onBlur.args[0][0].originalEvent).to.be('object');
    });
  });

  describe('#reset', function () {
    var geocoder;

    beforeEach('initialize geocoder', function () {
      geocoder = new L.Control.Geocoder();
      geocoder.addTo(map);
    });

    it('clears inputs and results', function () {
      geocoder._input.value = 'foo';
      geocoder.reset();

      expect(geocoder._input.value).to.be('');
      expect(geocoder._results.children.length).to.be(0);
    });

    it('does not collapse the geocoder if expanded', function () {
      var onCollapse = sinon.spy();
      geocoder.on('collapse', onCollapse);

      geocoder.expand();
      geocoder.reset();

      expect(onCollapse.callCount).to.be.lessThan(2);
      expect(geocoder._container.className.indexOf('leaflet-pelias-expanded')).to.be.greaterThan(-1);
    });

    it('does not remove focus if present', function () {
      geocoder._input.focus();
      geocoder.reset();

      expect(document.activeElement).to.be(geocoder._input);
    });

    it('fires `reset` event', function () {
      var onReset = sinon.spy();
      geocoder.on('reset', onReset);

      geocoder.reset();

      expect(onReset.called).to.be(true);
      expect(onReset.callCount).to.be.lessThan(2);
    });
  });

  describe('Edge cases', function () {
    it('should do consecutive searches when autocomplete is off', function () {
      var geocoder = new L.Control.Geocoder({
        autocomplete: false
      });
      var stub = sinon.stub(geocoder, 'callPelias');
      geocoder.addTo(map);

      geocoder._input.value = 'foo';
      happen.keydown(geocoder._input, { keyCode: 13 });
      expect(stub.called).to.be(true);

      geocoder._input.value = 'bar';
      happen.keydown(geocoder._input, { keyCode: 13 });
      expect(stub.calledTwice).to.be(true);
    });
  });
});
