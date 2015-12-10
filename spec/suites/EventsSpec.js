describe('Events', function () {
  var geocoder;

  beforeEach('initialize geocoder', function () {
    geocoder = new L.Control.Geocoder();
  });

  // Suites borrowed from Leaflet specs to test that
  // .on(), .off(), and .fire() are present on geocoder
  // and that they behave the same as Leaflet
  describe('Leaflet event methods', function () {
    it('fires all listeners added through #addEventListener', function () {
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();
      var spy4 = sinon.spy();
      var spy5 = sinon.spy();

      geocoder.addEventListener('test', spy1);
      geocoder.addEventListener('test', spy2);
      geocoder.addEventListener('other', spy3);
      geocoder.addEventListener({test: spy4, other: spy5});

      expect(spy1.called).to.be(false);
      expect(spy2.called).to.be(false);
      expect(spy3.called).to.be(false);
      expect(spy4.called).to.be(false);
      expect(spy5.called).to.be(false);

      geocoder.fireEvent('test');

      expect(spy1.called).to.be(true);
      expect(spy2.called).to.be(true);
      expect(spy3.called).to.be(false);
      expect(spy4.called).to.be(true);
      expect(spy5.called).to.be(false);
    });

    it('#on, #off, & #fire works like #addEventListener && #removeEventListener', function () {
      var spy = sinon.spy();

      geocoder.on('test', spy);
      geocoder.fire('test');

      expect(spy.called).to.be(true);

      geocoder.off('test', spy);
      geocoder.fireEvent('test');

      expect(spy.callCount).to.be.lessThan(2);
    });
  });

  // TODO: Have test results to use
  describe.skip('on `results`', function () {
    it('fires `results` after receiving results from /autocomplete', function () {
      // TODO
      // Test for properties on the event object
    });
    it('fires `results` after receiving results from /search', function () {
      // TODO
      // Test for properties on the event object
    });
    it('does not fire `results` if request has errored', function () {
      // TODO
    });
  });

  // 'select', 'highlight', 'reset' are in InterfaceSpec

  describe('on `expand` and `collapse`', function () {
    it('fires `expand` and `collapse`', function () {
      // Geocoder must be added to the map so that it can be "clicked"
      var map = L.map(document.createElement('div'));
      var geocoder = new L.Control.Geocoder();
      var onExpand = sinon.spy();
      var onCollapse = sinon.spy();

      geocoder.addTo(map);
      geocoder.on('expand', onExpand);
      geocoder.on('collapse', onCollapse);

      happen.click(geocoder._search);
      expect(onExpand.called).to.be(true);

      happen.click(geocoder._search);
      expect(onCollapse.called).to.be(true);

      expect(onExpand.callCount).to.be.lessThan(2);
      expect(onCollapse.callCount).to.be.lessThan(2);
    });

    it('does not fire if geocoder is always expanded', function () {
      var map = L.map(document.createElement('div'));
      var geocoder = new L.Control.Geocoder({ expanded: true });
      var onExpand = sinon.spy();
      var onCollapse = sinon.spy();

      geocoder.addTo(map);
      geocoder.on('expand', onExpand);
      geocoder.on('collapse', onCollapse);

      expect(onExpand.called).to.be(false);

      happen.click(geocoder._search);
      expect(onCollapse.called).to.be(false);
    });

    it('does not fire if map is clicked and geocoder is already collapsed', function () {
      var map = L.map(document.createElement('div'));
      var geocoder = new L.Control.Geocoder();
      var onCollapse = sinon.spy();

      geocoder.addTo(map);
      geocoder.on('collapse', onCollapse);

      happen.click(map);
      expect(onCollapse.called).to.be(false);
    });
  });
});
