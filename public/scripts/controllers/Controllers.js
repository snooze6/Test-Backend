/**
 * Created by snooze on 5/1/16.
 */

var testControllers = angular.module('testControllers', []);

testControllers.controller('Ctrl_TestList', function ($scope, $routeParams, tests){
    tests.list($routeParams.pageId, function(tests) {
        console.log('Listing');
        $scope.tests = tests.docs;
        $scope.page = Number($routeParams.pageId) || 1;
    });

    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };
});

testControllers.controller('Ctrl_TestDetail', function ($scope, $routeParams, tests){
    tests.find($routeParams.testId, function(test) {
        console.log('Getting');
        console.log(test);
        $scope.test = test;
    });
});
