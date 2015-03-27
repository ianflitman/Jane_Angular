/**
 * Created by ian on 07.02.15.
 */
var scriptBoxWidgets = angular.module('scriptBoxWidgets', ['ui.bootstrap', 'janeFilters']);

var cameraCode = function (input) {

    var camera_code_start = input.lastIndexOf('_') + 1;
    var camera_code_end = input.lastIndexOf('.mp4') + 2;
    var camera_code = input.substr(camera_code_start, input.length - camera_code_end);

    return camera_code;
};

var cameraTxtFromCode = function (input) {

    var camera_code_start = input.lastIndexOf('_') + 1;
    var camera_code_end = input.lastIndexOf('.mp4') + 2;
    var camera_code = input.substr(camera_code_start, input.length - camera_code_end);
    var camtext = ""

    switch (camera_code) {
        case 'cn':
        case 'ce':
            camtext = 'near';
            break;
        case 'co':
        case 'ca':
            camtext = 'face';
            break;
        case '2s':
            camtext = 'wide';
            break;
        case '2o':
            camtext = 'wide right';
            break;
        case '2a':
            camtext = 'wide left';
            break;
        default:
            camtext = 'not sure';
    }

    return {code:camera_code, text: camtext} ;
};

var setCamera = function($camera, sources){
    var camera_num = sources.length;
    var chosen_camera = Math.floor(Math.random() * camera_num);
    var source = sources[chosen_camera];
    var camtext = cameraTxtFromCode(source.file).text;
    var cameracode = cameraTxtFromCode(source.file).code;
    cameraCss($camera, camtext);
    $camera.text(camtext);
    $camera.attr('db_id', source.id);

    if (camera_num == 1)$camera.attr('disabled', true);

    return {id: source.id, code: cameracode}
};

var cameraCss = function($camera, camtext){
    if (camtext.indexOf('wide') > -1){
        if ($camera.hasClass('closecam')) {
            $camera.removeClass('closecam');
        }
        $camera.addClass('widecam')
    }else{
        if ($camera.hasClass('widecam')) $camera.removeClass('widecam');
        $camera.addClass('closecam')
    }
};

var getIds = function(input){
    var ids = [];
    for(var a=0; a<input.length; a++){
        ids.push(input[a].id)
    }
    return ids.toString();
};

var idFromCode = function(sources, code){
    var camera_code_start;
    var camera_code_end;
    var camera_code;

    for(var a = 0; a < sources.length; a++){
        camera_code_start = sources[a].file.lastIndexOf('_') + 1;
        camera_code_end = sources[a].file.lastIndexOf('.mp4') + 2;
        camera_code = sources[a].file.substr(camera_code_start, sources[a].file.length - camera_code_end);
        if(camera_code == code){
            return sources[a].id;
        }
    }
};

