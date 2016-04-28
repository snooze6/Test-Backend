//Modules
angular.module('Test', ["ngRoute", "route-segment", "view-segment"]);

//Sections
angular.module('Test').config(["$routeSegmentProvider", "$routeProvider", "$httpProvider", function ($routeSegmentProvider, $routeProvider, $httpProvider) {

    //Routing
    $routeSegmentProvider.when("/", "tests.list");

    //Default route
    $routeProvider.otherwise("/");

    //Books catalog
    $routeSegmentProvider.within("test").segment("list", {
        controller: "listcontroller",
        templateUrl:"./views/testlist.html",
        resolve: {
            Tests: ['apiservice', function (api) {
                return api.getTests();
            }]
        }
    });
}]);
  
  