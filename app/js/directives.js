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
                //var html = $($.parseHTML("<i class="pull-right glyphicon glyphicon-chevron-down" ng-class="{'glyphicon-chevron-down': isCollapsed, 'glyphicon-chevron-right': !isCollapsed}"></i>")
                //var inner = $('#'+val).parent().prev().html("free alt 972
                //<i class="pull-right glyphicon glyphicon-chevron-down" ng-class="{'glyphicon-chevron-down': isCollapsed, 'glyphicon-chevron-right': !isCollapsed}"></i>")

                var opt_txt =  $('#'+val).text()
                var $option =  $('#'+val);
                var $choice = $('#'+val).parent().prev();
                var str = '<i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': isCollapsed, \'glyphicon-chevron-right\': !isCollapsed}"></i>';
                var html = $.parseHTML("<i class=\"pull-right glyphicon\" ng-class=\"{\'glyphicon-chevron-down\': isCollapsed, \'glyphicon-chevron-right\': !isCollapsed}\"></i>")
                $('#'+val).parent().prev().text(opt_txt).append(html)//'<i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': isCollapsed, \'glyphicon-chevron-right\': !isCollapsed}"></i>');
                $('#'+val).parent().collapse({'isCollapsed': true});
                //$('#'+val).parent().prev().text().append(str);
                //$choice.text().append(str);

            }

            //if(scope.$last) {
                //$('button.optionbtn').click(function () {
                    //var choice = $(this).parent().prev()[0];
                    //alert(choice.text());
                    //choice.innerText = this.innerText;

                    //alert(el.text());

                    //alert(this.text);
                    //var collapse_div = $(this).parent()[0];



                    //var coll_atr = collapse_div.attr('collapse');

                    //collapse_div.collapse({'isCollapsed': true})


                    //collapse_div.attr('collapse', 'isCollapsed');
                    //var coll_atr_after = collapse_div.attr('collapse');

                    //console.log(coll_atr)
                    //console.log(coll_atr_after)
                    //$(this).parent()[0].attr('collapse', true)
                //});


                //var choiceTxt = el.children()[0].attr('text');
                var options = $('.optionbtn');
                var doSomething = function () {
                    console.log('hi')
                    return;
                }
                var doSomethingElse = function () {
                    console.log('option click');
                }
            }


        //}
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