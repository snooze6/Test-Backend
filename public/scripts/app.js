var TestApp = angular.module('TestApp', [
    'ngRoute',
    'testControllers',
    'testFactory']
);

TestApp.config(function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'views/testlist.html',
        controller: 'Ctrl_TestList'
    }).
    when('/page/:pageId', {
        template: '<p>To be implemented</p>',
        controller: ''
    }).
    when('/test/:testId', {
        templateUrl: 'views/testdetail.html',
        controller: 'Ctrl_TestDetail'
    }).
    otherwise({
        redirectTo: '/'
    });
});