/**
 * Created by snooze on 5/1/16.
 */

var testControllers = angular.module('testControllers', []);

testControllers.controller('Ctrl_TestList', function ($scope, tests){
    tests.list(function(tests) {
        console.log('Listing');
        $scope.tests = tests.docs;
    });
});

testControllers.controller('Ctrl_TestDetail', function ($scope, $routeParams, tests){
    tests.find($routeParams.testId, function(test) {
        console.log('Getting');
        console.log(test);
        $scope.test = test;
    });
});
