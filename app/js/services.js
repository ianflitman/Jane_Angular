/**
 * Created by ian on 14.02.15.
 */

var janeServices = angular.module('janeServices', ['ngResource']);

janeServices.factory('Scene',

    function($resource, $cacheFactory){

        var myCache = $cacheFactory('Scene');
        var title = "";

        var scene = $resource('json_model/:scene.json', {scene:'@scene'}, {
            query: {
                method:'GET',
                isArray: false,
                format: 'json',
                cache: true,

                transformResponse: function(data, header) {
                    var content =[];
                    var parts = [];
                    data = JSON.parse(data);
                    var cumulativeLength = 0;
                    for (var i = 0; i < data.scene.parts.length; i++) {
                        parts.push({'id': data.scene.code + '_' + data.scene.parts[i].keyword, 'start': cumulativeLength}); // 'length': data.scene.parts[i].content.length});
                        for (var a = 0; a < data.scene.parts[i].content.length; a++) {
                            data.scene.parts[i].content[a].index = cumulativeLength;
                            content.push(data.scene.parts[i].content[a]);
                            cumulativeLength++;
                        }
                    }

                    myCache.put('script', content);
                    myCache.put('parts', parts);
                    myCache.put('duration', 0);
                    title = data.scene.name;
                    return {content:content, title:title};
                }
            }
        });

        return scene;
    }
);

janeServices.factory('Play',

    function($resource, $cacheFactory){
      console.log('Play service');
        return function(){
            var data = $cacheFactory.get('Scene').get('script');
            for(var a = 0; a < data.length; a++){
                var $currentRow = $('#row_' + data[a].id);
                console.log($currentRow.attr('data-file'));
                if ($currentRow.attr('data-ctoria-type') == 'CHILD_COMPOUND') {
                    console.log('the exception: ' + $('#row_' + data[a].id + '_sel').attr('data-file'));
                }
            }
            console.log('Play service called');
        }
    }
);

janeServices.factory('LinkToCut',
    function($resource, $cacheFactory){
        return function(link) {
            var parts = $cacheFactory.get('Scene').get('parts');
            var partid = link.substr(0, link.lastIndexOf('_'));
            var cutIndex = Number(link.substr(link.lastIndexOf('_')+1));
            for(var a = 0; a < parts.length; a++){
                if(parts[a].id == partid){
                    return parts[a].start + cutIndex;
                }
            }
        }
    }
);

janeServices.factory('DurationControl',
    function($resource, $cacheFactory){
        var length = $cacheFactory.get('Scene').get('duration');
        var myCache = $cacheFactory('Scene');
        return function(time){
            length += time;
            myCache.put('duration', length);
        }
    }
);


