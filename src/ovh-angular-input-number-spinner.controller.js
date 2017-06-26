angular.module("ovh-angular-input-number-spinner").controller("inputNumberSpinnerController", function ($scope, $interval, $timeout) {
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

});
