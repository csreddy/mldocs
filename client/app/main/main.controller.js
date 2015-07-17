'use strict';

angular
    .module('mldocsApp')
    .controller('MainCtrl', ['$scope', '$timeout', '$mdSidenav', '$mdUtil', '$log', 'Search', '$state',
        function($scope, $timeout, $mdSidenav, $mdUtil, $log, Search, $state) {

            $scope.message = 'hello from mainctrl';
            $scope.results = [];
            $scope.search = function() {
                Search.search({
                    q: $scope.q
                }).success(function(response) {

                    // remove first item from array
                    $scope.results = _.rest(response);

                    // pluck only 'contents' 
                    $scope.results = _.pluck($scope.results, 'content');

                    // filter only documents which has 'module' as the root
                    $scope.results = _.filter($scope.results, 'module');

                    $state.go('app.results', {results: $scope.results});
                    console.log('results', $scope.results);

                }).error(function(error) {
                    console.error('Error', error);
                });
            };



            // private functions
            function extractFunctions(functionList) {

            }
        }
    ])
    .controller('SidebarCtrl', ['$scope', '$http', '$timeout', '$mdSidenav', '$log', '$state',
        function($scope, $http, $timeout, $mdSidenav, $log, $state) {

            $http.get('/api/things').success(function(awesomeThings) {
                $scope.awesomeThings = awesomeThings;
            });


            $scope.setPage = function() {
                $state.transitionTo('main.sidebar');
            };

        }
    ]).controller('ContentCtrl', ['$scope',
        function($scope) {
            $scope.content = Math.random();
        }
    ]).controller('ResultsCtrl', ['$scope',
        function($scope) {
            //$scope.results = 'ResultsCtrl = ' + Math.random();
        }
    ]);