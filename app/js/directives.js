/**
 * Created by ian on 07.02.15.
 */
var scriptBoxWidgets = angular.module('scriptBoxWidgets', ['ui.bootstrap', 'janeFilters']);

scriptBoxWidgets
   /* .controller('ctoriaFreeCtrl', ['$scope', function ($scope) {
    }])*/

    .directive('ctoriaFree', ['cameraFilter', function (camera) {
        return {
            restrict: 'E',
            scope: {
                db_id: '@',
                selected: '@dataSelectedPosition',
                cut: '='
            },
            templateUrl: 'templates/ctoria-free.html',
            controller: function ($scope, $element) {

                $scope.fold = function (val) {
                    $('#collapse_' + val).collapse('toggle');
                    if ($('#icon_' + val + '> i').hasClass('glyphicon-chevron-right')) {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                    } else {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                    }
                };

                $scope.optionClick = function (val) {
                    var opt_txt = $('#' + val).text();
                    var $option = $('#' + val);
                    var cut_id = val.substr(0, val.indexOf('_'));
                    var $choice = $("[data-cut-id=" + cut_id + "]");

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
                    //var cut_id = scope.cut.id;
                    var choice_pos = Math.floor((Math.random() * scope.cut.options.length) + 1);
                    scope.selected = choice_pos;
                    var $choice = $("[data-cut-id=" + scope.cut.id + "]");
                    $choice.attr('data-selected-position', choice_pos);
                    var camera_num = scope.cut.options[choice_pos - 1].sources.length;

                    if (camera_num == 2) {
                        var chosen_camera = Math.floor(Math.random() * 2);
                        source = scope.cut.options[choice_pos - 1].sources[chosen_camera];
                        var camera_txt = camera(source.file);
                        $('#camera_' + scope.cut.id).text(camera_txt);
                        $('#camera_' + scope.cut.id).attr('db_id', source.id);
                        scope.db_id = source.id;
                    }

                    var $option = $('#' + scope.cut.id + '_opt_' + choice_pos);
                    var opt_txt = $option.text();
                    $choice.text(opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $('#row_' + scope.cut.id).css('background-color', '#edd99f')
                    })

                    $choice.on('mouseleave', function () {
                        $('#row_' + scope.cut.id).css('background-color', '#f5eac9')
                    })

                    $camera = $('#camera_' + scope.cut.id);
                    $camera.on('click', function () {
                        for (var a = 0; a < scope.cut.options[scope.selected - 1].sources.length; a++) {
                            if (scope.cut.options[scope.selected - 1].sources[a].id != scope.db_id) {
                                $('#camera_' + scope.cut.id).text(camera(scope.cut.options[scope.selected - 1].sources[a].file));
                                scope.db_id = scope.cut.options[scope.selected - 1].sources[a].id;
                                $('#camera_' + scope.cut.id).attr('db_id', scope.db_id);
                                break;
                            }
                        }
                    });
                });
            }
        }
    }]);

