## v1.0.0-alpha
### Breaking changes
- TODO: Pelias 1.0 API
- An API key is required to use Mapzen's Pelias service. You can get a free API key from the [Mapzen developers portal](https://mapzen.com/developers/).
- `hide_other_controls` is removed.
- `drop_pin` is renamed to `markers`.
- `expanded` now defaults to `false`. Please set it to `true` explicitly if that is your desired behavior.
- All options names that were previously snake_case are now camelCase.
- CSS class names are now namespaced to `.leaflet-pelias-*` instead of `.pelias-*`. This may affect style overrides.

### New features
- Support for Bower and npm package install
- Support module loading systems (e.g. CommonJS / AMD)
- `markers` option can accept a Leaflet Marker options object for customizable markers.
- `full_width` (renamed `fullWidth`) no longer hard codes a mobile breakpoint. It now accepts any integer to use as a breakpoint (default remains `650` pixels).
- The plugin no longer attempts to "detect" a mobile environment. It relies on Leaflet's `leaflet-touch` state to alter behavior for touch-enabled environments.
- There is now support for collapsed state of the input bar. Clicking the search icon toggles the expanded state of the input, if `expanded` is not `true`.

### Bug fixes
- If `fullWidth` is true, an expanded input box is now constrained to the width of the map container rather than the window.
- Fix a bug where typing one character into the input box improperly hides the close button.
- If geocoder is placed on the bottom of the map, the results box should now open above the input.

### Styling
- All styles have been revamped for better integration with Leaflet.
- Search/loading icon is now a separate DOM element from the input box for easier customization.
- Resize background images to appear at the correct size in <IE8.

## v0.0.2

- added layer customization to build a coarse/address geocoders easily

## v0.0.1

- initial release
- supports lat/lon, bbox, placeholder
