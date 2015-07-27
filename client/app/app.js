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
        //$mdThemingProvider.theme('my').primaryPalette('red');
        // $mdThemingProvider.setDefaultTheme('my');

        var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });
        $mdThemingProvider.definePalette('customBlue', customBlueMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue', {
                'default': '500',
                'hue-1': '50'
            })
            .accentPalette('pink');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')


            // icons
        //    $mdIconProvider.fontSet('fa', 'fontawesome');
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
                    resolve: {
                        modules: function(Search) {
                            return Search.search({
                                q: '',
                                facetsOnly: true
                            }).success(function(result) {
                                var facets = result[0].facets;
                                _.forEach(facets, function(bucket, key) {
                                    facets[key] = bucket.facetValues;
                                });
                                //  console.log('facets', facets);
                                return facets;
                            }).error(function(error) {
                                console.error('ERROR with facets', error);
                            });
                        },
                        apiList: function(Search) {
                            return Search.all().success(function(result) {
                                return result;
                            }).error(function(error) {
                                console.log('error', error);
                            });
                        }
                    },
                    views: {
                        '': {
                            templateUrl: 'app/main/main.html',
                            controller: 'MainCtrl',
                        },
                        'sidebar': {
                            templateUrl: 'app/main/sidebar.html',
                            controller: 'MainCtrl'
                        },
                        'navbar':{
                            templateUrl: 'app/main/navbar.html',
                            controller: 'NavCtrl'
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