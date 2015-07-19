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

                    $state.get('app.content').data.result = $scope.results;
                    $state.go('app.content', null, {
                        reload: false
                    });
                    console.log('results', $scope.results);

                }).error(function(error) {
                    console.error('Error', error);
                });
            };
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
                console.log('ERROR with facets', error);
            });


            $scope.setPage = function() {
                $state.transitionTo('main.sidebar');
            };

        }
    ])
    .controller('ResultCtrl', ['$scope', '$state',
        function($scope, $state) {
            console.log('in ResultCtrl..');
            console.log('current state in ResultCtrl:', $state.current);
            $scope.results = $state.get($state.current).data.result;
            //console.log('state.get',);
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
                    console.log('Error in list', error);
                });
            };

            $scope.getList($state.params.lib);
        }
    ])
    .controller('DetailCtrl', ['$scope', '$state', 'Search',
        function($scope, $state, Search) {
      console.log('$state', $state);
      var url = '/'+ $state.params.detail.replace(':', '/')+ '.json';
          Search.get(url).success(function(doc) {
              $scope.api = doc;
              console.log('api', $scope.api);
          }).error(function(error) {
            console.log('error', error);
          });
        }
    ]);