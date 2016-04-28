/**
 * Created by snooze on 4/28/16.
 */

angular.module('Test').controller('listcontroller', ['$scope', 'apiservice' ,function ($scope, api){

    api.getTests().then(function (result){
        $scope.raws = result;
        $scope.tests = result.docs;
    },
    function(){
        alert('España no va Bien');
    });
    
}]);