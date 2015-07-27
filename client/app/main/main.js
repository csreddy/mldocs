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