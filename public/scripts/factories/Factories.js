/**
 * Created by snooze on 5/1/16.
 */

angular.module('testFactory', []).factory('tests', function($http){
    return {
        list: function (p, callback){
            var limit = 15;
            var page = p || 1;
            console.log('Listing page: '+p);
            console.log('Url: '+'localhost:3000/'+'api/v1/tests?limit='+limit+'&page='+page);
            console.log(limit);
            $http({
                method: 'GET',
                url: 'api/v1/tests?limit='+limit+'&page='+page,
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