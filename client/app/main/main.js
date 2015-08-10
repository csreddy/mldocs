'use strict';

angular.module('mldocsApp')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider
                .state('app.search', {
                    url: 'search?q={search}',
                    views: {
                        '@': {
                            templateUrl: 'app/main/main.html',
                            controller: 'SearchCtrl'
                        }
                    }
                })
                .state('app.search.result', {
                    // url: 'search?q={search}',
                    views: {
                        '@': {
                            templateUrl: 'app/main/result.html',
                            controller: 'SearchCtrl'
                        }
                    }
                })
                .state('app.list', {
                    url: 'list/{lib}',
                    views: {
                        '@': {
                            templateUrl: 'app/main/list.html',
                            controller: 'ListCtrl'
                        }
                    }
                })
                .state('app.detail', {
                    url: 'api?uri={detail}',
                    views: {
                        '@': {
                            templateUrl: 'app/main/detail.html',
                            controller: 'DetailCtrl'
                        }
                    }
                });
        }
    ]);