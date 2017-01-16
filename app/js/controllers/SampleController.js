(function () {
    'use strict';

    function SampleController($scope) {
        $scope.msg = 'Hello from SampleController (new version)!';
    }

    angular.module('sample-with-tests')
        .controller('SampleController', SampleController);
})();
