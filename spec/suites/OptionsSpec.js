describe('Options', function () {
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

  describe('placeholder', function () {
    it('should display custom placeholder text', function () {
      var geocoder = new L.Control.Geocoder(null, { placeholder: 'a' });
      geocoder.addTo(map);
      expect(geocoder._input.placeholder).to.be('a');
    });

    it('should have no placeholder text if empty string is assigned to it', function () {
      var geocoder = new L.Control.Geocoder(null, { placeholder: '' });
      geocoder.addTo(map);
      expect(geocoder._input.placeholder).to.be('');
    });

    it('should have no placeholder text if `null` is assigned to it', function () {
      var geocoder = new L.Control.Geocoder(null, { placeholder: null });
      geocoder.addTo(map);
      expect(geocoder._input.placeholder).to.be('');
    });

    it('should have no placeholder text if `undefined` is assigned to it', function () {
      var geocoder = new L.Control.Geocoder(null, { placeholder: undefined });
      geocoder.addTo(map);
      expect(geocoder._input.placeholder).to.be('');
    });
  });

  describe('title', function () {
    it('should display custom title text', function () {
      var geocoder = new L.Control.Geocoder(null, { title: 'a' });
      geocoder.addTo(map);
      expect(geocoder._input.title).to.be('a');
    });

    it('should have no title text if empty string is assigned to it', function () {
      var geocoder = new L.Control.Geocoder(null, { title: '' });
      geocoder.addTo(map);
      expect(geocoder._input.title).to.be('');
    });

    it('should have no title text if `null` is assigned to it', function () {
      var geocoder = new L.Control.Geocoder(null, { title: null });
      geocoder.addTo(map);
      expect(geocoder._input.title).to.be('');
    });

    it('should have no title text if `undefined` is assigned to it', function () {
      var geocoder = new L.Control.Geocoder(null, { title: undefined });
      geocoder.addTo(map);
      expect(geocoder._input.title).to.be('');
    });
  });

  describe('layer icons', function () {
    it('sets the point icon', function () {
      var geocoder = new L.Control.Geocoder({ pointIcon: 'foo' });
      var geocoder2 = new L.Control.Geocoder({ pointIcon: true });
      var geocoder3 = new L.Control.Geocoder({ pointIcon: false });

      expect(geocoder.options.pointIcon).to.be('foo');
      expect(geocoder2.options.pointIcon).to.be(true);
      expect(geocoder3.options.pointIcon).to.be(false);
    });

    it('sets the polygon icon', function () {
      var geocoder = new L.Control.Geocoder({ polygonIcon: 'bar' });
      var geocoder2 = new L.Control.Geocoder({ polygonIcon: true });
      var geocoder3 = new L.Control.Geocoder({ polygonIcon: false });

      expect(geocoder.options.polygonIcon).to.be('bar');
      expect(geocoder2.options.polygonIcon).to.be(true);
      expect(geocoder3.options.polygonIcon).to.be(false);
    });
  });

  describe('expanded', function () {
    describe('when true', function () {
      var geocoder;
      var options = {
        expanded: true
      };

      beforeEach(function () {
        geocoder = new L.Control.Geocoder(null, options);
        geocoder.addTo(map);
      });

      it('should be in the expanded state when added to the map', function () {
        expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
      });

      it('should focus on the input when I click on search icon', function () {
        happen.click(geocoder._search);
        expect(document.activeElement.className).to.equal('leaflet-pelias-input');
      });

      it('should not collapse when I click the search icon', function () {
        happen.click(geocoder._search);
        expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
      });

      it('should collapse if the .collapse() method is called', function () {
        geocoder.collapse();
        expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(false);
      });

      it('should expand again if .collapse() is called and then I click the search icon', function () {
        geocoder.collapse();
        happen.click(geocoder._search);
        expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
      });
    });

    describe('when false', function () {
      var geocoder;
      var options = {
        expanded: false
      };

      beforeEach(function () {
        geocoder = new L.Control.Geocoder(null, options);
        geocoder.addTo(map);
      });

      it('should be in the collapsed state when added to the map', function () {
        expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(false);
      });

      it('should expand the input from a collapsed state, when I click on search icon', function () {
        happen.click(geocoder._search);
        expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
      });

      it('should collapse the input when I click the search icon', function () {
        happen.click(geocoder._search);
        happen.click(geocoder._search);
        expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(false);
      });

      it('should toggle betwen expanded / collapsed state properly when I click the search icon', function () {
        var times = 5;
        while (times > 0) {
          happen.click(geocoder._search);
          times--;
        }
        expect(geocoder.getContainer().classList.contains('leaflet-pelias-expanded')).to.be(true);
      });
    });
  });
});
