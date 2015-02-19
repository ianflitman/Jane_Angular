/**
 * Created by ian on 06.02.15.
 */

var janeControllers = angular.module('janeControllers', []);

janeControllers.controller('MasterScriptController', ['$scope', '$http', 'Scene',
    function ($scope, $http, Scene) {
        data = Scene.query({scene: 'mtl'});
        data.$promise.then(function (data) {

            $scope.content = function () {
                var content = [];
                for (var i = 0; i < data.scene.parts.length; i++) {
                    for (var a = 0; a < data.scene.parts[i].content.length; a++) {
                        content.push(data.scene.parts[i].content[a]);
                    }
                }
                return content;
            }

            $scope.getPartName = function (which) {
                if (which > data.scene.parts.length - 1) {
                    which = 0;
                }

                return data.scene.parts[which].name;
            }

            $scope.title = function () {
                return $scope.data.scene.name;
            }
        })

        $scope.script = 'mtl';

    }]);

janeControllers.controller('SequenceSetCtrl', ['$scope', '$routeParams',
    function ($scope, $routeParams, $http) {

        $scope.sets = function (sets) {

            var setsObj = []
            for (var a = 0; a < sets.length; a++) {
                var setObj = {}
                setObj.name = sets[a].name;
                setObj.seqs = []

                for (var seq = 0; seq < sets[a].seqs.length; seq++) {
                    var seqObj = {}
                    seqObj.duration = 0;
                    seqObj.ids = [];
                    for (var src = 0; src < sets[a].seqs[seq].length; src++) {
                        //console.log(sets[a].seqs[seq][src].file);
                        seqObj.duration += (sets[a].seqs[seq][src].duration / 1000).toFixed(2);
                        seqObj.ids.push(sets[a].seqs[seq][src].id);
                    }
                    setObj.seqs.push(seqObj)
                }
                setsObj.push(setObj)
            }

            return setsObj;
        };

        $scope.selected = function () {

        }

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
    function ($scope, $routeParams) {

    }
]);

