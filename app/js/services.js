/**
 * Created by ian on 14.02.15.
 */

var janeServices = angular.module('janeServices', ['ngResource']);

janeServices.factory('Scene', ['$resource', '$http',

    function($resource, $http){



        return $resource('json_model/:scene.json', {}, {
            

            query: {
                data:{},
                method:'GET',
                params:{scene:'mtl'},
                isArray: false,
                format: 'json',

                transformResponse: function(data, header) {
                    return(log(data))
                }
            }
        })


    }]);

function log(data){

    data.kinky = "anal a la deux femme";
    console.log('hi from service' + data)
}