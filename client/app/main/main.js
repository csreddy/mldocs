'use strict';

angular.module('mldocsApp')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider
                .state('app.api', {
                    url: 'api/{api}',
                    views: {
                        '@': {
                            templateUrl: 'app/main/detail.html',
                            controller: 'SearchCtrl'
                        }
                    }
                })
                .state('app.search', {
                    url: 'search',
                    views: {
                        'search@': {
                            templateUrl: 'app/main/search.html',
                            controller: 'SearchCtrl'
                        }
                    }
                })
                .state('app.content', {
                    url:'content',
                    views: {
                        '@': {
                            templateUrl: 'app/main/content.html',
                            controller: 'ResultCtrl'
                        }
                    }
                })
                .state('app.content.detail', {
                    url: 'detail',
                    views: {
                        '@': {
                            templateUrl: 'app/main/detail.html',
                            controller: 'SearchCtrl'
                        }
                    }
                });
        }
    ]);