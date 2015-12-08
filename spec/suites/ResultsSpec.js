// Read sample results data
function loadJSON (path, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', path, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4 && xobj.status === 200) {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

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
      geocoder.showResults([]);

      expect(el.querySelector('.leaflet-pelias-message').textContent).to.be.a('string');
    });

    it('displays results', function () {
      geocoder.showResults(results.features);

      // No message should be shown
      expect(el.querySelector('.leaflet-pelias-message')).to.not.be.ok();

      // Results elements should be present
      expect(el.querySelectorAll('.leaflet-pelias-result').length).to.be(10);
      expect(el.querySelector('.leaflet-pelias-result').feature).to.be.an('object');
      expect(el.querySelector('.leaflet-pelias-result').textContent).to.be.a('string');
    });

    it('highlights snippets of the text label with the query text', function () {
      geocoder._input.value = 'french';
      geocoder.showResults(results.features);

      expect(el.querySelector('.leaflet-pelias-result').innerHTML).to.contain('<strong>French</strong>');
    });
  });

  it('throws away stale results');
  it('highlights results when up or down arrow keys are pressed');
  it('selects a highlighted result when the enter key is pressed');
  it('selects a result when it is clicked on');
});
