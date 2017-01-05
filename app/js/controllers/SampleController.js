(function () {
    'use strict';

    function SampleController($scope) {
        $scope.msg = 'Hello from SampleController!';
    }

    angular.module('sample-with-tests')
        .controller('SampleController', SampleController);
})();
