/**
 * Created by ian on 06.02.15.
 */

var janeControllers = angular.module('janeControllers', []);

janeControllers.controller('MasterScriptController', ['$scope', '$http', 'Scene',
    function($scope, $http, Scene){
        data = Scene.query();
        data.$promise.then(function (data) {
            console.log(data.kinky)
            $scope.content = function(){
                var content = [];
                for (var i = 0; i < data.scene.parts.length; i++) {
                    for(var a =0; a < data.scene.parts[i].content.length; a++){
                        content.push(data.scene.parts[i].content[a]);
                    }
                }
                return content;
            }

            $scope.getPartName = function(which){
                if(which > data.scene.parts.length -1){
                    which = 0;
                }

                return data.scene.parts[which].name;
            }

            $scope.title = function(){
                return $scope.data.scene.name;
            }
        })

        $scope.script = 'mtl';

    }]);

janeControllers.controller('ScriptBoxController', ['$scope', '$routeParams',
    function ($scope, $routeParams) {
        $scope.id = $routeParams.id;
    }
]);

/*janeControllers.controller('AlternativeFreeCtrl', ['$scope', '$routeParams',
    function($scope, $routeParams){
        $scope.closebtn = function(){
            console.log('closing from altfreeCtrl')
        }

    }
]);*/

janeControllers.controller('DefaultCtrl', ['$scope', '$routeParams',
    function($scope, $routeParams){

    }
]);

janeControllers.controller('SequenceSetCtrl', ['$scope', '$routeParams',
    function($scope, $routeParams){

    }
]);