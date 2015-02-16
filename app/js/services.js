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


    /*secondData = data;
    content = []

    for (var i = 0; i < data.scene.parts.length; i++) {
        for(var a =0; a < data.scene.parts[i].content.length; a++){
            content.push(data.scene.parts[i].content[a]);
        }
    }*/


    console.log('hi from service' + data)
}