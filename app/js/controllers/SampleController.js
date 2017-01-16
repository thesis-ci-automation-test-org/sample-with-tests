(function () {
    'use strict';

    function SampleController($scope) {
        $scope.msg = 'Hello from SampleController (new version 2)!';
    }

    angular.module('sample-with-tests')
        .controller('SampleController', SampleController);
})();
