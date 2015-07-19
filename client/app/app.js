'use strict';

angular.module('mldocsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'search.service'
]).config(['$mdThemingProvider', '$mdIconProvider',
    function($mdThemingProvider, $mdIconProvider) {
        
        // app theme
        //$mdThemingProvider.theme('default').dark();
        
        /// icons
        $mdIconProvider
            .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
            .defaultIconSet('img/icons/sets/core-icons.svg', 24);
    }
])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider, $state) {
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
                            controller: 'SearchCtrl',
                        },
                        'sidebar': {
                            templateUrl: 'app/main/sidebar.html',
                            controller: 'SidebarCtrl'
                        }
                    }
                });

            $locationProvider.html5Mode(true);
        }
    ]).run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]);