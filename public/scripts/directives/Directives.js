/**
 * Created by arman on 19/06/2016.
 */

var mod = angular.module('testDirectives', []);

mod.directive('rnstepper', function () {
    return {
        // can be used as element
        restrict: 'E',
        // which markup this directive generates
        templateUrl: '../../views/forms/stepper.html'
    };
});

mod.directive('stepper', function() {
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: {
            min: '=',
            max: '='
        },
        templateUrl: '../../views/forms/stepper.html',
        link: function(scope, iElement, iAttrs, ngModelController) {
            // we can now use our ngModelController builtin methods
            // that do the heavy-lifting for us

            // when model change, update our view (just update the div content)
            ngModelController.$render = function() {
                iElement.find('div').text(ngModelController.$viewValue);
            };

            function checkValidity() {
                // check if min/max defined to check validity
                var isOverMin = (angular.isDefined(scope.min) && ngModelController.$viewValue < parseInt(scope.min, 10)),
                    isOverMax = (angular.isDefined(scope.max) && ngModelController.$viewValue > parseInt(scope.max, 10)),
                    valid = !(isOverMin || isOverMax);
                // set our model validity
                // the outOfBounds is an arbitrary key for the error.
                // will be used to generate the CSS class names for the errors
                ngModelController.$setValidity('outOfBounds', valid);

            }

            // update the model then the view
            function updateModel(offset) {
                // call $parsers pipeline then update $modelValue
                ngModelController.$setViewValue(ngModelController.$viewValue + offset);
                // update the local view
                ngModelController.$render();
                // check validity
                checkValidity();
            }

            // update the value when user clicks the buttons
            scope.decrement = function() {
                updateModel(-1);
            };
            scope.increment = function() {
                updateModel(+1);
            };
            // check validity on start, in case we're directly out of bounds
            checkValidity();
            // watch out min/max and recheck validity if they change
            scope.$watch('min+max', function() {
                checkValidity();
            });
        }
    };
});
