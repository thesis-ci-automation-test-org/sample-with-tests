(function () {
    'use strict';

    function Sample() {
        var factory = {};

        factory.myMethod = function myMethod(p) {
            if (p) {
                return 2;
            } else {
                return 3;
            }
        };

        return factory;
    }

    angular.module('sample-with-tests')
        .factory('Sample', Sample);
})();
