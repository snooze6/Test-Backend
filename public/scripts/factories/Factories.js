/**
 * Created by snooze on 5/1/16.
 */

angular.module('testFactory', []).factory('tests', function($http){
    return {
        list: function (callback, l){
            var limit = l || 15;
            console.log(limit);
            $http({
                method: 'GET',
                url: 'api/v1/tests?limit='+limit,
                cache: true
            }).success(callback);
        },
        find: function(id, callback){
            $http({
                method: 'GET',
                url: 'api/v1/tests/'+id,
                cache: true
            }).success(callback);
        }
    };
});