var rowEnter = function(cut_id){
    return function (cut_id){
        $('#row_' + cut_id).css('background-color', '#ebeded');
    };
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
            controller: function ($scope, $element, $rootScope) {

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
                    //console.log($(this).attr('id'));
                    var opt_txt = $('#' + val).text();
                    var $option = $('#' + val);

                    var $row = $('#row_' + $scope.cut.id);
                    var cameracode = $row.attr('data-camera-code');
                    var sources = $scope.cut.options[$option.attr('data-position') -1].sources;
                    $row.attr('data-db-id', idFromCode(sources, cameracode));

                    var cut_id = val.substr(0, val.indexOf('_'));
                    var $choice = $("[data-cut-id=" + cut_id + "]");
                    var $speaker = $("[speaker-cut-id=" + cut_id + "]");
                    $speaker.text(speaker($scope.cut.id));
                    $choice.text(opt_txt);
                    $rootScope.dialogueChanges++;
                    //$rootScope.$apply(); $apply in progress when we toggle next so do not use this line

                    $('#collapse_' + cut_id).collapse('toggle');
                    $('#icon_' + cut_id + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
                    if ($choice.attr('data-selected-position') != 0) {
                        $('#' + cut_id + '_opt_' + $choice.attr('data-selected-position')).prop("disabled", false).toggleClass('optionbtn-disabled');
                        $row.removeClass('placementborder');
                        $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');

                    }
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');
                    $choice.attr('data-selected-position', $option.attr('data-position'));
                }
            },

            link: function (scope, $element, $attr) {

                $element.ready(function () {
                    var $row = $('#row_' + scope.cut.id);
                    var choice_pos = Math.floor((Math.random() * scope.cut.options.length)) + 1;
                    scope.selected = choice_pos;
                    var $choice = $("[data-cut-id=" + scope.cut.id + "]");
                    var $speaker = $("[speaker-cut-id=" + scope.cut.id + "]");
                    $choice.attr('data-selected-position', choice_pos);
                    var $camera = $('#camera_' + scope.cut.id);
                    var sources = scope.cut.options[choice_pos - 1].sources;
                    var cameraVals = setCamera($camera, sources);
                    $row.attr('data-db-id', cameraVals.id);
                    $row.attr('data-camera-code', cameraVals.code);

                    var $option = $('#' + scope.cut.id + '_opt_' + choice_pos);
                    var opt_txt = $option.text();

                    $speaker.text(speaker(scope.cut.id));
                    $choice.text(opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function(){ //rowEnter(scope.cut.id));//
                        $row.css('background-color', '#ebeded');
                    });

                    $choice.on('mouseleave', function () {
                        $row.css('background-color', '#fbfdff');
                    });

                    $camera.on('click', function () {
                        for (var a = 0; a < scope.cut.options[scope.selected - 1].sources.length; a++) {
                            if (scope.cut.options[scope.selected - 1].sources[a].id != scope.db_id) {
                                var camtext = camera(scope.cut.options[scope.selected - 1].sources[a].file);
                                $camera.text(camtext);
                                cameraCss($camera, camtext);
                                scope.db_id = scope.cut.options[scope.selected - 1].sources[a].id;
                                scope.$root.cameraChanges++;
                                scope.$root.$apply();
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
                selected: '@dataSelectedOption',
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
                    $choice.attr('data-selected-option', $option.attr('data-position'));

                    $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).removeClass('placementborder');
                    $('#row_' + $scope.cut.id + '_child_' + ($scope.cut.position +1)).removeClass('nextrowline');

                    if($scope.$parent.cut.arguments.pos > 1){
                        $rootScope.$broadcast($scope.$parent.cut.id + '_pairedSelected', $scope.cut.position);
                    }
                };

                $element.ready(function () {
                    //var $row =$('#row_' + $scope.cut.id);
                    var choice_pos = Math.floor((Math.random() * $scope.cut.options.length) + 1);
                    $scope.selectedChild = choice_pos;
                    var $choice = $("[data-cut-id=" + $scope.cut.id + '_child_' + $scope.cut.position + "]");
                    $choice.attr('data-selected-option', choice_pos);
                    var $camera = $('#camera_' + $scope.cut.id);
                    var sources =  $scope.cut.options[choice_pos - 1].sources;
                    var cameraVals = setCamera($camera, sources);
                    $scope.db_id = cameraVals.id;
                    //$row.attr('data-db-id', cameraVals.id);
                    //$row.attr('data-camera-code', cameraVals.code);
                    $choice.attr('data-db-id', $scope.db_id);

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
                var $camera = $('#camera_' + scope.cut.id);
                var sources = scope.cut.sources;
                scope.db_id = setCamera($camera, sources).id;
                $('#row_' + scope.cut.id).attr('data-db-id', setCamera($camera, sources).id);

                $camera.on('click', function () {
                    for (var a = 0; a < scope.cut.sources.length; a++) {
                        if (scope.cut.sources[a].id != scope.db_id) {
                            var camtext = camera(scope.cut.sources[a].file);
                            cameraCss($camera, camtext);
                            $camera.text(camtext);
                            scope.db_id = scope.cut.sources[a].id;
                            $('#row_' + scope.cut.id).attr('data-db-id', scope.cut.sources[a].id);
                            break;
                        }
                    }
                    scope.$root.cameraChanges++;
                    scope.$root.$apply()
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
                var $row = $('#row_' + $scope.cut.id);
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
                $row.removeClass('placementborder');
                $row.attr('data-db-id', $pauseOpt.attr('data-db-id'));
                $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
                $scope.$root.cameraChanges++;
                $scope.$root.$apply()
            };

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

            $scope.foldSeq = function(cut_id, seq_name){
                $('#collapse_' + cut_id + '_seq_' + seq_name).collapse('toggle');
                var $row = $('#row_' + cut_id + '_seq_' + seq_name);
                var $icon = $('#icon_' + cut_id + '_seq_'+ seq_name + '> i');
                if ($icon.hasClass('fa-chevron-right')) {
                    $icon.addClass('fa-chevron-down').removeClass('fa-chevron-right');
                    $row.addClass('seqsetline');

                } else {
                    $icon.addClass('fa-chevron-right').removeClass('fa-chevron-down');
                    $row.removeClass('seqsetline');
                }
            };
        },
        link: function (scope, $element, $attr, initData) {
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
                var $shortrow = $('[set-cut-id='+ scope.cut.id + '_seq_' + scope.cut.sets[0].name +']');
                var $medium = $('#row_' + scope.cut.id + '_seq_' + scope.cut.sets[1].name);
                var $mediumrow = $('[set-cut-id='+ scope.cut.id + '_seq_' + scope.cut.sets[1].name +']');
                var $long = $('#row_' + scope.cut.id + '_seq_' + scope.cut.sets[2].name);
                var $longrow = $('[set-cut-id='+ scope.cut.id + '_seq_' + scope.cut.sets[2].name +']');

                $short.on('mouseenter', function () {
                    $short.css('background-color', '#ebeded');
                    $shortrow.css('background-color', '#ebeded');
                });

                $short.on('mouseleave', function () {
                    $short.css('background-color', '#fbfdff');
                    $shortrow.css('background-color', '#fbfdff');
                });

                $medium.on('mouseenter', function () {
                    $medium.css('background-color', '#ebeded');
                    $mediumrow.css('background-color', '#ebeded');
                });

                $medium.on('mouseleave', function () {
                    $medium.css('background-color', '#fbfdff');
                    $mediumrow.css('background-color', '#fbfdff');
                });

                $long.on('mouseenter', function () {
                    $long.css('background-color', '#ebeded');
                    $longrow.css('background-color', '#ebeded');
                });

                $long.on('mouseleave', function () {
                    $long.css('background-color', '#fbfdff');
                    $longrow.css('background-color', '#fbfdff');
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
                $('#row_' + scope.cut.id + '_' + setNames[setChosen] + '_' + seqChosen).prop("disabled", true).toggleClass('optionbtn-disabled');
                $choice.text(capitaliseFirstLetter(setNames[setChosen]) + ' pause'); //\u00A0\u00A0\u00A0\u00A0' + cameraStr);
                $cameraDesc.text(cameraStr);
                $('#row_' + scope.cut.id).attr('data-db-id',  getIds(scope.cut.sets[setChosen].seqs[seqChosen]))

                if(!initData.widthset){
                    //console.log($('#row_' + scope.cut.id).attr('width'))
                    $('.scriptbox').css('width', $('#row_' + scope.cut.id).width() + 35);
                    initData.widthset = true;
                }
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

        controller: function ($scope, $element, $attrs, $rootScope) {
            var childReadyCount = 0;
            $scope.fold = function (val) {
                $('#collapse_' + val).collapse('toggle');
                if ($('#icon_' + val + '> i').hasClass('fa-chevron-right')) {
                    $('#icon_' + val + '> i').addClass('fa-chevron-down').removeClass('fa-chevron-right');
                    if($scope.cut.children[$attrs.selectedPosition-1].type == 'ALTERNATIVE_COMPOUND'){
                        $('#row_' + $scope.cut.id + '_sel').addClass('nextselectline');
                    }else{
                        console.log('just fuck off for now')
                    }
                    $('#row_' + ($scope.cut.id +1)).addClass('nextrowline');
                } else {
                    $('#icon_' + val + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
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
                    var choice_pos = Math.floor((Math.random() * $scope.cut.children.length));
                    $attrs.selectedPosition = $scope.selectedChild = choice_pos;
                    var $def_row = $('#def_' + $scope.cut.id + '_child_' + $attrs.selectedPosition);
                    var $optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + (choice_pos + 1) + "]");
                    var selectedOpt = $optSel.attr('data-selected-position');
                    $attrs.selectedChild = $scope.selectedChild = Number($optSel.attr('data-selected-position'));
                    $scope.db_id = Number($optSel.attr('data-db-id'));
                    console.log($scope.cut.children[choice_pos].type);
                    var child_type = $scope.cut.children[choice_pos].type;

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
                            console.log($defSel.text());
                            $def_choice.text($defSel.text());
                            $def_choice.css('padding-left', '0px');
                            var html_opt_div = "<div class='container'><div id=row_" + $scope.cut.id + "_sel class='row col-md-6'  style='background-color: #fbfdff;border-left: 1px solid #c6c7d2;'><div speaker-cut-id=" + $scope.cut.id + " class='col-md-1 speakertxt' 'style='padding-left: 0px;padding-top: 5px'></div><div  class ='col-md-9 compoundoption'><p class='default-text'></p></div><div class='col-md-2'><button id=camera_sel_" + $scope.cut.id + " db_id='0' ng-click='optCameraToggle()' class='pull-right camerabtn'>camera</button></div></div></div>";
                            var opt_div = $compile(html_opt_div)($scope, function(opt_div, $scope){
                                opt_div.find('p').text($optSel.text());
                                $('#row_' + $scope.cut.id).parent().after(opt_div);
                                //console.log('the selectedOpt that sometimes fails?: ' + selectedOpt);
                                var sel_sources = $scope.cut.children[choice_pos].options[selectedOpt - 1].sources;
                                var $sel_camera = $('#camera_sel_' + $scope.cut.id);
                                $scope.db_id = setCamera($sel_camera, sel_sources).id;

                            });

                            var def_sources = $scope.cut.children[$scope.selectedChild-1].default.sources;
                            var $def_camera = $('#camera_' + $scope.cut.id);
                            var del_source_id = setCamera($def_camera, def_sources).id;
                            $scope.db_id = del_source_id;

                            $camera = $('#camera_' + $scope.cut.id);
                            $camera.on('click', function () {
                                $camera = $('#camera_' + $scope.cut.id);
                                for (var a = 0; a < $scope.cut.children[$attrs.selectedPosition-1].default.sources.length; a++) {
                                    if ($scope.cut.children[$attrs.selectedPosition-1].default.sources[a].id != $scope.db_id) {
                                        var camtext = camera($scope.cut.children[$attrs.selectedPosition-1].default.sources[a].file);
                                        cameraCss($camera, camtext);
                                        $camera.text(camtext);
                                        $scope.db_id = $scope.cut.children[$attrs.selectedPosition-1].default.sources[a].id;
                                        $camera.attr('db_id', $scope.db_id);
                                        break;
                                    }
                                }
                            });

                            $camera_sel = $('#camera_sel_' + $scope.cut.id);
                            $camera_sel.on('click', function () {
                                for (var a = 0; a < $scope.cut.children[$attrs.selectedPosition - 1].options[$attrs.selectedChild - 1].sources.length; a++) {
                                    if ($scope.cut.children[$attrs.selectedPosition - 1].options[$scope.selectedChild - 1].sources[a].id != $scope.db_id) {
                                        var camtext = camera($scope.cut.children[$attrs.selectedPosition - 1].options[$scope.selectedChild - 1].sources[a].file);
                                        cameraCss($camera_sel, camtext);
                                        $camera_sel.text(camtext);
                                        $scope.db_id = $scope.cut.children[$attrs.selectedPosition - 1].options[$scope.selectedChild - 1].sources[a].id;
                                        $camera_sel.attr('db_id', $scope.db_id);
                                        break;
                                    }
                                }
                            });

                            $scope.$on($scope.cut.id + '_childSelected', function(e,val){
                                var $old_def = $('#def_' + $scope.cut.id +  '_child_' + $attrs.selectedPosition);
                                var $old_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $attrs.selectedPosition + "]");
                                $old_def.css('color', '#333');
                                $old_child_choice.css('color', '#333');
                                $attrs.selectedPosition = val;

                                var $new_def = $('#def_' + $scope.cut.id +  '_child_' + $attrs.selectedPosition);
                                var $new_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $attrs.selectedPosition + "]");
                                $new_def.css('color', '#ed6a43');
                                $new_child_choice.css('color', '#ed6a43');
                                var $def = $("[data-cut-id=def_" + $scope.cut.id + "]");
                                $def.text($new_def.text());
                                var $sel = $('#row_' + $scope.cut.id + '_sel');
                                $sel.find('p').text($new_child_choice.text());
                                $scope.fold($scope.cut.id);
                            });
                            break;

                        default:
                            console.log('default case in Parent Camera switch case');
                            break;
                    }

                    $scope.optCameraToggle = function(){
                        console.log('change the option camera')
                    };

                    childReadyCount = 0;
                }
            });
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
            cameraText: '@dataCameraText',
            cut: '='
        },

        templateUrl: 'templates/ctoria-child-compound.html',

        controller: function ($scope, $element, $document, $rootScope) {

            $scope.fold = function(val){
                $('#collapse_' + val).collapse('toggle');
                if ($('#def_icon_' + val + '> i').hasClass('fa-chevron-right')) {
                    $('#def_icon_' + val + '> i').addClass('fa-chevron-down').removeClass('fa-chevron-right');
                    $('#row_opt_' + $scope.cut.id + '_child_' + $scope.cut.position).addClass('nextselectline');
                } else {
                    $('#def_icon_' + val + '> i').addClass('fa-chevron-right').removeClass('fa-chevron-down');
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

                $rootScope.$broadcast($scope.cut.id + '_childSelected', $scope.cut.position);
            };

            $element.ready(function(){
                var choice_pos = Math.floor((Math.random() * $scope.cut.options.length) + 1);
                $scope.selected = choice_pos;
                var $choice = $("[data-cut-id=" + $scope.cut.id + '_child_' + $scope.cut.position + "]");
                $choice.attr('data-selected-position', choice_pos);
                var def_sources = $scope.cut.default.sources;
                var $def_camera = $('#camera_' + $scope.cut.id);
                $scope.db_id = setCamera($def_camera, def_sources).id;

                var $option = $('#' + $scope.cut.id + '_child_' + $scope.cut.position + '_opt_' + choice_pos);
                var opt_txt = $option.text();
                $choice.text( opt_txt);
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
            selectedChild: '@dataSelectedChild',
            selectedOption: '@dataSelectedOption',
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
                $rootScope.$broadcast($scope.cut.id, $attrs.selectedChild);
            }

            if($scope.cut.arguments.pos > 1){
                $scope.$on($scope.cut.arguments.prev, function(e, data){
                    //console.log('previous pos change: ' + data + ', heard in pos: ' + $scope.cut.arguments.pos);
                    $attrs.selectedChild = data;
                });

                $scope.$on($scope.cut.arguments.prev + '_pairedSelected', function(e, data){
                    console.log('previous pos change: ' + data + ', heard in pos: ' + $scope.cut.arguments.pos);
                    var $row = $('#row_' + $scope.cut.id);
                    var $old_optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedChild + "]");
                    $old_optSel.css('color', '#000000');
                    $attrs.selectedChild = data;
                    var $optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedChild + "]");
                    $optSel.css('color', '#ed6a43');
                    $scope.selectedOption = Number($optSel.attr('data-selected-option'));
                    var sources = $scope.cut.children[$attrs.selectedChild-1].options[$scope.selectedOption - 1].sources;
                    var cameraVals = setCamera($camera, sources);
                    $scope.db_id = cameraVals.id; //Number($optSel.attr('data-db-id'));
                    $row.attr('data-db-id', $scope.db_id);
                    //$row.attr('data-camera-code', cameraVals.code);

                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    var $speaker = $("[speaker-cut-id=" + $scope.cut.id + "]");
                    $speaker.text(speaker($scope.cut.id) );
                    $choice.text($optSel.text());
                    $choice.removeClass('placementborder');
                    $row.removeClass('placementborder');
                    $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
                    $scope.$root.dialogueChanges++;
                    //$scope.$root.$apply(); $apply already in progress
                });

                $scope.$on($scope.cut.id + '_pairedSelected', function(e,val){
                    var $row = $('#row_' + $scope.cut.id);
                    var $old_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_' + $attrs.selectedChild + "]");
                    $old_child_choice.css('color', '#000000');
                    $attrs.selectedChild = val;
                    var $new_child_choice = $("[data-cut-id=" + $scope.cut.id + '_child_'+ $attrs.selectedChild + "]");
                    $new_child_choice.css('color', '#ed6a43');

                    $scope.selectedOption = Number($new_child_choice.attr('data-selected-option'));
                    var sources = $scope.cut.children[$attrs.selectedChild-1].options[$scope.selectedOption - 1].sources;
                    var cameraVals = setCamera($camera, sources);
                    $scope.db_id = cameraVals.id; //Number($optSel.attr('data-db-id'));
                    $row.attr('data-db-id', $scope.db_id);

                    $('#collapse_' + $scope.cut.id).collapse('toggle');
                    $row.removeClass('placementborder');
                    $('#row_' + ($scope.cut.id +1)).removeClass('nextrowline');
                    $scope.$root.dialogueChanges++;
                    $scope.$root.$apply();
                })
            }

            $scope.$on($scope.cut.id + '_childReady', function(e, val){
                childReadyCount++;
                if(childReadyCount == $scope.cut.children.length){
                    var $row = $('#row_' + $scope.cut.id);
                    $camera = $('#camera_' + $scope.cut.id);
                    var $optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedChild + "]");
                    $scope.selectedOption = Number($optSel.attr('data-selected-option'));
                    var sources = $scope.cut.children[$attrs.selectedChild-1].options[$scope.selectedOption - 1].sources;
                    var cameraVals = setCamera($camera, sources);
                    $scope.db_id = cameraVals.id; // Number($optSel.attr('data-db-id'));
                    $row.attr('data-db-id', $scope.db_id);
                    $row.attr('data-camera-code', cameraVals.code);
                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    var $speaker = $("[speaker-cut-id=" + $scope.cut.id + "]");
                    $optSel.css('color', '#ed6a43');
                    $speaker.text(speaker($scope.cut.id));
                    $choice.text($optSel.text());
                    childReadyCount = 0;


                    $camera.on('click', function () {
                        var $self = $('#camera_' + $scope.cut.id);
                        for (var a = 0; a < $scope.cut.children[$attrs.selectedChild-1].options[$attrs.selectedOption - 1].sources.length; a++) {
                            if ($scope.cut.children[$attrs.selectedChild-1].options[$scope.selectedOption - 1].sources[a].id != $scope.db_id) {
                                var camtext = camera($scope.cut.children[$attrs.selectedChild-1].options[$scope.selectedOption - 1].sources[a].file);
                                cameraCss($camera, camtext);
                                $self.text(camtext);
                                $scope.db_id = $scope.cut.children[$attrs.selectedChild-1].options[$scope.selectedOption - 1].sources[a].id;
                                $camera.attr('db_id', $scope.db_id);
                                $scope.$root.cameraChanges++;
                                $scope.$root.$apply();
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
                    var $row = $('#row_' + $scope.cut.id);
                    var $option = $('#' + val);
                    var opt_txt = $option.text();
                    var cut_id = val.substr(0, val.indexOf('_'));
                    var $choice = $("[data-cut-id=" + cut_id + "]");
                    var $speaker = $("[speaker-cut-id=" + $scope.cut.id + "]");
                    $speaker.text(speaker($scope.cut.id));
                    $choice.text(opt_txt);
                    var cameracode = $row.attr('data-camera-code');
                    var sources = $scope.cut.options[$option.attr('data-position') -1].sources;
                    $row.attr('data-db-id', idFromCode(sources, cameracode));
                    $rootScope.dialogueChanges++;
                    //$rootScope.$apply(); $apply already in progress

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
                        $rootScope.dialogueChanges++;
                        $rootScope.$apply();
                    });
                }

                $element.ready(function () {
                    var $row = $('#row_' + $scope.cut.id);
                    var choice_pos = Math.floor((Math.random() * $scope.cut.options.length) + 1);
                    $scope.selected = $attrs.selectedPosition= choice_pos;
                    //console.log($attrs.selectedPosition);
                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    var $speaker = $("[speaker-cut-id=" + $scope.cut.id + "]");
                    $choice.attr('data-selected-position', choice_pos);
                    var $camera = $('#camera_' + $scope.cut.id);
                    var sources = $scope.cut.options[choice_pos - 1].sources;
                    var cameraVals = setCamera($camera, sources);
                    $scope.db_id = cameraVals.id;
                    $row.attr('data-db-id', cameraVals.id);
                    $row.attr('data-camera-code', cameraVals.code);


                    if($scope.cut.arguments.pos ==1 ) {
                        $rootScope.$broadcast($scope.cut.id, choice_pos);
                    }

                    var $option = $('#' + $scope.cut.id + '_opt_' + choice_pos);
                    $speaker.text(speaker($scope.cut.id));
                    var opt_txt = $option.text();
                    $choice.text( opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $row.css('background-color', '#ebeded')
                    });

                    $choice.on('mouseleave', function () {
                        $row.css('background-color', '#fbfdff')
                    });


                    $camera.on('click', function () {
                        for (var a = 0; a < $scope.cut.options[$scope.selected - 1].sources.length; a++) {
                            if ($scope.cut.options[$scope.selected - 1].sources[a].id != $scope.db_id) {
                                var camtext = camera($scope.cut.options[$scope.selected - 1].sources[a].file);
                                cameraCss($camera, camtext);
                                $camera.text(camtext);
                                $scope.db_id = $scope.cut.options[$scope.selected - 1].sources[a].id;
                                $camera.attr('db_id', $scope.db_id);
                                $rootScope.cameraChanges++;
                                $rootScope.$apply();
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