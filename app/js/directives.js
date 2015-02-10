/**
 * Created by ian on 07.02.15.
 */
var scriptBoxWidgets = angular.module('scriptBoxWidgets', ['ui.bootstrap']);

scriptBoxWidgets
    .controller('altFreeCtrl', ['$scope', function($scope){
        console.log($scope.data)
        $scope.playClick = function(){
            alert('ctrl click')
        }
    }])

    .directive('ctoriaAltFree', function () {
        //var that = this;
    return {
        restrict: 'E',
        scope:
        {
        /* position: '=',
         isSelected: '=',*/
         cut:'='
         },
        templateUrl: 'templates/ctoria-alt-free.html',
        //controllerAs: 'AlternativeFreeCtrl'
       controller: function ($scope, $element) {

            /*$scope.playClick = function (val) {
                var opt_txt =  $('#'+val).text()
                $('#'+val).parent().prev().text(opt_txt);
                $('#'+val).parent().collapse({'isCollapsed': true});
            }*/
        },

        link: function ($scope, el, attrs) {

            $scope.playClick = function (val) {

                var opt_txt =  $('#'+val).text()
                var $option =  $('#'+val);
                var cut_id = val.substr(0, val.indexOf('_'))
                var $choice = $("[data-cut-id="+ cut_id + "]")

                $choice.text(opt_txt);
                $('#collapse_' + cut_id).collapse('toggle');
                $('#icon_' + cut_id + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
                if($choice.attr('data-selected-position') != 0){
                    $('#' + cut_id + '_opt_' + $choice.attr('data-selected-position')).prop("disabled", false).toggleClass('optionbtn-disabled');
                }
                $option.prop("disabled", true).toggleClass('optionbtn-disabled');
                $choice.attr('data-selected-position', $option.attr('data-position'));
            }

            $scope.fold = function(val){
                $('#collapse_' + val).collapse('toggle');

                if($('#icon_' + val + '> i').hasClass('glyphicon-chevron-right')){
                    $('#icon_' + val + '> i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right')
                }else {
                    $('#icon_' + val + '> i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down')
                }
            }


        }
    }

});

scriptBoxWidgets.directive('ctoriaDefault', function () {
    var custom_html = '<div>default {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope: true
    }

});

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