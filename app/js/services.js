/**
 * Created by ian on 14.02.15.
 */

var janeServices = angular.module('janeServices', ['ngResource']);

janeServices.factory('Scene', ['$resource', '$http',

    function($resource, $http){

        var mydata = {};
        var secondData = {};
        var content = [];

        return $resource('json_model/:scene.json', {scene:'@scene'}, {
            query: {
                method:'GET',
                //params:{scene:'@scene'},
                isArray: false,
                format: 'json',

                transformResponse: function(data, header) {
                    return JSON.parse(data);
                }
            }
        })

    }]);

function log(data){
    console.log('hi from service' + data)
}