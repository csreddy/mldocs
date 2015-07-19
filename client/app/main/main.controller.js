'use strict';

angular
    .module('mldocsApp')
    .controller('SearchCtrl', ['$scope', '$timeout', '$mdSidenav', '$mdUtil', '$log', 'Search', '$state',
        function($scope, $timeout, $mdSidenav, $mdUtil, $log, Search, $state) {

            $scope.message = 'hello from mainctrl';
            $scope.results = [];

            $scope.search = function() {
                Search.search({
                    q: $scope.q,
                    facetsOnly: false
                }).success(function(response) {

                    // remove first item from array
                    $scope.results = _.rest(response);

                    // pluck only 'contents' 
                    $scope.results = _.pluck($scope.results, 'content');

                    console.log('current state in SearchCtrl:', $state.current);


                    $state.get('app.results').data.result = $scope.results;
                    $state.go('app.results', null, { reload: true });

                    console.log('results', $scope.results);

                }).error(function(error) {
                    console.error('Error', error);
                });
            };
        }
    ])
    .controller('ResultCtrl', ['$scope', '$state',
        function($scope, $state) {
            console.log('in ResultCtrl..');
            console.log('current state in ResultCtrl:', $state.current);

            $scope.searchResults = $state.get($state.current).data.result;
            $scope.$watch('searchResults', function() {
              console.log('searchResults updated');
            });

            console.log('searchResults', $scope.searchResults);
        }
    ])
    .controller('SidebarCtrl', ['$scope', '$http', '$timeout', '$mdSidenav', '$log', '$state', 'Search',
        function($scope, $http, $timeout, $mdSidenav, $log, $state, Search) {

            Search.search({
                q: $scope.q,
                facetsOnly: true
            }).success(function(result) {
                $scope.facets = result[0].facets;
                _.forEach($scope.facets, function(bucket, key) {
                    $scope.facets[key] = bucket.facetValues;
                });
                console.log('facets', $scope.facets);

            }).error(function(error) {
                console.error('ERROR with facets', error);
            });

        }
    ])

.controller('ListCtrl', ['$scope', '$state', 'Search',
    function($scope, $state, Search) {
        console.log($state);
        $scope.getList = function(name) {
            Search.search({
                collection: name
            }).success(function(result) {
                $scope.list = result;
                // remove first item from array
                $scope.list = _.rest(result);

                // pluck only 'contents' 
                $scope.list = _.pluck($scope.list, 'content');

                console.log('list', $scope.list);
            }).error(function(error) {
                console.error('Error in list', error);
            });
        };

        $scope.getList($state.params.lib);
    }
])
    .controller('DetailCtrl', ['$scope', '$state', 'Search',
        function($scope, $state, Search) {
            console.log('$state', $state);
            var url = '/' + $state.params.detail.replace(':', '/') + '.json';
            Search.get(url).success(function(doc) {
                $scope.api = doc;
                console.log('api', $scope.api);
            }).error(function(error) {
                console.error('error', error);
            });
        }
    ])
    .controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            $mdSidenav('right').close()
                .then(function() {
                    $log.debug("close RIGHT is done");
                });
        };
    });