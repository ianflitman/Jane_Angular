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
                    data = JSON.parse(data);
                    var cumulativeLength = 0;
                    for (var i = 0; i < data.scene.parts.length; i++) {
                        for (var a = 0; a < data.scene.parts[i].content.length; a++) {
                            data.scene.parts[i].content[a].index = cumulativeLength;
                            content.push(data.scene.parts[i].content[a]);
                            cumulativeLength++;
                        }
                    }

                    myCache.put('script', content);
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

janeServices.factory('RowIds',
    function($resource, $cacheFactory) {
        return function(index){
            var data = $cacheFactory.get('Scene').get('script');
            return {current: data[index].id, next: (index < data.length-1)? data[index+1].id : 0 }

        }
    }
);

