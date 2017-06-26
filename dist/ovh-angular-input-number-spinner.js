/**
 * @ngdoc overview
 * @name inputNumberSpinner
 * @description
 * # inputNumberSpinner
 *
 * Main module of the application.
 *
 *  See README.md for instructions about installation.
 */
angular.module("ovh-angular-input-number-spinner", []);

/**
 *  @ngdoc directive
 *  @name inputNumberSpinner.directive:inputNumberSpinner
 *
 *  @scope
 *  @restrict E
 *
 *  @description
 *  <p>Enhance a number input for entering numeric values, with up/down buttons and arrow key handling.</p>
 *
 *  @param    {Number} ng-model                                            The model of the input
 *  @param   {Number=} [input-number-spinner-min=-Infinity]                The minimum value of the input
 *  @param   {Number=} [input-number-spinner-max=Infinity]                 The maximum value of the input
 *  @param   {String=} [input-number-spinner-button-class=default]         The bootstrap class to add to buttons. For example : if buttonClass is equal to primary the buttons will have btn-primary class
 *  @param   {Number=} [input-number-spinner-acceleration-speed=75]        Time (in ms) between two interval
 *  @param   {Number=} [input-number-spinner-time-before-acceleration=500] Time (in ms) before interval is launched
 *  @param {Function=} input-number-spinner-on-change                      Callback function called when value has changed
 *  @param  {Boolean=} [ng-readonly=false]                                 Set component read-only
 */
angular.module("ovh-angular-input-number-spinner").component("inputNumberSpinner", {
    bindings: {
        value: "=ngModel",
        min: "=?inputNumberSpinnerMin",
        max: "=?inputNumberSpinnerMax",
        buttonClass: "@?inputNumberSpinnerButtonClass",
        accelerationSpeed: "@?inputNumberSpinnerAccelerationSpeed",
        timeBeforeAcceleration: "@?inputNumberSpinnerTimeBeforeAcceleration",
        ngDisabled: "=?",
        ngReadonly: "=?",
        onChange: "&?inputNumberSpinnerOnChange"
    },
    require: {
        ngModelCtrl: "ngModel"
    },
    templateUrl: "ovh-angular-input-number-spinner.html",
    controller: "inputNumberSpinnerController"
});

angular.module("ovh-angular-input-number-spinner").controller("inputNumberSpinnerController", ["$scope", "$interval", "$timeout", function ($scope, $interval, $timeout) {
    "use strict";

    var self = this;

    var prevValue;
    var buttonActive = false;
    var mouseDownInterval;
    var mouseDownTimeout;

    function increment () {
        if (self.value < self.max) {
            self.value += 1;
            self.onChangeEvent();
        } else if (self.value === self.max && mouseDownInterval) {
            self.cancelInterval();
        }
    }

    function decrement () {
        if (self.value > self.min) {
            self.value -= 1;
            self.onChangeEvent();
        } else if (self.value === self.min && mouseDownInterval) {
            self.cancelInterval();
        }
    }

    /*= ======================================================
    =            TIMEOUT AND INTERVAL MANAGEMENT            =
    =======================================================*/

    /**
     * Inc/dec value
     * @param   {Event} event          AngularJs event
     * @param {Boolean} incrementValue if true, inc, else dec
     */
    self.spin = function (event, incrementValue) {
        // if it is an other button than left click that was trigger, do not increment/decrement.
        if (event.which !== 1) {
            return;
        }

        // increment or decrement ?
        if (incrementValue) {
            increment();
        } else {
            decrement();
        }

        // activate button (to test later if an auto incrementation/decrementation is doing when mouse is out of button)
        buttonActive = true;

        // activate increment/decrement interval
        mouseDownTimeout = $timeout(function () {
            mouseDownInterval = $interval(incrementValue ? increment : decrement, self.accelerationSpeed);
        }, self.timeBeforeAcceleration);
    };

    self.cancelInterval = function () {
        if (mouseDownInterval) {
            $interval.cancel(mouseDownInterval);
            mouseDownInterval = null;
        }
        if (mouseDownTimeout) {
            $timeout.cancel(mouseDownTimeout);
            mouseDownTimeout = null;
        }
    };

    /* -----  End of TIMEOUT AND INTERVAL MANAGEMENT  ------*/

    /*= =============================
    =            EVENTS            =
    ==============================*/

    /**
     *  When mouse is out of a button. This avoids to continue increment/decrement when user has pressed the button and leave the button when mouse is down.
     */
    self.desactivateButton = function () {
        if (buttonActive && mouseDownInterval) {
            self.cancelInterval();
            buttonActive = false;
        }
    };

    self.onChangeEvent = function () {
        // if text have been enterred, value will be null or undefined (depending of prev value).
        // so check for this case and reset to prevValue.
        if (_.isNull(self.value) || _.isUndefined(self.value)) {
            self.value = prevValue;
        } else {
            if (self.onChange) {
                // use of $timeout because model value is not repercuted to calling controller value.
                // using $timeout call immediatly the digest phase and both values are equal...
                $timeout(self.onChange);
            }
            prevValue = self.value;
        }
    };

    /* -----  End of EVENTS  ------*/

    /*= =====================================
    =            INITIALIZATION            =
    ======================================*/

    function init () {
        var defaultValues = {
            min: Number.NEGATIVE_INFINITY,
            max: Number.POSITIVE_INFINITY,
            accelerationSpeed: 75,
            timeBeforeAcceleration: 500,
            buttonClass: "default"
        };

        _.defaults(self, defaultValues);

        if (_.isUndefined(self.value)) {
            self.value = self.min;
        }

        if (self.value < self.min) {
            self.value = self.min;
        }

        if (self.value > self.max) {
            self.value = self.max;
        }

        prevValue = self.value;
    }

    /* -----  End of INITIALIZATION  ------*/

    init();

}]);

angular.module('ovh-angular-input-number-spinner').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ovh-angular-input-number-spinner.html',
    "<div class=\"input-number-spinner input-group\"><span class=input-group-btn><button type=button class=btn data-ng-class=\"'btn-{{ $ctrl.buttonClass }}'\" data-ng-disabled=\"$ctrl.value <= $ctrl.min || $ctrl.ngDisabled || $ctrl.ngReadonly\" data-ng-mousedown=\"$ctrl.spin($event, false)\" data-ng-mouseup=$ctrl.cancelInterval() data-ng-mouseout=$ctrl.desactivateButton() data-ng-bind=\"'-'\"></button> </span><input class=form-control type=number data-ng-model=$ctrl.value min=\"{{ $ctrl.min }}\" max=\"{{ $ctrl.max }}\" data-ng-disabled=$ctrl.ngDisabled data-ng-readonly=$ctrl.ngReadonly data-ng-change=$ctrl.onChangeEvent()> <span class=input-group-btn><button type=button class=btn data-ng-class=\"'btn-{{ $ctrl.buttonClass }}'\" data-ng-disabled=\"$ctrl.value >= $ctrl.max || $ctrl.ngDisabled || $ctrl.ngReadonly\" data-ng-mousedown=\"$ctrl.spin($event, true)\" data-ng-mouseup=$ctrl.cancelInterval() data-ng-mouseout=$ctrl.desactivateButton() data-ng-bind=\"'+'\"></button></span></div>"
  );

}]);
