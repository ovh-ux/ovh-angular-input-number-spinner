describe("Component: inputNumberSpinner", function () {

    "use strict";

    var $scope;
    var controllerBuilder;

    beforeEach(module("ovh-angular-input-number-spinner"));

    beforeEach(inject(function (_$rootScope_, _$componentController_) {
        $scope = _$rootScope_.$new();

        controllerBuilder = function (locals) {
            return _$componentController_(
                "inputNumberSpinner",
                {
                    $scope: $scope
                },
                locals
            );
        };

    }));

    afterEach(function () {
        $scope.$destroy();
    });

    describe("Initialization", function () {

        it("should initialize value to min if value is lower", function () {

            var ctrl = controllerBuilder({
                value: 0,
                min: 1,
                max: 2
            });

            expect(ctrl.value).toEqual(1);
        });

        it("should initialize value to max if value is higher than max", function () {
            var ctrl = controllerBuilder({
                value: 10,
                min: 0,
                max: 2
            });

            expect(ctrl.value).toEqual(2);
        });

        it("should initialize value to value if value is between min and max", function () {
            var ctrl = controllerBuilder({
                value: 1,
                min: 0,
                max: 2
            });

            expect(ctrl.value).toEqual(1);
        });

    });

    describe("Increment", function () {
        it("should increment the value when left click is triggered", function () {
            var ctrl = controllerBuilder({
                value: 2,
                min: 0,
                max: 5
            });

            // press the button
            ctrl.spin(
                {
                    type: "mousedown",
                    which: 1
                },
                true
            );

            expect(ctrl.value).toEqual(3);
        });

        it("should not increment the value when right click is triggered", function () {
            var ctrl = controllerBuilder({
                value: 2,
                min: 0,
                max: 5
            });

            // press the button
            ctrl.spin(
                {
                    type: "mousedown",
                    which: 3
                },
                true
            );

            expect(ctrl.value).toEqual(2);
        });

        it("should not increment the value when left click is triggered and when value is equal to max", function () {
            var ctrl = controllerBuilder({
                value: 2,
                min: 0,
                max: 2
            });

            // press the button
            ctrl.spin(
                {
                    type: "mousedown",
                    which: 1
                },
                true
            );

            expect(ctrl.value).toEqual(2);
        });
    });

    describe("Decrement", function () {
        it("should decrement the value when left click is triggered", function () {
            var ctrl = controllerBuilder({
                value: 2,
                min: 0,
                max: 5
            });

            // press the button
            ctrl.spin(
                {
                    type: "mousedown",
                    which: 1
                },
                false
            );

            expect(ctrl.value).toEqual(1);
        });

        it("should not decrement the value when right click is triggered", function () {
            var ctrl = controllerBuilder({
                value: 2,
                min: 0,
                max: 5
            });

            // press the button
            ctrl.spin(
                {
                    type: "mousedown",
                    which: 3
                },
                false
            );

            expect(ctrl.value).toEqual(2);
        });

        it("should not decrement the value when left click is triggered and when value is equal to min", function () {
            var ctrl = controllerBuilder({
                value: 0,
                min: 0,
                max: 5
            });

            // press the button
            ctrl.spin(
                {
                    type: "mousedown",
                    which: 1
                },
                false
            );

            expect(ctrl.value).toEqual(0);
        });
    });

});
