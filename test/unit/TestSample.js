(function () {
    'use strict';

    describe('Sample', function () {
        beforeEach(module('sample-with-tests'));

        var factory;

        beforeEach(inject(function ($injector) {
            factory = $injector.get('Sample');
        }));

        it('is defined', function () {
            expect(factory).toBeDefined();
        });

        describe('myMethod', function () {
            it('returns 1 when p is true', function () {
                expect(factory.myMethod(true)).toEqual(1);
            });

            // Leave else-case untested to verify coverage
        });
    });
})();
