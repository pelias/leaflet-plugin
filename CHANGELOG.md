## v1.9.4 (September 5, 2017)

- Minor under-the-hood tweaks to improve compatibility upstream in [mapzen.js](https://github.com/mapzen/mapzen.js).

## v1.9.3 (August 28, 2017)

- **Bug fix:** Fixed an exception when attempting to remove attribution when no attribution object existed. Thanks @JoaoMosmann for your [PR](https://github.com/mapzen/leaflet-geocoder/commit/2b9ba8c334c5530172fb30e866b2c873c40de56f)

## v1.9.2 (April 25, 2017)

- Real small tweak: higher-resolution images now show up on devices that support it, but don't quite have the resolution of Apple Retina devices.
- **Bug fix:** Fixed a reference to the [`@mapbox/corslite`](https://www.npmjs.com/package/corslite) library under the hood. A wrong reference broke the v1.9.1 build.

**The v1.9.1 build is broken; do not use it!**

## v1.9.0 (April 5, 2017)

- **It is now possible to set the return value of `require()` or `import` to a variable.** You can now do this:

```javascript
var MyGeocoder = require('leaflet-geocoder-mapzen')
var geocoder = new MyGeocoder()
```

This sets the `require('leaflet-geocoder-mapzen')` to `MyGeocoder`, which you can then instantiate with the `new` keyword at a later time. Previously, setting the return value of the `require()` or `import` did nothing. In order not to break existing functionality, the side-effect of attaching to `L.Control.Geocoder` still happens automatically when the module is imported. [#154](https://github.com/mapzen/leaflet-geocoder/issues/154)

- If you want to prevent the side-effect of attaching to `L`, you can import the `core` module directly:

```javascript
// Requiring only the base container (no L namespace)
var Geocoder = require('leaflet-geocoder-mapzen/src/core')
// or in ES2015
import Geocoder from 'leaflet-geocoder-mapzen/src/core'
// ...
const geocoder = new Geocoder()

const nope = new L.Control.Geocoder() // will be undefined
```

- Under the hood, the plugin's implementation of AJAX requests have been swapped out in favor of Mapbox’s [`corslite`](https://www.npmjs.com/package/corslite) module.

## v1.8.2 (April 3, 2017)

- Small tweak in how we call the `/place` endpoint on Mapzen Search: we will no longer make these requests when a feature does not have a `gid` property.
- Fixed a bug in a rare situation where the map would suddenly stop responding to a scroll wheel interaction.

## v1.8.1 (March 16, 2017)

- Fixed a bug where the input would display "undefined" instead of the actual text when navigating through a result dropdown with arrow keys in IE8.

## v1.8.0 (March 9, 2017)

- **Added customizable text strings!** By popular request, text strings used in the geocoder control can now be customized to your liking. This also enables localisation of the plugin to a different language. For example, [check out this geocoder in Korean](https://mapzen.github.io/leaflet-geocoder/examples/custom-strings.html). (with @hanbyul-here, [#120](https://github.com/mapzen/leaflet-geocoder/issues/120))
- **Deprecated `title` option!** Now that `textStrings` option is here, the `title` option is deprecated. It will currently alias to `textStrings.RESET_TITLE_ATTRIBUTE`, but logs a warning to the console if you use it. The preferred way is to set the `textStrings.RESET_TITLE_ATTRIBUTE` property directly. (Note: the `placeholder` option will not be deprecated, since it is frequently used, and remains convenient to keep around. Similarly, it now aliases to `textStrings.INPUT_PLACEHOLDER`.)
- **You can now force a result to always drop a marker with the `overrideBbox` option.** Previously, a search result would zoom to a bounding box instead of dropping a point marker if bounding box data was available, which made sense for large areas where showing the region was more important than its centroid. However, some people expected point markers to always be dropped. While it was possible to handle selection events yourself and write your own code to always drop markers, we felt that providing the option to do this automatically would be much easier. If the `overrideBbox` option is `true` (and  `markers` is not `false`), selecting a result will always drop a marker, regardless of whether bounding box data is available. [#129](https://github.com/mapzen/leaflet-geocoder/issues/129)
- **Results from the venue and address layers will always drop markers.** Sometimes, venue and address results come with a bounding box. This meant that markers were not dropped for these small areas, even though a point marker would make more sense. As a quality-of-life improvement we now always drop a point marker for these kinds of results. [#129](https://github.com/mapzen/leaflet-geocoder/issues/129)
- Pressing up / down through a list of results now populates the input with that result's label, which is more in line with user expectations for an autocomplete dropdown (for extra web nerdiness, read the [WAI-ARIA Authoring Practices 1.1 Working Draft 17 March 2016 section on auto complete design patterns](https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/#autocomplete). [#110](https://github.com/mapzen/leaflet-geocoder/issues/110)
- Added an example to show how you can control the map’s zoom level when a result is selected. [#62](https://github.com/mapzen/leaflet-geocoder/issues/62) (and thanks to @skorasaurus for the help)
- Added an example to show how you can show region boundary geometry with a secondary request to [Who’s on First](https://whosonfirst.mapzen.com). [#86](https://github.com/mapzen/leaflet-geocoder/issues/86)
- Improved compatibility with Leaflet v1's `Evented` object. [#150](https://github.com/mapzen/leaflet-geocoder/issues/150)

## v1.7.1 (August 23, 2016)

- The previous release changed our publishing process, so v1.7.0 was released without any CSS or minified files. 😞 It's now deprecated. Please update your packages to v1.7.1 to get those files back! [#140](https://github.com/mapzen/leaflet-geocoder/issues/140)

## v1.7.0 (August 12, 2016)

- **Deprecated!** Because of a bug in changing publishing process (the last bullet point in this section). Please use v1.7.1 instead.
- **Added a `.reset()` method.** For developers that need to interact with the geocoder programmatically, a single method that resets the input and results is pretty handy. This breaks an undocumented internal method, but you weren't using that anyway, right? 😉 (with [@Abbe98](https://github.com/Abbe98), see [#133](https://github.com/mapzen/leaflet-geocoder/pull/133))
- **Added support for `focus` and `blur` event listeners.** You can now attach handlers for those events directly to the geocoder instance. It forwards the same DOM events from the input element, so developers have a more convenient way of tapping into them. [#117](https://github.com/mapzen/leaflet-geocoder/issues/133)
- We've implemented an internal process change: the code is now stored in the `src` directory, and only copied to `dist` when we publish the package. [#137](https://github.com/mapzen/leaflet-geocoder/issues/137)

## v1.6.3 (July 26, 2016)

- This is a dependency maintenance release. All dependencies have been updated and fixed to a specific version.
- The `peerDependency` range has been relaxed to allow any version of the Leaflet v1 release candidate. You can now use this plugin in a project with the recently released `leaflet@1.0.0-rc.2` or an older `leaflet@1.0.0-beta.1` without seeing a peer dependency error.

## v1.6.2 (May 25, 2016)

- Small tweak: the height of each result on touch devices was too large, so nudge it down a bit.

## v1.6.1 (May 19, 2016)

- Fixed a bug where the reset button (the `×`) remained visible if the `.collapse()` method was called while there was still something in the input box.

## v1.6.0 (May 18, 2016)

- The geocoder now has a `.version` property. Sometimes you just need to know.
- The `latlng` option has been renamed to `focus` to be closer to the syntax for [Mapzen Search](https://mapzen.com/documentation/search/search/). Also, the behavior has changed to automatically prioritize results closer to the current view by default. You can turn this off by explicitly setting `focus: false`. The `latlng` property will still work but we will display a deprecation warning and remove it in the next major version.
- Mapzen Search API accepts many query parameters (such as for filtering, bounding results, and so on) that don't have a corresponding convenience option in this plugin. Rather than support each option individually, we now provide a **params** option which allows developers to pass through any parameter they wish to the API. Valid parameters will be anything that is covered in the [Mapzen Search documentation](https://mapzen.com/documentation/search/) (so please read it carefully), but the plugin will not throw away invalid parameters in case new parameters are supported in the future.

## v1.5.2 (April 18, 2016)

- Mapzen Search API supports the `layers` parameter natively for autocomplete queries now! For more information, see this issue: https://github.com/pelias/api/issues/449. We removed all the code from this plugin that did the filtering on the client side, which was no longer needed.

## v1.5.1 (February 25, 2016)

- Fixed a bug where the results box is displayed when there is nothing in it. The effect was only noticeable when the results box is styled in a way that gives it dimension (e.g. a border or a minimum height).

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
