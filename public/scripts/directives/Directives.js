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
        // can be used as attribute or element
        restrict: 'AE',
        scope: {
            value: '=ngModel'
        },
        // which markup this directive generates
        template: '<button ng-click="decrement()">-</button>' +
                  '<div> {{value}} </div>' +
                  '<button ng-click="increment()">+</button>',
        // this function is called on each rn-stepper instance initialisation
        // we just declare what we need in the above template
        link: function(scope, iElement, iAttrs) {
            scope.value = 0;
            scope.increment = function() {
                scope.value++;
            }
            scope.decrement = function() {
                scope.value--;
            }
        }
    };
});