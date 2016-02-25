## v1.5.1 (February 25, 2016)

- Fix a bug where the results box is displayed when there is nothing in it. The effect was only noticeable when the results box is styled in a way that gives it dimension (e.g. a border or a minimum height).

## v1.5.0 (February 24, 2016)

- Autocomplete responses are now filtered by the layers requested.
- If the geocoding service returns an error, these are now displayed.
- Add media query support for point and polygon icons for high-pixel-density displays.
- Use exact pixel size point and polygon icons (also fixes icons not displaying properly in IE8)
- Results list should now hide when users interact with the map.
- **Experimental: Added basic support for the `/place` endpoint.** When a place result is selected, it will then query the [`/place` endpoint](https://mapzen.com/documentation/search/place/). Responses from the `/place` endpoint are not currently handled by the geocoder UI, but users can handle it themselves by listening for the `results` event, and the event object passed to the callback function will have its `requestType` property set to `place`. Currently, this behavior is disabled but can be enabled by setting `place: true` in options.
- Fix a bug where error messages were not being displayed in IE8 and Firefox.
- Fix a bug where an empty results dropdown can be displayed when input is deleted faster than the rate at which autocomplete responses are received [#94](https://github.com/mapzen/leaflet-geocoder/pull/94)
- Fix a bug where if autocomplete is turned off, subsequent searches will not work. [#104](https://github.com/mapzen/leaflet-geocoder/issues/104)
- Add a `.focus()` convenience method to focus on the geocoder input. Document the `.blur()` method.

## v1.4.1 (December 15, 2015)

- Added a request header to require JSON responses, to handle custom endpoints that do not serve JSON by default. (by [@alculquicondor](https://github.com/alculquicondor)) [#90](https://github.com/mapzen/leaflet-geocoder/pull/90)
- Fixed a regression where layer icons are not aligned correctly when the line-height is taller than normal (e.g. on mobile).

## v1.4.0 (December 11, 2015)

- **Now hosted by cdnjs!** [Link to project page](https://cdnjs.com/libraries/leaflet-geocoder-mapzen)
- `pointIcon` and `polygonIcon` options now explicitly accept boolean `true` or `false` values, with `true` being the default. Setting this to `true` will now use the same image path as previous versions, but with one important difference: it's relative to the stylesheet, rather than the script that instantiated the geocoder. This will be more in line with expected behavior for most use cases. To customize the location or filename, you can still pass in a path for the desired image.
- Added the ability to omit the first API key parameter when instantiating the geocoder, for custom API endpoints (running Pelias) that do not require an API key.
- Improved and documented the geocoder's internal `.collapse()` and `.expand()` methods.
- Fixed a bug where clicking on the map when the geocoder is already collapsed will continue to fire collapse events. [#83](https://github.com/mapzen/leaflet-geocoder/issues/83)
- Optimized image sizes losslessly with optipng. (by [@PeterDaveHello](https://github.com/PeterDaveHello)) [#88](https://github.com/mapzen/leaflet-geocoder/pull/88)
- Removed executable permissions from image files. (by [@PeterDaveHello](https://github.com/PeterDaveHello)) [#87](https://github.com/mapzen/leaflet-geocoder/pull/87)
- Continued improving test coverage.

## v1.3.0 (December 7, 2015)

### Project name change

**This project is renamed to leaflet-geocoder-mapzen. Why did we do this?**

This plugin was designed for "getting started" in mind. Most users have signed up for API keys with [Mapzen Search](https://mapzen.com/projects/search) and want to put a geocoder UI on their map application with a minimal amount of hassle. In the interest of keeping a clear distinguishing line between Mapzen Search (the hosted service with an API key) and Pelias (the open-source geocoding engine) we felt that naming the project this way would be less confusing. And we wanted to do it earlier rather than later.

This might qualify as a breaking change that would require a major version bump according to [Semantic Versioning](http://semver.org/), but, there wouldn't be any new features added, so it would be a waste of a version number. You could think of this project as a fork or a separate project entirely, even though the repository has changed ownership to Mapzen to preserve things like issues and permissions.

The original project located at https://github.com/pelias/leaflet-geocoder, and its corresponding npm and bower packages, **are now deprecated.** There are placeholders there now to preserve functionality and to redirect users, but in the future, we will delete it.

To migrate from `pelias-leaflet-geocoder` to `leaflet-geocoder-mapzen`, here are the changes you should make (if they apply to your project):

#### Installing the package

- **If installing from npm,** update `package.json` to use the `leaflet-geocoder-mapzen` package instead of `pelias-leaflet-geocoder`.
- **If installing from bower,** update `bower.json` to use the `leaflet-geocoder-mapzen` package instead of `pelias-leaflet-geocoder`.
- **If the package is downloaded directly from GitHub,** update your scripts to refer to the repository at `github.com/mapzen/leaflet-geocoder` instead of `github.com/pelias/leaflet-geocoder`.

#### Linking to plugin files

**Module loading systems**

Since the package name has changed, you need to `require()` or `import` from the new package name.

**Filenames in the `dist/` folder have changed.**

If you are linking to any of the files directly (like the stylesheet, for example), you'll need to update the filename references.

For example:

```html
<link rel="stylesheet" href="pelias-leaflet-geocoder.css">
<script src="pelias-leaflet-geocoder.js"></script>
```

Becomes:

```html
<link rel="stylesheet" href="leaflet-geocoder-mapzen.css">
<script src="leaflet-geocoder-mapzen.js"></script>
```

If you are referring to any hosted versions of these files, please update those links as well. (We have not encouraged this use case previously; better support will be announced in the future when the plugin can be hosted on a supported CDN.)

#### What about class names?

Despite the `pelias` prefix used throughout, updating class names now would probably be a headache for everyone. **So there are no changes to class names.** We may revisit this in v2 of the plugin.

#### Miscellaneous

Default attribution has been changed to "Geocoding by Mapzen" with a link to Mapzen Search.

## v1.2.0 (December 1, 2015)

- **Added events.** The geocoder now fires the following events that can be subscribed to: `results`, `error`, `select`, `highlight`, `expand`, `collapse` and `reset`. These allow applications to respond to interactions with the plugin, and will also pass along relevant data (like address labels and latitude/longitude pairs) received from the geocoder. [See the README for more information.](https://github.com/mapzen/leaflet-geocoder/blob/master/README.md#events) ([#40](https://github.com/mapzen/leaflet-geocoder/issues/40), [#75](https://github.com/mapzen/leaflet-geocoder/issues/75))
- Simplified test procedure so that it no longer requires a global install of [`jake`](http://jakejs.com/) and tests can be run locally with a standard `npm test` command.
- Fixed a bug where pressing the up and down keys will throw errors when the results list is empty.
- DEMO: Update [Refill](https://github.com/tangrams/refill-style/) base map location.

## v1.1.0 (November 11, 2015)

- Added the ability for the `bounds` option to also accept rectangular bounds in simple Array form, which is expected of Leaflet methods that accept LatLngBounds objects.
- Improved results list so that when a user is navigating the list with the keyboard, results that are not in view will scroll into view. [#34](https://github.com/mapzen/leaflet-geocoder/issues/34)
- Fixed falsy values on point and polygon icons not actually being disabled. (by [@bdon](https://github.com/bdon)) [#61](https://github.com/mapzen/leaflet-geocoder/pull/61)
- Fixed a bug where `scrollWheelZoom` is always enabled after some interactions with search results, if this option was previously disabled using `map.scrollWheelZoom.disable()`.
- Fixed result list z-index ordering for Leaflet v1-beta.2.
- Prevented result highlighting from inserting empty tags into the DOM when the input is blank.

## v1.0.1 (October 9, 2015)

- Fixed some inputs from being parsed as regex when highlighting results. [#25](https://github.com/mapzen/leaflet-geocoder/issues/25)
- DOCUMENTATION: Fixed badge links going to an old branch.
- DEMO: Change base map style.

## v1.0.0 (October 5, 2015)

### Breaking changes

- The default endpoint is now Mapzen Search service, powered by Pelias v1.0.
- An API key is required to use Mapzen Search service. You can get a free API key from the [Mapzen developers portal](https://mapzen.com/developers/).
- File and directory structure reworked in accordance to [Leaflet Plugin Authoring Guide](http://leafletjs.com/2013/06/28/leaflet-plugin-authoring-guide.html).
- `hide_other_controls` is removed.
- `drop_pin` is renamed to `markers`.
- `bbox` is renamed to `bounds` to match Leaflet terminology.
- `latlon` is renamed to `latlng` to match Leaflet terminology.
- `expanded` now defaults to `false`. Please set it to `true` explicitly if that is your desired behavior.
- All options names that were previously snake_case are now camelCase.
- CSS class names are now namespaced to `.leaflet-pelias-*` instead of `.pelias-*`. This may affect style overrides.

### New features

- Support for Bower and npm package install
- Support module loading systems (e.g. CommonJS / AMD)
- `markers` (formerly `drop_pin`) option can accept a Leaflet Marker options object for customizable markers.
- `fullWidth` (formerly `full_width`) no longer hard codes a default mobile breakpoint. It now accepts any integer to use as a breakpoint (default remains `650` pixels). The plugin will also now resize the full-width of the input if the window size changes, which allows custom breakpoints to be meaningful for responsive design.
- New `autocomplete` option allows customizing whether results are obtained on each keystroke or only after a user presses Enter. This can help reduce queries if you need to manage your API usage.
- Support for IE8 and IE9.
- The plugin no longer attempts to "detect" a mobile environment. It relies on Leaflet's `leaflet-touch` state to alter behavior for touch-enabled environments.
- There is now support for collapsed state of the input bar. Clicking the search icon toggles the expanded state of the input, if `expanded` is not `true`.
- Improved documentation and examples.
- Added code linting ([Semistandard](https://github.com/Flet/eslint-config-semistandard)) and tests.

### Bug fixes

- If `fullWidth` is true, an expanded input box is now constrained to the width of the map container rather than the window.
- Fix a bug where typing one character into the input box improperly hides the close button.
- If geocoder is placed on the bottom of the map, the results box should now open above the input.

### Styling

- All styles have been revamped for better integration with Leaflet.
- Search/loading icon is now a separate DOM element from the input box for easier customization.
- Resize default background images to appear at the correct size in IE8.

## v0.0.2

- added layer customization to build a coarse/address geocoders easily

## v0.0.1

- initial release
- supports lat/lon, bbox, placeholder
