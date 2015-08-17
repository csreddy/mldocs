'use strict';

angular.module('mldocsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'search.service',
    'offline.service'
]).config(['$mdThemingProvider', '$mdIconProvider',
    function($mdThemingProvider, $mdIconProvider) {

        // app theme
        //$mdThemingProvider.theme('default').dark;
        $mdThemingProvider.theme('teal').primaryPalette('teal');
        $mdThemingProvider.setDefaultTheme('teal');

        // var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
        //     'contrastDefaultColor': 'light',
        //     'contrastDarkColors': ['50'],
        //     '50': 'ffffff'
        // });
        // $mdThemingProvider.definePalette('customBlue', customBlueMap);
        // $mdThemingProvider.theme('default')
        //     .primaryPalette('customBlue', {
        //         'default': '500',
        //         'hue-1': '50'
        //     })
        //     .accentPalette('pink');
        // $mdThemingProvider.theme('input', 'default')
        //     .primaryPalette('grey')


        // icons
        //    $mdIconProvider.fontSet('fa', 'fontawesome');
    }
])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
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
                        isOnline: ['offline',
                            function(offline) {
                               return offline.checkIsOnline().then(function(response) {
                                    return response.data.isOnline;
                                }, function(error) {
                                    return false;
                                });
                            }
                        ],
                        modules: ['Search',
                            function(Search) {
                                return Search.search({
                                    q: '',
                                    facetsOnly: true
                                }).then(function(result) {
                                    var facets = result.data[0].facets;
                                    _.forEach(facets, function(bucket, key) {
                                        facets[key] = bucket.facetValues;
                                    });
                                    //  console.log('facets', facets);
                                    return facets;
                                }, function(error) {
                                    console.error('Error getting modules', error);
                                    if (error.state === 503) {
                                        return [];
                                    }

                                });
                            }
                        ],
                        apiList: ['Search',
                            function(Search) {
                                return Search.all().then(function(result) {
                                    return _.pluck(result.data, 'apiName');
                                }, function(error) {
                                    console.error('Error getting api <list></list>', error);
                                    if (error.state === 503) {
                                        return [];
                                    }
                                });
                            }
                        ]
                    },
                    views: {
                        '': {
                            templateUrl: 'app/main/main.html',
                            controller: 'SearchCtrl',
                        },
                        'sidebar': {
                            templateUrl: 'app/main/sidebar.html',
                            controller: 'SearchCtrl'
                        },
                        'navbar': {
                            templateUrl: 'app/main/navbar.html',
                            controller: 'NavCtrl'
                        },
                        /* '': {
                            templateUrl: 'app/main/result.html',
                            controller: 'ResultCtrl'
                        }*/
                    }
                });

            $locationProvider.html5Mode(true);
        }
    ])
    .filter('cut', function() {
        return function(value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    })
    .run(
        ['$rootScope', '$state', '$stateParams', 'offline',
            function($rootScope, $state, $stateParams, offline) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                // offline.getDBSchema()
            }
        ]);