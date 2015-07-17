'use strict';

angular.module('mldocsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'search.service'
])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        /*$urlRouterProvider
            .when('/app/:api', ['$state',
                function($state) {
                    $state.go('app.api');
                }
            ]);
        */

        $urlRouterProvider
            .otherwise('/');

        $stateProvider
            .state('app', {
                url: '/',
                data: {
                    result: null
                },
                views: {
                    'search': {
                        templateUrl: 'app/main/search.html',
                        controller: 'SearchCtrl',

                    },
                    '': {
                        templateUrl: 'app/main/main.html',
                        controller: 'ResultCtrl',
                    },
                    'sidebar': {
                        templateUrl: 'app/main/sidebar.html',
                        controller: 'SidebarCtrl'
                    }
                }
            });


        $locationProvider.html5Mode(true);
    }).run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]);