scriptBoxWidgets
    /*.controller('childFreeCtrl', ['$scope', function ($scope, $rootScope) {
    }])*/

    .directive('ctoriaPairedChildFree', ['cameraFilter', function (camera, $rootScope ) {
        return {
            restrict: 'E',
            scope: {
                db_id: '@dataDbId',
                selected: '@dataSelectedPosition',
                childIndex: '=',
                cut: '='
            },
            templateUrl: 'templates/ctoria-paired-child-free.html',
            controller: function ($scope, $element, $rootScope) {

                $scope.fold = function (val) {
                    $('#collapse_' + val).collapse('toggle');
                    if ($('#icon_' + val + '> i').hasClass('glyphicon-chevron-right')) {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                    } else {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                    }
                };

                $scope.optionClick = function (val) {
                    var $option = $('#' + val);
                    var opt_txt = $option.text();
                    var cut_id = val.substr(0, val.indexOf('_'));
                    var $child_choice = $("[data-cut-id=" + cut_id + '_child_'+ $scope.cut.position + "]");
                    var $choice = $("[data-cut-id=" + cut_id + "]");
                    $scope.pairedVal = $scope.cut.position;
                    $choice.text(opt_txt);
                    $child_choice.text(opt_txt);

                    $('#collapse_' + cut_id + '_child_' + $scope.cut.position).collapse('toggle');
                    $('#icon_' + cut_id + '_child_'+ $scope.cut.position + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
                    $('#' + cut_id + '_child_' + $scope.cut.position + '_opt_' + $scope.selectedChild).prop("disabled", false).toggleClass('optionbtn-disabled');
                    $scope.selectedChild = $option.attr('data-position');
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');
                    $choice.attr('data-selected-position', $option.attr('data-position'));
                    //console.log($scope.$parent.cut.arguments.prev);
                    if($scope.$parent.cut.arguments.pos > 1){
                        $rootScope.$broadcast($scope.$parent.cut.id + '_pairedSelected', $scope.cut.position);
                    }
                };

                $element.ready(function () {
                    var choice_pos = Math.floor((Math.random() * $scope.cut.options.length) + 1);
                    $scope.selectedChild = choice_pos;
                    var $choice = $("[data-cut-id=" + $scope.cut.id + '_child_' + $scope.cut.position + "]");
                    $choice.attr('data-selected-position', choice_pos);
                    var camera_num = $scope.cut.options[choice_pos - 1].sources.length;

                    if (camera_num == 2) {
                        var chosen_camera = Math.floor(Math.random() * 2);
                        source = $scope.cut.options[choice_pos - 1].sources[chosen_camera];
                        var camera_txt = camera(source.file);
                        $('#camera_' + $scope.cut.id).text(camera_txt);
                        $('#camera_' + $scope.cut.id).attr('db_id', source.id);
                        $scope.db_id = source.id;
                        $choice.attr('data-db-id', $scope.db_id);
                    }

                    var $option = $('#' + $scope.cut.id + '_child_' + $scope.cut.position + '_opt_' + choice_pos);
                    var opt_txt = $option.text();
                    $choice.text(opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#edd99f')
                    });

                    $choice.on('mouseleave', function () {
                        $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#f5eac9')
                    });

                    $rootScope.$broadcast($scope.cut.id + '_childReady');
                });
            },

            link: function (scope, $element, $attr, $rootScope) {

            }
        }
    }]);

