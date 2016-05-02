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
        templateUrl: 'views/testlist.html',
        controller: 'Ctrl_TestList'
    }).
    when('/test/:testId', {
        templateUrl: 'views/testdetail.html',
        controller: 'Ctrl_TestDetail'
    }).
    when('/new',{
        templateUrl: 'views/testnew.html',
        controller: ''
    }).
    when('/login',{
        templateUrl: 'views/login.html',
        controller: ''
    }).
    when('/comingsoon', {
        templateUrl: 'views/todo.html',
        controller: ''
    }).
    otherwise({
        redirectTo: '/comingsoon'
    });
});