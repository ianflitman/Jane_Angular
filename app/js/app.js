var janeApp = angular.module('janeApp', [
    'ngRoute',
    'janeControllers',
    'scriptBoxWidgets'
]);

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