scriptBoxWidgets.directive('ctoriaDefault', ['cameraFilter', function (camera) {
    return {
        restrict: 'E',
        scope: {
            db_id: '@',
            cut: '='
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
                $('#camera_' + cut_id).attr('db_id', source.id);

                if (camera_num == 2) {
                    $('#camera_' + cut_id).text(camera_txt);
                } else {
                    $('#camera_' + scope.cut.id).attr('disabled', true);
                }

                $camera = $('#camera_' + cut_id);
                $camera.on('click', function () {
                    for (var a = 0; a < scope.cut.sources.length; a++) {
                        if (scope.cut.sources[a].id != scope.db_id) {
                            $('#camera_' + cut_id).text(camera(scope.cut.sources[a].file));
                            scope.db_id = scope.cut.sources[a].id;
                            $('#camera_' + cut_id).attr('db_id', scope.db_id);
                            break;
                        }
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

            $scope.pauseClick = function (val) {
                var $choice = $("[data-cut-id=" + $scope.cut.id + "]")
                var $pauseOpt = $('#' + val);
                var pauseTxt = $pauseOpt.attr('set-name') + $pauseOpt.text();
                $choice.text(pauseTxt);
                var oldSelection = $choice.attr('data-selected-position');
                $choice.attr('data-selected-position', val);
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
            $element.ready(function () {
                var $choice = $("[data-cut-id=" + scope.cut.id + "]");

                $choice.on('mouseenter', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#edd99f')
                });

                $choice.on('mouseleave', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#f5eac9')
                });

                var capitaliseFirstLetter = function (string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                };

                var setNames = ["short", "medium", "long"];
                var setChosen = Math.floor(Math.random() * 3);
                var seqChosen = Math.floor(Math.random() * scope.cut.sets[setChosen].seqs.length);
                var cameraStr = seqCamera(scope.cut.sets[setChosen].seqs[seqChosen]);

                scope.setChoice = setChosen;
                scope.seqChoice = seqChosen;
                $choice.attr('data-selected-position', scope.cut.id + '_' + setNames[setChosen] + '_' + seqChosen);
                $('#' + scope.cut.id + '_' + setNames[setChosen] + '_' + seqChosen).prop("disabled", true).toggleClass('optionbtn-disabled');
                $choice.text(capitaliseFirstLetter(setNames[setChosen]) + ' pause ' + cameraStr);
            })
        }
    }
}]);

scriptBoxWidgets.directive('ctoriaParent', ['cameraFilter', '$compile', function (camera, $compile) {

    return {
        restrict: 'E',
        scope: {
            cut: '=',
            selected: '@dataSelectedPosition',
            selectedChild: '@dataSelectedChild'
        },

        templateUrl: 'templates/ctoria-parent.html',

        controller: function ($scope, $element, $attrs) {
            var childReadyCount = 0;
            $scope.fold = function (val) {
                $('#collapse_' + val).collapse('toggle');
                if ($('#icon_' + val + '> i').hasClass('glyphicon-chevron-right')) {
                    $('#icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                } else {
                    $('#icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                }
            };

            $scope.$on($scope.cut.id + '_childReady', function(e, val){
                childReadyCount++;
                if(childReadyCount == $scope.cut.children.length){
                    var choice_pos = Math.floor((Math.random() * $scope.cut.children.length) + 1);
                    $attrs.selectedPosition = $scope.selectedChild = choice_pos;

                    var $optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedPosition + "]");
                    $attrs.selectedChild = $scope.selectedChild = Number($optSel.attr('data-selected-position'));
                    $scope.db_id = Number($optSel.attr('data-db-id'));
                    console.log($scope.cut.children[$attrs.selectedPosition-1].type);
                    var child_type = $scope.cut.children[$attrs.selectedPosition-1].type;

                    switch(child_type) {
                        case 'ALTERNATIVE_COMPOUND':
                            var $def_choice = $("[data-cut-id=" + $scope.cut.id + "]");
                            $def_choice.attr('data-cut-id', 'def_' + $scope.cut.id);
                            $('#row_'+ $scope.cut.id).css('background-color','#ffdfae');

                            $def_choice.removeClass('placementbtn').addClass('defaultbtn');
                            var $defSel = $('#def_' + $scope.cut.id + '_child_' + $attrs.selectedPosition);
                            //$optSel.css('color', '#9d1923');
                            $def_choice.text($defSel.text());
                            $def_choice.css('padding-left', '0px');
                            //$opt_choice.text($optSel.text());
                            var html_opt_div = "<div class='row col-md-8 childoption'><p class ='col-md-10' style='margin-bottom:5px;margin-top:5px'></p><span class='col-md-2'><button id=camera_{{cut.id}} db_id='0' ng-click='optCameraToggle()' class='pull-right camerabtn'>camera</button></span></div>";
                            var opt_div = $compile(html_opt_div)($scope);
                            opt_div.find('p').text($optSel.text());
                            console.log(opt_div.find('p').text());
                            $('#row_' + $scope.cut.id).after(opt_div);
                            break;
                        default:
                            break;
                    }

                    $scope.optCameraToggle = function(){
                        console.log('change the option camera')
                    };

                    childReadyCount = 0;

                    $camera = $('#camera_' + $scope.cut.id);
                    $camera.on('click', function () {
                        for (var a = 0; a < $scope.cut.children[$attrs.selectedPosition-1].options[$attrs.selectedChild - 1].sources.length; a++) {
                            if ($scope.cut.children[$attrs.selectedPosition-1].options[$scope.selectedChild - 1].sources[a].id != $scope.db_id) {
                                $('#camera_' + $scope.cut.id).text(camera($scope.cut.children[$attrs.selectedPosition-1].options[$scope.selectedChild - 1].sources[a].file));
                                $scope.db_id = $scope.cut.children[$attrs.selectedPosition-1].options[$scope.selectedChild - 1].sources[a].id;
                                $('#camera_' + $scope.cut.id).attr('db_id', $scope.db_id);
                                break;
                            }
                        }
                    });
                }
            });

           /* $scope.$on($scope.cut.id + '_childSelected', function(e,val){
                console.log('i hear my children speak: ' + $attrs.selectedPosition);
                var $old_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $attrs.selectedPosition + "]");
                $old_child_choice.css('color', '#000000');
                $attrs.selectedPosition = val;
                var $new_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $attrs.selectedPosition + "]");
                $new_child_choice.css('color', '#9d1923');
                console.log('i hear my children speak: ' + $attrs.selectedPosition);
            })*/


        },

        link: function (scope, $element, $attr) {
            $element.ready(function () {
                console.log(scope.cut.id)
            })
        }
    }
}]);

scriptBoxWidgets.directive('ctoriaCompound', function () {
    var custom_html = '<div>alternative compound {{cut.id}}</div>';
    return {
        restrict: 'E',
        scope: true,
        template: custom_html,

        controller: function ($scope, $element, $document) {

        },

        link: function (scope, $element, $attr) {

        }
    }
});

scriptBoxWidgets.directive('ctoriaChildCompound', ['cameraFilter', function (camera, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            db_id: '@dataDbId',
            selected: '@dataSelectedPosition',
            cut: '='
        },

        templateUrl: 'templates/ctoria-child-compound.html',

        controller: function ($scope, $element, $document, $rootScope) {
            var childReadyCount = 0;

            $scope.fold = function(val){
                console.log(val)
                $('#collapse_' + val).collapse('toggle');
                if ($('#def_icon_' + val + '> i').hasClass('glyphicon-chevron-right')) {
                    $('#def_icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                } else {
                    $('#def_icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                }
            };

            $scope.optionClick = function (val) {
                var $option = $('#' + val);
                var opt_txt = $option.text();
                var $choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $scope.cut.position + "]");
                $choice.text(opt_txt);

                $('#collapse_' + $scope.cut.id + '_child_' + $scope.cut.position).collapse('toggle');
                $('#def_icon_' + $scope.cut.id + '_child_'+ $scope.cut.position + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
                console.log($scope.selected);
               $('#' + $scope.cut.id + '_child_' + $scope.cut.position + '_opt_' + $scope.selected).prop("disabled", false).toggleClass('optionbtn-disabled');
                $scope.selected = Number($option.attr('data-position'));
                console.log($scope.selected);
                $option.prop("disabled", true).toggleClass('optionbtn-disabled');
                $choice.attr('data-selected-position', $option.attr('data-position'));

                $rootScope.$broadcast($scope.$parent.cut.id + '_childSelected', $scope.cut.position);
            };

            $element.ready(function(){
                var choice_pos = Math.floor((Math.random() * $scope.cut.options.length) + 1);
                $scope.selected = choice_pos;
                var $choice = $("[data-cut-id=" + $scope.cut.id + '_child_' + $scope.cut.position + "]");
                $choice.attr('data-selected-position', choice_pos);
                /*var camera_num = $scope.cut.options[choice_pos - 1].sources.length;

               if (camera_num == 2) {
                    var chosen_camera = Math.floor(Math.random() * 2);
                    source = $scope.cut.options[choice_pos - 1].sources[chosen_camera];
                    var camera_txt = camera(source.file);
                    $('#camera_' + $scope.cut.id).text(camera_txt);
                    $('#camera_' + $scope.cut.id).attr('db_id', source.id);
                    $scope.db_id = source.id;
                    $choice.attr('data-db-id', $scope.db_id);
                }*/

                var $option = $('#' + $scope.cut.id + '_child_' + $scope.cut.position + '_opt_' + choice_pos);
                var opt_txt = $option.text();
                $choice.text(opt_txt);
                $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                $def_choice = $('#def_' + $scope.cut.id + '_child_' + $scope.cut.position);

                $def_choice.on('mouseenter', function () {
                    $('#row_def_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#FFD48F')
                });

                $def_choice.on('mouseleave', function () {
                    $('#row_def_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#ffdfae')
                });

                $rootScope.$broadcast($scope.cut.id + '_childReady');
            });
        },

        link: function (scope, $element, $attr) {

        }
    }
}]);

scriptBoxWidgets.directive('ctoriaPairedParent', ['cameraFilter', function (camera, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            cut: '=',
            selected: '@dataSelectedPosition',
            selectedChild: '@dataSelectedChild',
            db_id: '@dataDbId'
        },
        templateUrl: 'templates/ctoria-paired-parent.html',

        controller: function ($scope, $element, $attrs) {
            var childReadyCount = 0;
            $scope.fold = function (val) {
                console.log(val)
                $('#collapse_' + val).collapse('toggle');
                if ($('#icon_' + val + '> i').hasClass('glyphicon-chevron-right')) {
                    $('#icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                } else {
                    $('#icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                }
            };

            if($scope.cut.arguments.pos < $scope.cut.arguments.total) {
                $rootScope.$broadcast($scope.cut.id, $attrs.selectedPosition);
            }

            if($scope.cut.arguments.pos > 1){
                $scope.$on($scope.cut.arguments.prev, function(e, data){
                    console.log('previous pos change: ' + data + ', heard in pos: ' + $scope.cut.arguments.pos);
                    $attrs.selectedPosition = data;
                });

                $scope.$on($scope.cut.arguments.prev + '_pairedSelected', function(e, data){
                    console.log('previous pos change: ' + data + ', heard in pos: ' + $scope.cut.arguments.pos);
                    var $old_optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedPosition + "]");
                    $old_optSel.css('color', '#000000');
                    $attrs.selectedPosition = data;
                    var $optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedPosition + "]");
                    $optSel.css('color', '#9d1923');
                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    $choice.text($optSel.text());
                });

                $scope.$on($scope.cut.id + '_pairedSelected', function(e,val){
                    //console.log('i hear my children speak: ' + $attrs.selectedPosition);
                    var $old_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $attrs.selectedPosition + "]");
                    $old_child_choice.css('color', '#000000');
                    $attrs.selectedPosition = val;
                    var $new_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $attrs.selectedPosition + "]");
                    $new_child_choice.css('color', '#9d1923');
                    //console.log('i hear my children speak: ' + $attrs.selectedPosition);
                })
            }

            $scope.$on($scope.cut.id + '_childReady', function(e, val){
                childReadyCount++;
                if(childReadyCount == $scope.cut.children.length){
                    var $optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedPosition + "]");
                    $attrs.selectedChild = $scope.selectedChild = Number($optSel.attr('data-selected-position'));
                    $scope.db_id = Number($optSel.attr('data-db-id'));
                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    $optSel.css('color', '#9d1923');
                    $choice.text($optSel.text());
                    childReadyCount = 0;

                    $camera = $('#camera_' + $scope.cut.id);
                    $camera.on('click', function () {
                        for (var a = 0; a < $scope.cut.children[$attrs.selectedPosition-1].options[$attrs.selectedChild - 1].sources.length; a++) {
                            if ($scope.cut.children[$attrs.selectedPosition-1].options[$scope.selectedChild - 1].sources[a].id != $scope.db_id) {
                                $('#camera_' + $scope.cut.id).text(camera($scope.cut.children[$attrs.selectedPosition-1].options[$scope.selectedChild - 1].sources[a].file));
                                $scope.db_id = $scope.cut.children[$attrs.selectedPosition-1].options[$scope.selectedChild - 1].sources[a].id;
                                $('#camera_' + $scope.cut.id).attr('db_id', $scope.db_id);
                                break;
                            }
                        }
                    });
                }
            })
        },

        link: function (scope, $element, $attrs) {

            $element.ready(function () {
                var $choice = $("[data-cut-id=" + scope.cut.id + "]");
                $choice.on('mouseenter', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#edd99f')
                });

                $choice.on('mouseleave', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#f5eac9')
                });
            })
        }
    }
}]);



