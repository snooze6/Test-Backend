/**
 * Created by snooze on 4/28/16.
 */
angular.module('Test').service('apiservice', ['$http', 'settings', function($http, settings){

    // Get tests
    this.getTests = function(){
        console.log('Querying: '+settings.path+'/'+settings.api+'/'+settings.version+'/tests');
        return $http.get(settings.path+'/'+settings.api+'/'+settings.version+'/tests')
    }

}]);