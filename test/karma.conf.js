/*global module:false*/

module.exports = function (config) {
    'use strict';

    config.set({
        autoWatch: false,
        basePath: '../',
        frameworks: ['jasmine'],

        jasmineNodeOpts: {
            defaultTimeoutInterval: 30000,
            isVerbose: true,
            showColors: true,
            includeStackTrace: true
        },
        browserNoActivityTimeout: 30000,

        files: [
            // bower:js
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/es5-shim/es5-shim.js',
            // endbower
            'app/js/app.js',
            'app/js/**/*.js',
            'app/views/*.html',
            'test/unit/**/*.js',
            {pattern: 'src/images/*', watched: false, included: false, served: true}
        ],
        exclude: [],

        port: 9001,

        browsers: [
            'PhantomJS'
        ],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-junit-reporter'
        ],

        singleRun: false,

        colors: true,
        logLevel: config.LOG_INFO,

        proxies: {
            '/_karma_/images/': '/base/src/images/'
        },
        urlRoot: '_karma_',

        reporters: ['progress', 'coverage', 'junit'],

        preprocessors: {
            'app/js/{,*/}*.js': ['coverage']
        },

        coverageReporter: {
            dir: 'test-results',
            reporters: [
                {type: 'cobertura', subdir: '.'},
                {type: 'html', subdir: 'html'}
            ]
        },

        junitReporter: {
            outputDir: 'test-results',
            outputFile: 'unit-test-results.xml',
            suite: ''
        }
    });
};
