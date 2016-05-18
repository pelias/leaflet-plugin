/*
Task runner for testing and linting scripts.
Based off of Leaflet's own test suite.

To use, install Node, then install project dependencies from the project root:

    npm install

To check the code & run tests:

    npm test

*/
/* global jake, desc, task, complete */

var path = require('path');

function hint (msg, path) {
  return function () {
    var command = 'node node_modules/.bin/eslint ' + path;
    var done = function () {
      console.log('\tCheck passed.\n');
      complete();
    };

    console.log(msg);
    jake.exec(command, { printStdout: true }, done);
  };
}

function test (complete, fail) {
  var karma = require('karma');
  var testConfig = {
    configFile: path.join(__dirname, '/spec/karma.conf.js')
  };

  testConfig.browsers = ['PhantomJS'];

  function isArgv (optName) {
    return process.argv.indexOf(optName) !== -1;
  }

  if (isArgv('--chrome')) {
    testConfig.browsers.push('Chrome');
  }
  if (isArgv('--safari')) {
    testConfig.browsers.push('Safari');
  }
  if (isArgv('--ff')) {
    testConfig.browsers.push('Firefox');
  }
  if (isArgv('--ie')) {
    testConfig.browsers.push('IE');
  }

  if (isArgv('--cov')) {
    testConfig.preprocessors = {
      'src/**/*.js': 'coverage'
    };
    testConfig.coverageReporter = {
      type: 'html',
      dir: 'coverage/'
    };
    testConfig.reporters = ['coverage'];
  }

  var server = new karma.Server(testConfig, function (exitCode) {
    if (!exitCode) {
      console.log('\tTests ran successfully.\n');
      complete();
    } else {
      process.exit(exitCode);
    }
  });

  console.log('Running tests...');
  server.start();
}

desc('Check plugin JavaScript for errors with Semistandard');
task('lint', { async: true }, hint('Checking for JS errors...', 'dist/*.js'));

desc('Check specs & support JavaScript for errors with Semistandard');
task('lintspec', { async: true }, hint('Checking for specs & support JS errors...', 'spec/suites/*.js *.js'));

desc('Run PhantomJS tests');
task('test', { async: true }, function () {
  test(complete);
});

task('default', ['lint', 'lintspec', 'test']);

jake.addListener('complete', function () {
  process.exit();
});
