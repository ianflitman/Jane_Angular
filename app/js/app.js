var janeApp = angular.module('janeApp', [
    'ngRoute',
    'ngResource',
    'ui.bootstrap',
    'janeControllers',
    'scriptBoxWidgets',
    'janeFilters',
    'janeServices'
]);

janeApp.value('initData', {
    widthset:false
});
janeApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/script', {
                templateUrl: 'partials/script.html',
                controller: 'MasterScriptController'
            }).
            otherwise({
                redirectTo: '/script'
            });
    }]);