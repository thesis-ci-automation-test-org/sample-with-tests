(function () {
    'use strict';

    describe('SampleController', function () {
        beforeEach(module('sample-with-tests'));

        var controller, scope;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            controller = $controller('SampleController', {
                $scope: scope
            });

        }));

        it('is defined', function () {
            expect(controller).toBeDefined();
        });

        it('defines a msg in scope', function () {
            expect(scope.msg).toBeDefined();
        });

    });

})();
