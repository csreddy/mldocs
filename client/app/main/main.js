'use strict';

angular.module('mldocsApp')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider
                .state('app.list', {
                    url: 'list/{lib}',
                    views: {
                        '@': {
                            templateUrl: 'app/main/list.html',
                            controller: 'ListCtrl'
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
                    // url:'content',
                    views: {
                        '@': {
                            templateUrl: 'app/main/content.html',
                            controller: 'ResultCtrl'
                        }
                    }
                })
                .state('app.detail', {
                    url: '{detail}',
                    views: {
                        '@': {
                            templateUrl: 'app/main/detail.html',
                            controller: 'DetailCtrl'
                        }
                    }
                });
        }
    ]);