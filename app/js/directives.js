/**
 * Created by ian on 07.02.15.
 */
var scriptBoxWidgets = angular.module('scriptBoxWidgets', []);

scriptBoxWidgets.directive('altFree', function(){
    var custom_html = '<div>alt free {{cut.id}}</div>';
    return {
        restrict: 'E',
        scope: true,
        template: custom_html
    };


});

scriptBoxWidgets.directive('default', function (){
    var custom_html = '<div>default {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope:true,
        template: custom_html
    }

});

scriptBoxWidgets.directive('seqSet', function (){
    var custom_html = '<div>sequence set {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope:true,
        template: custom_html
    }

});

scriptBoxWidgets.directive('altPaired', function (){
    var custom_html = '<div>alternative paired {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope:true,
        template: custom_html
    }

});

scriptBoxWidgets.directive('altParent', function (){
    var custom_html = '<div>alternative parent {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope:true,
        template: custom_html
    }

});

scriptBoxWidgets.directive('altPairedParent', function (){
    var custom_html = '<div>alternative paired parent {{cut.id}}</div>'
    return {
        restrict: 'E',
        scope:true,
        template: custom_html
    }

});