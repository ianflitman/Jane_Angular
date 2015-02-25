/**
 * Created by ian on 07.02.15.
 */
var scriptBoxWidgets = angular.module('scriptBoxWidgets', ['ui.bootstrap', 'janeFilters']);

scriptBoxWidgets
    .controller('altFreeCtrl', ['$scope', function ($scope) {
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
    .controller('altChildFreeCtrl', ['$scope', function ($scope, $rootScope) {
    }])

    .directive('ctoriaChildAltFree', ['cameraFilter', function (camera, $rootScope ) {
        return {
            restrict: 'E',
            scope: {
                db_id: '@',
                selected: '@dataSelectedPosition',
                childIndex: '=',
                cut: '='
            },
            templateUrl: 'templates/ctoria-child-alt-free.html',
            controller: function ($scope, $element, $rootScope) {

                $scope.fold = function (val) {
                    $('#collapse_' + val).collapse('toggle');
                    if ($('#icon_' + val + '> i').hasClass('glyphicon-chevron-right')) {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                    } else {
                        $('#icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                    }
                }

                $scope.optionClick = function (val) {
                    var opt_txt = $('#' + val).text();
                    var $option = $('#' + val);
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
                };

                $scope.$on('chosen', function(e, val){
                    console.log('change heard: ' + val)
                });


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
                    }

                    var $option = $('#' + $scope.cut.id + '_child_' + $scope.cut.position + '_opt_' + choice_pos);
                    var opt_txt = $option.text();
                    $choice.text(opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#edd99f')
                    })

                    $choice.on('mouseleave', function () {
                        $('#row_' + $scope.cut.id + '_child_' + $scope.cut.position).css('background-color', '#f5eac9')
                    })

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

                    $rootScope.$broadcast($scope.cut.id + '_childReady');
                });


                //this.autoselecter('another auto')
            },


            link: function (scope, $element, $attr, $rootScope) {

                /*$element.ready(function ($rootScope) {
                    var choice_pos = Math.floor((Math.random() * scope.cut.options.length) + 1);
                    scope.selectedChild = choice_pos;
                    var $choice = $("[data-cut-id=" + scope.cut.id + '_child_' + scope.cut.position + "]");
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

                    var $option = $('#' + scope.cut.id + '_child_' + scope.cut.position + '_opt_' + choice_pos);
                    var opt_txt = $option.text();
                    $choice.text(opt_txt);
                    $option.prop("disabled", true).toggleClass('optionbtn-disabled');

                    $choice.on('mouseenter', function () {
                        $('#row_' + scope.cut.id + '_child_' + scope.cut.position).css('background-color', '#edd99f')
                    })

                    $choice.on('mouseleave', function () {
                        $('#row_' + scope.cut.id + '_child_' + scope.cut.position).css('background-color', '#f5eac9')
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

                    $rootScope.$broadcast(scope.cut.id + '_childReaady', scope.cut.position )
                });
*/

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
                        ;
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
                }

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

/*scriptBoxWidgets.directive('ctoriaAltPaired', function () {
    var custom_html = '<div>alternative paired {{cut.id}}</div>';
    return {
        restrict: 'E',
        scope: true,
        template: custom_html
    }

});*/

scriptBoxWidgets.directive('ctoriaAltParent', function () {
    var custom_html = '<div>alternative parent {{cut.id}}</div>';
    return {
        restrict: 'E',
        scope: {
            cut: '='
        },
        template: custom_html,

        controller: function ($scope, $element, $document) {

        },

        link: function (scope, $element, $attr) {
            $element.ready(function () {
                console.log(scope.cut.id)
            })
        }

    }

});

scriptBoxWidgets.directive('ctoriaAltCompound', function () {
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

scriptBoxWidgets.directive('ctoriaAltPairedParent', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            cut: '='
        },
        templateUrl: 'templates/ctoria-alt-paired-parent.html',

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
                    console.log('previous pos change: ' + data + ', heard in pos: ' + $scope.cut.arguments.pos)
                    $attrs.selectedPosition = data;
                })
            }

            $scope.$on('chosen', function(e, val){
                console.log('heard: ' + val)
            });

            $scope.$on($scope.cut.id + '_childReady', function(e, val){
                childReadyCount++;
                if(childReadyCount == $scope.cut.children.length){
                    var $optSel = $("[data-cut-id="+ $scope.cut.id + "_child_" + $attrs.selectedPosition + "]");
                    var $choice = $("[data-cut-id=" + $scope.cut.id + "]");
                    $choice.text($optSel.text());
                    childReadyCount = 0;
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

                var $optSelk = $( this  > ":button[data-cut-id="+ scope.cut.id + "_child_" + $attrs.selectedPosition + "]");
                var $optSel = $("[data-cut-id="+ scope.cut.id + "_child_2]");
                console.log('test print' + $optSel.text());

                $optSel.ready(function(){
                    console.log('now I am ready to read: ' + $optSel.text())
                });
            })
        }
    }
});

scriptBoxWidgets
    .controller('altPairedCtrl', ['$scope', function ($scope, $rootScope) {
    }])

    .directive('ctoriaAltPaired', ['cameraFilter', function (camera) {
        return {
            restrict: 'E',
            scope: {
                db_id: '@',
                selected: '@dataSelectedPosition',
                cut: '='
            },
            templateUrl: 'templates/ctoria-alt-paired.html',
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
                        $rootScope.$broadcast($scope.cut.id, $attrs.selectedPosition);
                        $scope.$on($scope.cut.arguments.next, function(e, data){
                            console.log('next pos change: ' + data + ', heard in pos: ' + $scope.cut.arguments.pos)
                        })
                    }
                };

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
                    //console.log($scope.)
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
                        for (var a = 0; a < $scope.cut.options[scope.selected - 1].sources.length; a++) {
                            if ($scope.cut.options[scope.selected - 1].sources[a].id != $scope.db_id) {
                                $('#camera_' + $scope.cut.id).text(camera($scope.cut.options[scope.selected - 1].sources[a].file));
                                scope.db_id = $scope.cut.options[scope.selected - 1].sources[a].id;
                                $('#camera_' + $scope.cut.id).attr('db_id', $scope.db_id);
                                break;
                            }
                        }
                    });
                });
            },


            link: function (scope, $element, $attr, $scope) {

                /*$element.ready(function () {
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
                    //console.log($scope.)
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
                });*/
            }
        }
    }]);