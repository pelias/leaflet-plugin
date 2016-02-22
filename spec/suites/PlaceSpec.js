describe('Place', function () {
  var map;
  var el;
  var geocoder;

  var selected = {
    feature: {
      'type': 'Feature',
      'properties': {
        'id': '5128638',
        'gid': 'gn:region:5128638',
        'layer': 'region',
        'source': 'gn',
        'name': 'New York',
        'country_a': 'USA',
        'country': 'United States',
        'region': 'New York',
        'region_a': 'NY',
        'confidence': 0.942,
        'distance': 282.347,
        'label': 'New York, NY'
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-75.4999, 43.00035]
      }
    }
  };

  beforeEach('initialize map', function () {
    el = document.createElement('div');
    // DOM needs to be visible: appended to the body and have dimensions
    // in order for .focus() to work properly
    // el.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(el);
    map = L.map(el);

    geocoder = new L.Control.Geocoder({ place: true });
    geocoder.addTo(map);
  });

  afterEach('destroy map', function () {
    map.remove();
    document.body.removeChild(el);
  });

  it('selecting a result makes a /place request when enabled', function () {
    // Logic happens in geocoder.setSelectedResult()
    var stub = sinon.stub(geocoder, 'place');
    geocoder.options.place = true;
    geocoder.setSelectedResult(selected, null);
    expect(stub.called).to.be(true);
  });

  it('selecting a result does not makes a /place request when disabled', function () {
    // Logic happens in geocoder.setSelectedResult()
    var stub = sinon.stub(geocoder, 'place');
    geocoder.options.place = false;
    geocoder.setSelectedResult(selected, null);
    expect(stub.called).to.be(false);
  });

  it('makes a /place request to the service', function () {
    var stub = sinon.stub(geocoder, 'callPelias');
    geocoder.place('foo');
    expect(stub.called).to.be(true);
  });
});
