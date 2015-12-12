Contributing
============

## Reporting bugs

You can report bugs on the project's [issues tracker](https://github.com/mapzen/leaflet-geocoder/issues).

Before filing an issue, please make sure that your bug is not caused by [Leaflet](http://leafletjs.com/) or your application code (e.g. passing incorrect arguments to methods, etc.). Second, search the already reported issues for similar cases, and if it's already reported, just add any additional details in the comments.

After you've made sure that you've found a new geocoder plugin bug, here are some tips for creating a helpful report that will make fixing it much easier and quicker:

 * Write a **descriptive, specific title**. Bad: *Problem with search*. Good: *Searching for X in IE9 causes Z*.
 * Include **browser, OS and Leaflet version** info in the description.
 * Check whether the bug can be reproduced in **other browsers**.
 * *Bonus:* create a **simple test case** that demonstrates the bug (e.g. using [JSFiddle](http://jsfiddle.net/) or [JS Bin](http://jsbin.com/)).

If you just want some help with your project, try asking [in our Gitter chatroom](https://gitter.im/pelias/pelias) instead.

## Requesting features and contributing code

We're happy to accept pull requests and patches for this plugin. Below are some guidelines for making sure the geocoder plugin is high quality and useful for everyone.

 * Keep it simple. Bugfixes, performance optimizations and small improvements that don't add a lot of code are much more likely to get accepted quickly.
 * Before adding a new feature, ask yourself whether this important enough to be required for everyone. Will a different third-party application developer need different assumptions?
 * Whenever possible, follow the [Leaflet plugin authoring guide](
http://leafletjs.com/2013/06/28/leaflet-plugin-authoring-guide.html). Use Leaflet syntax to make it more comfortable for map developers to stay in a "Leaflet mental model." (e.g. `bounds` instead of the Pelias-equivalent term `bbox`.)

Additionally, we would greatly appreciate it if pull requests and improvements also included corresponding tests and documentation updates.

### Writing code

There is not currently a build system for the code. The plugin's JavaScript and CSS are written as single files in the `dist` folder. This may change in the future if the project becomes more complex or if it is preferred by our users.

[![js-semistandard-style](https://cdn.rawgit.com/flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)

Code style is enforced by Flet's [SemiStandard Javascript Style](https://github.com/Flet/semistandard). One noticeable difference from Leaflet's code style is that the library uses spaces for indentation as opposed to tabs.

### Testing code

Please run tests before making a pull request. We also use CircleCI to run tests on each commit and pull request, and we will only accept pull requests that pass.

Tests are still a work in progress and coverage is low so just because tests pass does not ensure 100% compatibility yet.

Our testing infrastructure is the same as Leaflet core. It uses [Node](http://nodejs.org/), and the [Jake](http://jakejs.com/) Javascript build tool.
To set up the test system, install Node, then install project dependencies from npm into the project root:

```
npm install
```

To run the tests from the command line:

```
npm test
```

To run the tests in a browser manually, open `spec/index.html`.

## Documentation and examples

Currently, documentation is in the form of short, simple examples in [README.md](README.md). If there is a something that would benefit from a real world example, please drop a one-file example page into the `examples` folder.

Examples should be short and demonstrate one thing at a time.

## Thank you

Thanks so much for contributing to the Mapzen Search / Pelias geocoder plugin for Leaflet. We, and future generations of map enthusiasts, thank you. 🖖
