/**
 * Created by ian on 07.02.15.
 */
var scriptBoxWidgets = angular.module('scriptBoxWidgets', ['ui.bootstrap', 'janeFilters']);

scriptBoxWidgets
    .controller('altFreeCtrl', ['$scope', '$document', function ($scope, $document) {
        console.log($scope.data)
        /*$scope.playClick = function(){
         alert('ctrl click')
         }*/

        $document.ready(function () {
            console.log('ready')
        })
    }])

    .directive('ctoriaAltFree', ['cameraFilter', function (camera) {
        return {
            restrict: 'E',
            scope: {
                /* position: '=',
                 isSelected: '=',*/
                db_id: '@', //$filter('camera'),
                selected: '@dataSelectedPosition',
                cut: '='
            },
            templateUrl: 'templates/ctoria-alt-free.html',
            //controllerAs: 'AlternativeFreeCtrl'
            controller: function ($scope, $element, $document) {

                $scope.fold = function (val) {
                    $('#collapse_' + val).collapse('toggle');
                    if ($('#icon_' + val + '> i').hasClass('glyphicon-chevron-right')) {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                    } else {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                    }
                }

                $scope.optionClick = function (val) {
                 var opt_txt = $('#' + val).text()
                 var $option = $('#' + val);
                 var cut_id = val.substr(0, val.indexOf('_'))
                 var $choice = $("[data-cut-id=" + cut_id + "]")

                 $choice.text(opt_txt);
                 $('#collapse_' + cut_id).collapse('toggle');
                 $('#icon_' + cut_id + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
                 if ($choice.attr('data-selected-position') != 0) {
                 $('#' + cut_id + '_opt_' + $choice.attr('data-selected-position')).prop("disabled", false).toggleClass('optionbtn-disabled');
                 }
                 $option.prop("disabled", true).toggleClass('optionbtn-disabled');
                 $choice.attr('data-selected-position', $option.attr('data-position'));
                 }

            },

            link: function (scope, $element, $attr) {

                $element.ready(function () {
                    console.log(scope.cut.id);
                    var cut_id = scope.cut.id
                    console.log('length:' + scope.cut.options.length);
                    var choice_pos = Math.floor((Math.random() * scope.cut.options.length) + 1);
                    console.log(choice_pos);
                    scope.selected = choice_pos;
                    var $choice = $("[data-cut-id=" + cut_id + "]");
                    $choice.attr('data-selected-position', choice_pos);
                    var camera_num = scope.cut.options[choice_pos-1].sources.length;
                    console.log('camera_num: '+ camera_num);

                    if(camera_num == 2){
                        var chosen_camera = Math.floor(Math.random() * 2);
                        source = scope.cut.options[choice_pos-1].sources[chosen_camera];
                        var camera_txt = camera(source.file)
                        console.log('chosen camera: ' + chosen_camera);
                        console.log(camera_txt)
                        $('#camera_'+ cut_id).text(camera_txt);
                        $('#camera_'+ cut_id).attr('db_id', source.id);
                        scope.db_id = source.id;
                        //console.log('db:' + $scope.cut.options[choice_pos-1].sources[chosen_camera].id)
                    }

                    var $option = $('#' + cut_id + '_opt_' + choice_pos);
                    var opt_txt = $option.text();
                    $choice.text(opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $('#row_' + cut_id).css('background-color', '#edd99f')
                    })

                    $choice.on('mouseleave', function () {
                        $('#row_' + cut_id).css('background-color', '#f5eac9')
                    })

                    $camera = $('#camera_'+ cut_id);
                    $camera.on('click', function(){
                        for(var a=0; a < scope.cut.options[scope.selected-1].sources.length; a++){
                            if(scope.cut.options[scope.selected-1].sources[a].id != scope.db_id) {
                                $('#camera_'+ cut_id).text(camera(scope.cut.options[scope.selected - 1].sources[a].file));
                                scope.db_id = scope.cut.options[scope.selected - 1].sources[a].id;
                                console.log('new db ' + scope.db_id);
                                $('#camera_'+ cut_id).attr('db_id', scope.db_id );
                                break;
                            };
                        }

                    });
                });
            }
        }
    }]);

scriptBoxWidgets.directive('ctoriaDefault', ['cameraFilter', function (camera) {
    //var custom_html = '<div>default {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope:{
            db_id: '@',
            cut:'='
        },
        templateUrl: 'templates/ctoria-default.html',
        link: function (scope, $element, $attr) {
            $element.ready(function () {
                console.log(scope.cut.id);
                var cut_id = scope.cut.id
                var camera_num = scope.cut.sources.length;
                console.log('camera_num: '+ camera_num);

                if(camera_num == 2){
                    var chosen_camera = Math.floor(Math.random() * 2);
                    source = scope.cut.sources[chosen_camera];
                    var camera_txt = camera(source.file)
                    console.log('chosen camera: ' + chosen_camera);
                    console.log(camera_txt)
                    $('#camera_'+ cut_id).text(camera_txt);
                    $('#camera_'+ cut_id).attr('db_id', source.id);
                    scope.db_id = source.id;
                    //console.log('db:' + $scope.cut.options[choice_pos-1].sources[chosen_camera].id)
                }else{
                    console.log('only one camera angle')
                }

                $camera = $('#camera_'+ cut_id);
                $camera.on('click', function(){
                    for(var a=0; a < scope.cut.sources.length; a++){
                        if(scope.cut.sources[a].id != scope.db_id) {
                            $('#camera_'+ cut_id).text(camera(scope.cut.sources[a].file));
                            scope.db_id = scope.cut.sources[a].id;
                            console.log('new db ' + scope.db_id);
                            $('#camera_'+ cut_id).attr('db_id', scope.db_id );
                            break;
                        };
                    }

                });
            });
        }


    }

}]);

scriptBoxWidgets.directive('ctoriaSeqSet', function () {
    var custom_html = '<div>sequence set {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope: true,
        template: custom_html
    }

});

scriptBoxWidgets.directive('ctoriaAltPaired', function () {
    var custom_html = '<div>alternative paired {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope: true,
        template: custom_html
    }

});

scriptBoxWidgets.directive('ctoriaAltParent', function () {
    var custom_html = '<div>alternative parent {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope: true,
        template: custom_html
    }

});

scriptBoxWidgets.directive('ctoriaAltPairedParent', function () {
    var custom_html = '<div>alternative paired parent {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope: true,
        template: custom_html
    }

});