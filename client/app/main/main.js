'use strict';

angular.module('mldocsApp')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider
                .state('app.api', {
                    url: 'api/{api}',
                    views: {
                        '@': {
                            templateUrl: 'app/main/content.html',
                            controller: 'ContentCtrl'
                        }
                    }
                });

               $stateProvider
                .state('app.search', {
                    views: {
                        'search@': {
                            templateUrl: 'app/main/search.html',
                            controller: 'MainCtrl'
                        }
                    }
                }); 

                $stateProvider
                .state('app.results', {
                    views: {
                        'results@': {
                            templateUrl: 'app/main/results.html',
                            controller: 'ResultsCtrl'
                        }
                    }
                }); 
        }
    ]);