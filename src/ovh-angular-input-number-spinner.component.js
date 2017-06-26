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