scriptBoxWidgets
    /*.controller('ctoriaPairedFreeCtrl', ['$scope', function ($scope, $rootScope) {
    }])*/

    .directive('ctoriaPairedFree', ['cameraFilter', function (camera) {
        return {
            restrict: 'E',
            scope: {
                db_id: '@',
                selected: '@dataSelectedPosition',
                cut: '='
            },
            templateUrl: 'templates/ctoria-paired-free.html',
            controller: function ($scope, $element, $rootScope, $attrs) {

                $scope.fold = function (val) {
                    $('#collapse_' + val).collapse('toggle');
                    if ($('#icon_' + val + '> i').hasClass('glyphicon-chevron-right')) {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                    } else {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                    }
                };

                $scope.optionClick = function (val) {
                    var $option = $('#' + val);
                    var opt_txt = $option.text();
                    var cut_id = val.substr(0, val.indexOf('_'));
                    var $choice = $("[data-cut-id=" + cut_id + "]");

                    $choice.text(opt_txt);
                    $('#collapse_' + cut_id).collapse('toggle');
                    $('#icon_' + cut_id + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
                    if ($choice.attr('data-selected-position') != 0) {
                        $('#' + cut_id + '_opt_' + $choice.attr('data-selected-position')).prop("disabled", false).toggleClass('optionbtn-disabled');
                    }
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');
                    $choice.attr('data-selected-position', $option.attr('data-position'));
                    console.log($attrs.selectedPosition);
                    $attrs.selectedPosition = $option.attr('data-position');
                    console.log($attrs.selectedPosition);

                    if($scope.cut.arguments.pos < $scope.cut.arguments.total){
                        $rootScope.$broadcast($scope.cut.id +'_pairedSelected' , $attrs.selectedPosition);
                    }
                };

                if($scope.cut.arguments.pos < $scope.cut.arguments.total){
                    $scope.$on($scope.cut.arguments.next + '_pairedSelected', function(e,val){
                        console.log('paired change heard: ' + val)
                        var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                        $('#' + $scope.cut.id + '_opt_' + $choice.attr('data-selected-position')).prop("disabled", false).toggleClass('optionbtn-disabled');
                        var $option = $('#' + $scope.cut.id + '_opt_' + val);
                        var new_opt_txt = $option.text();
                        $attrs.selectedPosition = val;
                        $choice.attr('data-selected-position', val);
                        $choice.text(new_opt_txt);
                        $('#' + $scope.cut.id + '_opt_' + $choice.attr('data-selected-position')).prop("disabled", false).toggleClass('optionbtn-disabled');
                    });
                }


                $element.ready(function () {
                    var choice_pos = Math.floor((Math.random() * $scope.cut.options.length) + 1);
                    $scope.selected = $attrs.selectedPosition= choice_pos;
                    console.log($attrs.selectedPosition);
                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    $choice.attr('data-selected-position', choice_pos);
                    var camera_num = $scope.cut.options[choice_pos - 1].sources.length;

                    if($scope.cut.arguments.pos ==1 ) {
                        $rootScope.$broadcast($scope.cut.id, choice_pos);
                    }

                    if (camera_num == 2) {
                        var chosen_camera = Math.floor(Math.random() * 2);
                        source = $scope.cut.options[choice_pos - 1].sources[chosen_camera];
                        var camera_txt = camera(source.file);
                        $('#camera_' + $scope.cut.id).text(camera_txt);
                        $('#camera_' + $scope.cut.id).attr('db_id', source.id);
                        $scope.db_id = source.id;
                    }

                    var $option = $('#' + $scope.cut.id + '_opt_' + choice_pos);
                    var opt_txt = $option.text();
                    $choice.text(opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $('#row_' + $scope.cut.id).css('background-color', '#edd99f')
                    });

                    $choice.on('mouseleave', function () {
                        $('#row_' + $scope.cut.id).css('background-color', '#f5eac9')
                    });

                    $camera = $('#camera_' + $scope.cut.id);
                    $camera.on('click', function () {
                        for (var a = 0; a < $scope.cut.options[$scope.selected - 1].sources.length; a++) {
                            if ($scope.cut.options[$scope.selected - 1].sources[a].id != $scope.db_id) {
                                $('#camera_' + $scope.cut.id).text(camera($scope.cut.options[$scope.selected - 1].sources[a].file));
                                $scope.db_id = $scope.cut.options[$scope.selected - 1].sources[a].id;
                                $('#camera_' + $scope.cut.id).attr('db_id', $scope.db_id);
                                break;
                            }
                        }
                    });
                });
            },

            link: function (scope, $element, $attr, $scope) {
            }
        }
    }]);