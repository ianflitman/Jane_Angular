/**
 * Created by ian on 14.02.15.
 */

var janeServices = angular.module('janeServices', ['ngResource']);

janeServices.factory('Scene',

    function($resource, $cacheFactory){

        var myCache = $cacheFactory('Scene');

        var scene = $resource('json_model/:scene.json', {scene:'@scene'}, {
            query: {
                method:'GET',
                isArray: true,
                format: 'json',
                cache: true,

                transformResponse: function(data, header) {
                    var content =[];
                    data = JSON.parse(data);
                    for (var i = 0; i < data.scene.parts.length; i++) {
                        for (var a = 0; a < data.scene.parts[i].content.length; a++) {
                            content.push(data.scene.parts[i].content[a]);
                        }
                    }

                    myCache.put('script', content);
                    return content;
                }
            }//,

           /* speaker: function(cut_id){
                var content = cache('scene');
                //var result = $.grep(content, function(e){ return e.id == cut_id; });
                //var speaker = result.children[0].speaker;
                return cache(scene);
            }*/
        })

        return scene;
    }

);

/*
function log(data){
    console.log('hi from service' + data)
}*/
