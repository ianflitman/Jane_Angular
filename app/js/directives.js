/**
 * Created by ian on 07.02.15.
 */
var scriptBoxWidgets = angular.module('scriptBoxWidgets', ['ui.bootstrap', 'janeFilters']);

var currentSpeaker = "None";
var cameraFunc = function(nextSpeaker){
    if(nextSpeaker != currentSpeaker) {
        currentSpeaker = nextSpeaker;
        return currentSpeaker + ': ';
    }else{
       return '     ';
    }
};


scriptBoxWidgets
   /* .controller('ctoriaFreeCtrl', ['$scope', function ($scope) {
    }])*/

    .directive('ctoriaFree', ['cameraFilter', 'speakerFilter', function (camera, speaker) {
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
                    if ($('#icon_' + val + '> i').hasClass('fa-chevron-right')) {
                        $('#icon_' + val + '> i').addClass('fa-chevron-down').removeClass('fa-chevron-right');
                        $('#row_' + $scope.cut.id).addClass('placementborder');
                        $('#row_' + ($scope.cut.id +1)).addClass('nextrowline');
                        //}
                    } else {
                        $('#icon_' + val + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
                        $('#row_' + $scope.cut.id).removeClass('placementborder');
                        $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');

                    }
                };

                $scope.optionClick = function (val) {
                    var opt_txt = $('#' + val).text();
                    var $option = $('#' + val);
                    var cut_id = val.substr(0, val.indexOf('_'));
                    var $choice = $("[data-cut-id=" + cut_id + "]");
                    var $speaker = $("[speaker-cut-id=" + cut_id + "]");//$choice('.speaker');
                    $speaker.text(speaker($scope.cut.id));
                    $choice.text(opt_txt);
                    $('#collapse_' + cut_id).collapse('toggle');
                    $('#icon_' + cut_id + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
                    if ($choice.attr('data-selected-position') != 0) {
                        $('#' + cut_id + '_opt_' + $choice.attr('data-selected-position')).prop("disabled", false).toggleClass('optionbtn-disabled');
                        $('#row_' + $scope.cut.id).removeClass('placementborder');
                        $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');

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
                    var $speaker = $("[speaker-cut-id=" + scope.cut.id + "]");
                    $choice.attr('data-selected-position', choice_pos);
                    var camera_num = scope.cut.options[choice_pos - 1].sources.length;
                    var $camera = $('#camera_' + scope.cut.id);

                    if (camera_num == 2) {
                        var chosen_camera = Math.floor(Math.random() * 2);
                        source = scope.cut.options[choice_pos - 1].sources[chosen_camera];
                        var camtext = camera(source.file);
                        if (camtext.indexOf('wide') > -1){
                            if ($camera.hasClass('closecam')) {
                                $camera.removeClass('closecam');
                            }
                            $camera.addClass('widecam')
                        }else{
                            if ($camera.hasClass('widecam')) $camera.removeClass('widecam');
                            $camera.addClass('closecam')
                        }
                        $camera.text(camtext);
                        $camera.attr('db_id', source.id);
                        scope.db_id = source.id;
                    }

                    var $option = $('#' + scope.cut.id + '_opt_' + choice_pos);
                    var opt_txt = $option.text();

                    $speaker.text(speaker(scope.cut.id));
                    $choice.text(opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $('#row_' + scope.cut.id).css('background-color', '#ebeded');
                    });

                    $choice.on('mouseleave', function () {
                        $('#row_' + scope.cut.id).css('background-color', '#fbfdff');
                    });

                    $camera.on('click', function () {
                        for (var a = 0; a < scope.cut.options[scope.selected - 1].sources.length; a++) {
                            if (scope.cut.options[scope.selected - 1].sources[a].id != scope.db_id) {
                                var camtext = camera(scope.cut.options[scope.selected - 1].sources[a].file);
                                $camera.text(camtext);
                                if (camtext.indexOf('wide') > -1){
                                    if ($camera.hasClass('closecam')) $camera.removeClass('closecam');
                                    $camera.addClass('widecam')
                                }else{
                                    if ($camera.hasClass('widecam')) $camera.removeClass('widecam');
                                    $camera.addClass('closecam')
                                }
                                scope.db_id = scope.cut.options[scope.selected - 1].sources[a].id;
                                $self.attr('db_id', scope.db_id);
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

    .directive('ctoriaPairedChildFree', ['cameraFilter','speakerFilter', function (camera, speaker,$rootScope ) {
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
                    if ($('#icon_' + val + '> i').hasClass('fa-chevron-right')) {
                        $('#icon_' + val + '> i').addClass('fa-chevron-down').removeClass('fa-chevron-right');
                        $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).addClass('placementborder');
                        $('#row_' + $scope.cut.id + '_child_' + ($scope.cut.position +1)).addClass('nextrowline');
                    } else {
                        $('#icon_' + val + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
                        $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).removeClass('placementborder');
                        $('#row_' + $scope.cut.id + '_child_' + ($scope.cut.position +1)).removeClass('nextrowline');
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
                    $('#icon_' + cut_id + '_child_'+ $scope.cut.position + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
                    $('#' + cut_id + '_child_' + $scope.cut.position + '_opt_' + $scope.selectedChild).prop("disabled", false).toggleClass('optionbtn-disabled');
                    $scope.selectedChild = $option.attr('data-position');
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');
                    $choice.attr('data-selected-position', $option.attr('data-position'));

                    $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).removeClass('placementborder');
                    $('#row_' + $scope.cut.id + '_child_' + ($scope.cut.position +1)).removeClass('nextrowline');

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
                        var camtext = camera(source.file);
                        var $camera = $('#camera_' + $scope.cut.id)
                        //var cam = $('#camera_' + $scope.cut.id)
                        $camera.text(camtext);
                        if (camtext.indexOf('wide') > -1){
                            if ($camera.hasClass('closecam')) $camera.removeClass('closecam');
                            $camera.addClass('widecam')
                        }else{
                            if ($camera.hasClass('widecam')) $camera.removeClass('widecam');
                            $camera.addClass('closecam')
                        }
                        $camera.attr('db_id', source.id);
                        $scope.db_id = source.id;
                        //$scope.camera = camera_txt;
                        $choice.attr('data-db-id', $scope.db_id);
                    }

                    var $option = $('#' + $scope.cut.id + '_child_' + $scope.cut.position + '_opt_' + choice_pos);
                    var opt_txt = $option.text();
                    $choice.text(opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#ebeded')
                    });

                    $choice.on('mouseleave', function () {
                        $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#fbfdff')
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
                var camera_num = scope.cut.sources.length;
                var $camera = $('#camera_' + scope.cut.id);
                var chosen_camera = Math.floor(Math.random() * camera_num);
                var source = scope.cut.sources[chosen_camera];
                var camtext = camera(source.file);
                scope.db_id = source.id;
                $camera.attr('db_id', source.id);
                 if (camtext.indexOf('wide') > -1){
                        if ($camera.hasClass('closecam')) $camera.removeClass('closecam');
                        $camera.addClass('widecam')
                    }else{
                        if ($camera.hasClass('widecam')) $camera.removeClass('widecam');
                        $camera.addClass('closecam')
                 }

                if (camera_num == 2) {
                    $('#camera_' + scope.cut.id).text(camtext);
                } else {
                    $camera.attr('disabled', true);
                }

                $camera.on('click', function () {
                    for (var a = 0; a < scope.cut.sources.length; a++) {
                        if (scope.cut.sources[a].id != scope.db_id) {
                            var camtext = camera(scope.cut.sources[a].file);
                            $camera.text(camtext);
                            if (camtext.indexOf('wide') > -1){
                                if ($camera.hasClass('closecam')) $camera.removeClass('closecam');
                                $camera.addClass('widecam')
                            }else{
                                if ($camera.hasClass('widecam')) $camera.removeClass('widecam');
                                $camera.addClass('closecam')
                            }
                            scope.db_id = scope.cut.sources[a].id;
                            $self.attr('db_id', scope.db_id);
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
                var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                var $pauseOpt = $('#' + val);
                var pauseTxt = $pauseOpt.attr('set-name');
                $choice.text(pauseTxt);
                $("[camera-cut-id=" + $scope.cut.id + "]").text($pauseOpt.text());
                var oldSelection = $choice.attr('data-selected-position');
                $choice.attr('data-selected-position', val);
                $('#collapse_' + $scope.cut.id).collapse('toggle');
                $('#icon_' + $scope.cut.id + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
                $pauseOpt.prop("disabled", true).toggleClass('optionbtn-disabled');
                $('#' + oldSelection).prop("disabled", false).toggleClass('optionbtn-disabled');
                $('#row_' + $scope.cut.id).removeClass('placementborder');
                $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
            };

            $scope.fold = function (val) {
                $('#collapse_' + val).collapse('toggle');
                if ($('#icon_' + val + '> i').hasClass('fa-chevron-right')) {
                    $('#icon_' + val + '> i').addClass('fa-chevron-down').removeClass('fa-chevron-right')
                    $('#row_' + $scope.cut.id).addClass('placementborder');
                    $('#row_' + ($scope.cut.id +1)).addClass('nextrowline');
                } else {
                    $('#icon_' + val + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down')
                    $('#row_' + $scope.cut.id).removeClass('placementborder');
                    $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
                }
            };

            $scope.foldSeq = function(cut_id, seq_name){
                $('#collapse_' + cut_id + '_seq_' + seq_name).collapse('toggle');
                var $row = $('#row_' + cut_id + '_seq_' + seq_name);
                var $icon = $('#icon_' + cut_id + '_seq_'+ seq_name + '> i')
                if ($icon.hasClass('fa-chevron-right')) {
                    $icon.addClass('fa-chevron-down').removeClass('fa-chevron-right')
                    $row.addClass('seqsetline');

                } else {
                    $icon.addClass('fa-chevron-right').removeClass('fa-chevron-down')
                    $row.removeClass('seqsetline');
                }
            };
        },
        link: function (scope, $element, $attr) {
            $element.ready(function () {
                var $choice = $("[data-cut-id=" + scope.cut.id + "]");
                var $cameraDesc = $("[camera-cut-id=" + scope.cut.id + "]");

                $choice.on('mouseenter', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#ebeded');
                    $choice.css('background-color', '#ebeded')
                });

                $choice.on('mouseleave', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#fbfdff');
                    $choice.css('background-color', '#fbfdff');
                });

                var $short = $('#row_' + scope.cut.id + '_seq_' + scope.cut.sets[0].name);
                var $medium = $('#row_' + scope.cut.id + '_seq_' + scope.cut.sets[1].name);
                var $long = $('#row_' + scope.cut.id + '_seq_' + scope.cut.sets[2].name);

                $short.on('mouseenter', function () {
                    $short.css('background-color', '#ebeded');
                });

                $short.on('mouseleave', function () {
                    $short.css('background-color', '#fbfdff');
                });

                $medium.on('mouseenter', function () {
                    $medium.css('background-color', '#ebeded');
                });

                $medium.on('mouseleave', function () {
                    $medium.css('background-color', '#fbfdff');
                });

                $long.on('mouseenter', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#ebeded');
                    $long.css('background-color', '#ebeded');
                });

                $long.on('mouseleave', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#fbfdff');
                    $long.css('background-color', '#fbfdff');
                });

                $cameraDesc.on('mouseenter', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#ebeded');
                    $choice.css('background-color', '#ebeded');
                });

                $cameraDesc.on('mouseleave', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#fbfdff');
                    $choice.css('background-color', '#fbfdff');
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
                $choice.text(capitaliseFirstLetter(setNames[setChosen]) + ' pause'); //\u00A0\u00A0\u00A0\u00A0' + cameraStr);
                $cameraDesc.text(cameraStr);
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
                if ($('#icon_' + val + '> i').hasClass('fa-chevron-right')) {
                    $('#icon_' + val + '> i').addClass('fa-chevron-down').removeClass('fa-chevron-right')
                    if($scope.cut.children[$attrs.selectedPosition-1].type == 'ALTERNATIVE_COMPOUND'){
                        $('#row_' + $scope.cut.id + '_sel').addClass('nextselectline');
                    }else{
                        console.log('just fuck off for now')
                    }
                    $('#row_' + ($scope.cut.id +1)).addClass('nextrowline');
                } else {
                    $('#icon_' + val + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down')
                    if($scope.cut.children[$attrs.selectedPosition-1].type == 'ALTERNATIVE_COMPOUND'){
                        $('#row_' + $scope.cut.id + '_sel').removeClass('nextselectline');
                    }else{
                        console.log('just screw yourself for now')
                    }
                    $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
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

                            $def_choice.on('mouseenter', function () {
                                $('#row_' + $scope.cut.id).css('background-color', '#ebeded')
                            });

                            $def_choice.on('mouseleave', function () {
                                $('#row_' + $scope.cut.id).css('background-color', '#fbfdff')
                            });

                            $('#row_'+ $scope.cut.id).css('background-color','#fbfdff');

                            $def_choice.removeClass('placementbtn').addClass('defaultbtn pull-left');
                            var $defSel = $('#def_' + $scope.cut.id + '_child_' + $attrs.selectedPosition);
                            $optSel.css('color', '#ed6a43');
                            $defSel.css('color', '#ed6a43');
                            $def_choice.text($defSel.text());
                            $def_choice.css('padding-left', '0px');
                             //"<div id=row_{{cut.id}}_sel class=\"row col-md-7\" style=\"background-color:#ebf5ff;border-left: 1px solid #c6c7d2;\"><div class=\"col-md-9\" style=\"padding-left: 0px\"><p data-cut-id={{cut.id}} class=\"col-md-12 childoption\">{{cut.line}}</p></div><div id=icon_{{cut.id}} class=\"col-md-3\"><button id=camera_{{cut.id}}_sel db_id=\"\" class=\"camerabtn pull-left\" style=\"margin-left:35px; margin-top: 6px\">{{cut.sources[0].file | camera}}</button></div></div>";
                            var html_opt_div = "<div class='container'><div id='row_" + $scope.cut.id + "_sel' class='row col-md-6'  style='background-color: #fbfdff;border-left: 1px solid #c6c7d2;'><div speaker-cut-id={{cut.id}} class='col-md-1 speakertxt' 'style='padding-left: 0px;padding-top: 5px'></div><div  class ='col-md-9 compoundoption'><p class='default-text'></p></div><div class='col-md-2'><button id=camera_{{cut.id}} db_id='0' ng-click='optCameraToggle()' class='pull-right camerabtn'>camera</button></div></div></div>";
                            //$('#row_' + $scope.cut.id).after(html_opt_div);
                            var opt_div = $compile(html_opt_div)($scope);
                            opt_div.find('p').text($optSel.text());
                            console.log(opt_div.find('p').text());
                            $('#row_' + $scope.cut.id).parent().after(opt_div);
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
                $new_child_choice.css('color', '#ed6a43');
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

scriptBoxWidgets.directive('ctoriaChildCompound', ['cameraFilter', 'speakerFilter', function (camera, speaker,$rootScope) {
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
                if ($('#def_icon_' + val + '> i').hasClass('fa-chevron-right')) {
                    $('#def_icon_' + val + '> i').addClass('fa-chevron-down').removeClass('fa-chevron-right');
                    $('#row_opt_' + $scope.cut.id + '_child_' + $scope.cut.position).addClass('nextselectline');
                } else {
                    $('#def_icon_' + val + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down')
                    $('#row_opt_' + $scope.cut.id + '_child_' + $scope.cut.position).removeClass('nextselectline');
                }
            };

            $scope.optionClick = function (val) {
                var $option = $('#' + val);
                var opt_txt = $option.text();
                var $choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $scope.cut.position + "]");
                $choice.text(opt_txt);

                $('#collapse_' + $scope.cut.id + '_child_' + $scope.cut.position).collapse('toggle');
                $('#def_icon_' + $scope.cut.id + '_child_'+ $scope.cut.position + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
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
                $choice.text( opt_txt); //speaker($scope.cut.id) +
                $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                $def_choice = $('#def_' + $scope.cut.id + '_child_' + $scope.cut.position);

                $def_choice.on('mouseenter', function () {
                    $('#row_def_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#ebeded')
                });

                $def_choice.on('mouseleave', function () {
                    $('#row_def_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#fbfdff')
                });

                $rootScope.$broadcast($scope.cut.id + '_childReady');
            });
        },

        link: function (scope, $element, $attr) {

        }
    }
}]);

scriptBoxWidgets.directive('ctoriaPairedParent', ['cameraFilter', 'speakerFilter', function (camera, speaker, $rootScope) {
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
                var $icon = $('#icon_' + val + '> i');
                //console.log(val)
                $('#collapse_' + val).collapse('toggle');
                if ($icon.hasClass('fa-chevron-right')) {
                    $icon.addClass('fa-chevron-down').removeClass('fa-chevron-right');
                    $('#row_' + $scope.cut.id).addClass('placementborder');
                    $('#row_' + ($scope.cut.id +1)).addClass('nextrowline');
                } else {
                    $icon.addClass('fa-chevron-right').removeClass('fa-chevron-down');
                    $('#row_' + $scope.cut.id).removeClass('placementborder');
                    $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
                }
            };

            if($scope.cut.arguments.pos < $scope.cut.arguments.total) {
                $rootScope.$broadcast($scope.cut.id, $attrs.selectedPosition);
            }

            if($scope.cut.arguments.pos > 1){
                $scope.$on($scope.cut.arguments.prev, function(e, data){
                    //console.log('previous pos change: ' + data + ', heard in pos: ' + $scope.cut.arguments.pos);
                    $attrs.selectedPosition = data;
                });

                $scope.$on($scope.cut.arguments.prev + '_pairedSelected', function(e, data){
                    console.log('previous pos change: ' + data + ', heard in pos: ' + $scope.cut.arguments.pos);
                    var $old_optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedPosition + "]");
                    $old_optSel.css('color', '#000000');
                    $attrs.selectedPosition = data;
                    var $optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedPosition + "]");
                    $optSel.css('color', '#ed6a43');
                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    var $speaker = $("[speaker-cut-id=" + $scope.cut.id + "]");
                    $speaker.text(speaker($scope.cut.id) );
                    $choice.text($optSel.text());
                    $choice.removeClass('placementborder');
                    $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
                });

                $scope.$on($scope.cut.id + '_pairedSelected', function(e,val){
                    var $old_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $attrs.selectedPosition + "]");
                    $old_child_choice.css('color', '#000000');
                    $attrs.selectedPosition = val;
                    var $new_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $attrs.selectedPosition + "]");
                    $new_child_choice.css('color', '#ed6a43');
                })
            }

            $scope.$on($scope.cut.id + '_childReady', function(e, val){
                childReadyCount++;
                if(childReadyCount == $scope.cut.children.length){
                    var $optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedPosition + "]");
                    $attrs.selectedChild = $scope.selectedChild = Number($optSel.attr('data-selected-position'));
                    $scope.db_id = Number($optSel.attr('data-db-id'));
                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    var $speaker = $("[speaker-cut-id=" + $scope.cut.id + "]");
                    $optSel.css('color', '#ed6a43');
                    $speaker.text(speaker($scope.cut.id));
                    $choice.text($optSel.text());
                    childReadyCount = 0;

                    $camera = $('#camera_' + $scope.cut.id);
                    $camera.on('click', function () {
                        var $self = $('#camera_' + $scope.cut.id);
                        for (var a = 0; a < $scope.cut.children[$attrs.selectedPosition-1].options[$attrs.selectedChild - 1].sources.length; a++) {
                            if ($scope.cut.children[$attrs.selectedPosition-1].options[$scope.selectedChild - 1].sources[a].id != $scope.db_id) {
                                var camtext = camera($scope.cut.children[$attrs.selectedPosition-1].options[$scope.selectedChild - 1].sources[a].file)
                                if (camtext.indexOf('wide') > -1){
                                    if ($self.hasClass('closecam')) $self.removeClass('closecam');
                                    $self.addClass('widecam')
                                }else{
                                    if ($self.hasClass('widecam')) $self.removeClass('widecam');
                                    $self.addClass('closecam')
                                }
                                $self.text(camtext);
                                $scope.db_id = $scope.cut.children[$attrs.selectedPosition-1].options[$scope.selectedChild - 1].sources[a].id;
                                $camera.attr('db_id', $scope.db_id);
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
                    $('#row_' + scope.cut.id).css('background-color', '#ebeded')
                });

                $choice.on('mouseleave', function () {
                    $('#row_' + scope.cut.id).css('background-color', '#fbfdff')
                });
            })
        }
    }
}]);



scriptBoxWidgets
    /*.controller('ctoriaPairedFreeCtrl', ['$scope', function ($scope, $rootScope) {
    }])*/

    .directive('ctoriaPairedFree', ['cameraFilter', 'speakerFilter', function (camera, speaker) {
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
                    if ($('#icon_' + val + '> i').hasClass('fa-chevron-right')) {
                        $('#icon_' + val + '> i').addClass('fa-chevron-down').removeClass('fa-chevron-right');
                        $('#row_' + $scope.cut.id).addClass('placementborder');
                        $('#row_' + ($scope.cut.id +1)).addClass('nextrowline');
                    } else {
                        $('#icon_' + val + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
                        $('#row_' + $scope.cut.id).removeClass('placementborder');
                        $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
                    }
                };

                $scope.optionClick = function (val) {
                    var $option = $('#' + val);
                    var opt_txt = $option.text();
                    var cut_id = val.substr(0, val.indexOf('_'));
                    var $choice = $("[data-cut-id=" + cut_id + "]");
                    var $speaker = $("[speaker-cut-id=" + $scope.cut.id + "]");
                    $speaker.text(speaker($scope.cut.id));
                    $choice.text(opt_txt);

                    $('#collapse_' + cut_id).collapse('toggle');
                    $('#icon_' + cut_id + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
                    if ($choice.attr('data-selected-position') != 0) {
                        $('#' + cut_id + '_opt_' + $choice.attr('data-selected-position')).prop("disabled", false).toggleClass('optionbtn-disabled');
                        $('#row_' + $scope.cut.id).removeClass('placementborder');
                        $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
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
                        var $speaker = $("[speaker-cut-id=" + $scope.cut.id + "]");
                        $speaker.text(speaker($scope.cut.id));
                        $choice.text(new_opt_txt);
                        $('#' + $scope.cut.id + '_opt_' + $choice.attr('data-selected-position')).prop("disabled", false).toggleClass('optionbtn-disabled');
                    });
                }

                $element.ready(function () {
                    var choice_pos = Math.floor((Math.random() * $scope.cut.options.length) + 1);
                    $scope.selected = $attrs.selectedPosition= choice_pos;
                    //console.log($attrs.selectedPosition);
                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    var $speaker = $("[speaker-cut-id=" + $scope.cut.id + "]");
                    $choice.attr('data-selected-position', choice_pos);
                    var camera_num = $scope.cut.options[choice_pos - 1].sources.length;
                    var $camera = $('#camera_' + $scope.cut.id);

                    if($scope.cut.arguments.pos ==1 ) {
                        $rootScope.$broadcast($scope.cut.id, choice_pos);
                    }

                    if (camera_num == 2) {
                        var chosen_camera = Math.floor(Math.random() * 2);
                        source = $scope.cut.options[choice_pos - 1].sources[chosen_camera];
                        var camtext = camera(source.file);
                        if (camtext.indexOf('wide') > -1){
                            if ($camera.hasClass('closecam')) $camera.removeClass('closecam');
                            $camera.addClass('widecam')
                        }else{
                            if ($camera.hasClass('widecam')) $camera.removeClass('widecam');
                            $camera.addClass('closecam')
                        }
                        $camera.text(camtext);
                        $camera.attr('db_id', source.id);
                        $scope.db_id = source.id;
                    }

                    var $option = $('#' + $scope.cut.id + '_opt_' + choice_pos);
                    $speaker.text(speaker($scope.cut.id));
                    var opt_txt = $option.text();
                    $choice.text( opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $('#row_' + $scope.cut.id).css('background-color', '#ebeded')
                    });

                    $choice.on('mouseleave', function () {
                        $('#row_' + $scope.cut.id).css('background-color', '#fbfdff')
                    });


                    $camera.on('click', function () {
                        for (var a = 0; a < $scope.cut.options[$scope.selected - 1].sources.length; a++) {
                            if ($scope.cut.options[$scope.selected - 1].sources[a].id != $scope.db_id) {
                                var camtext = camera($scope.cut.options[$scope.selected - 1].sources[a].file);
                                if (camtext.indexOf('wide') > -1){
                                    if ($camera.hasClass('closecam')) $camera.removeClass('closecam');
                                    $camera.addClass('widecam')
                                }else{
                                    if ($camera.hasClass('widecam')) $camera.removeClass('widecam');
                                    $camera.addClass('closecam')
                                }
                                $camera.text(camtext);
                                $scope.db_id = $scope.cut.options[$scope.selected - 1].sources[a].id;
                                $camera.attr('db_id', $scope.db_id);
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