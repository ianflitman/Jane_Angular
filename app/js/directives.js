/**
 * Created by ian on 07.02.15.
 */
var scriptBoxWidgets = angular.module('scriptBoxWidgets', ['ui.bootstrap', 'janeFilters']);

scriptBoxWidgets
    .controller('altFreeCtrl', ['$scope', '$document', function ($scope, $document) {
    }])

    .directive('ctoriaAltFree', ['cameraFilter', function (camera) {
        return {
            restrict: 'E',
            scope: {
                db_id: '@',
                selected: '@dataSelectedPosition',
                cut: '='
            },
            templateUrl: 'templates/ctoria-alt-free.html',
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
                    var cut_id = scope.cut.id;
                    var choice_pos = Math.floor((Math.random() * scope.cut.options.length) + 1);
                    scope.selected = choice_pos;
                    var $choice = $("[data-cut-id=" + cut_id + "]");
                    $choice.attr('data-selected-position', choice_pos);
                    var camera_num = scope.cut.options[choice_pos-1].sources.length;

                    if(camera_num == 2){
                        var chosen_camera = Math.floor(Math.random() * 2);
                        source = scope.cut.options[choice_pos-1].sources[chosen_camera];
                        var camera_txt = camera(source.file);
                        $('#camera_'+ cut_id).text(camera_txt);
                        $('#camera_'+ cut_id).attr('db_id', source.id);
                        scope.db_id = source.id;
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
                                //console.log('new db ' + scope.db_id);
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
    return {
        restrict: 'E',
        scope:{
            db_id: '@',
            cut:'='
        },
        templateUrl: 'templates/ctoria-default.html',
        link: function (scope, $element, $attr) {
            $element.ready(function () {
                var cut_id = scope.cut.id
                var camera_num = scope.cut.sources.length;

                var chosen_camera = Math.floor(Math.random() * camera_num);
                var source = scope.cut.sources[chosen_camera];
                var camera_txt = camera(source.file);
                scope.db_id = source.id;
                $('#camera_'+ cut_id).attr('db_id', source.id);

                if(camera_num == 2){
                    $('#camera_'+ cut_id).text(camera_txt);
                }else{
                    $('#camera_' +scope.cut.id).attr('disabled', true);
                }

                $camera = $('#camera_'+ cut_id);
                $camera.on('click', function(){
                    for(var a=0; a < scope.cut.sources.length; a++){
                        if(scope.cut.sources[a].id != scope.db_id) {
                            $('#camera_'+ cut_id).text(camera(scope.cut.sources[a].file));
                            scope.db_id = scope.cut.sources[a].id;
                            $('#camera_'+ cut_id).attr('db_id', scope.db_id );
                            break;
                        };
                    }
                });
            });
        }
    }
}]);

scriptBoxWidgets.directive('ctoriaSeqSet', ['seqCameraFilter', function (seqCamera) {
    return {
        restrict: 'E',
        scope: {
            cut: '=',
            db_ids: '@',
            dataSelectedPosition: '@'
        },
        templateUrl: 'templates/ctoria-seq-set.html',
        controller: function ($scope, $element, $document) {

            $scope.pauseClick = function(val){
                var $choice = $("[data-cut-id=" + $scope.cut.id + "]")
                var $pauseOpt = $('#'+val);
                var pauseTxt = $pauseOpt.attr('set-name') + $pauseOpt.text();
                $choice.text(pauseTxt);
                var oldSelection = $choice.attr('data-selected-position');
                $choice.attr('data-selected-position',val);
                $('#collapse_' + $scope.cut.id).collapse('toggle');
                $('#icon_' + $scope.cut.id + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
                $pauseOpt.prop("disabled", true).toggleClass('optionbtn-disabled');
                $('#' + oldSelection).prop("disabled", false).toggleClass('optionbtn-disabled');
            };

            $scope.fold = function (val) {
                    $('#collapse_' + val).collapse('toggle');
                    if ($('#icon_' + val + '> i').hasClass('glyphicon-chevron-right')) {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                    } else {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                    }
                }
        },
        link: function (scope, $element, $attr) {
            $element.ready (function(){
                var $choice = $("[data-cut-id=" + scope.cut.id + "]");

                $choice.on('mouseenter', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#edd99f')
                });

                $choice.on('mouseleave', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#f5eac9')
                });

                var capitaliseFirstLetter = function (string)
                {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                }

                var setNames = ["short", "medium", "long"];
                var setChosen = Math.floor(Math.random() * 3);
                var seqChosen = Math.floor(Math.random() * scope.cut.sets[setChosen].seqs.length);
                var cameraStr = seqCamera(scope.cut.sets[setChosen].seqs[seqChosen]);

                scope.setChoice = setChosen;
                scope.seqChoice = seqChosen;
                $choice.attr('data-selected-position', scope.cut.id + '_' + setNames[setChosen] +'_' + seqChosen);
                $('#'+ scope.cut.id + '_' + setNames[setChosen] +'_' + seqChosen).prop("disabled", true).toggleClass('optionbtn-disabled');
                $choice.text(capitaliseFirstLetter(setNames[setChosen]) + ' pause ' + cameraStr);
            })
        }
    }
}]);

scriptBoxWidgets.directive('ctoriaAltPaired', function () {
    var custom_html = '<div>alternative paired {{cut.id}}</div>';
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