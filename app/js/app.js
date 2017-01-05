(function () {
    'use strict';

    angular
        .module('sample-with-tests', ['ngRoute'])
        .config(['$routeProvider', '$locationProvider',
            function ($routeProvider, $locationProvider) {
                $routeProvider
                    .when('/', {
                        controller: 'SampleController',
                        templateUrl: 'views/content.html'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });

                $locationProvider.html5Mode(true);
            }
        ]);
})();
