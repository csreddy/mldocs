'use strict';

angular
    .module('mldocsApp')
    .controller('MainCtrl', ['$scope', '$timeout', '$mdSidenav', '$mdUtil', '$log', 'Search', '$state', 'modules', 'apiList',
        function($scope, $timeout, $mdSidenav, $mdUtil, $log, Search, $state, modules, apiList) {

            $scope.message = 'hello from mainctrl';
            $scope.results = [];
            $scope.modules = modules.data[0].facets;
            $scope.apiList = apiList.data;
            // remove lib to make suggestion data compatible between normal suggest and fuzzy-suggest
            var modifiedApiList = $scope.apiList.map(function(item) {
                return item.apiName;
            });

            $scope.query = {
                q: '',
                fuzzy: false,
                strict: true,
                suggestions: [],
                strictSuggest: function(text) {
                    Search.suggest({
                        q: text,
                        facetsOnly: false
                    }).success(function(results) {
                        $scope.query.suggestions = _.compact(results);
                    }).error(function(error) {
                        console.log('error', error);
                    });
                },
                fuzzySuggest: function(text) {
                    var options = {
                        keys: ['lib', 'apiName']
                    };

                    var f = new Fuse(modifiedApiList, options);
                    $scope.query.suggestions = f.search(text);
                },
                suggest: function(text) {
                    var fuzzySuggestions = [];
                    var strictSuggestions = [];
                    try {
                        var f = new Fuse(modifiedApiList);
                        fuzzySuggestions = f.search(text); // this returns indexes
                        fuzzySuggestions = fuzzySuggestions.map(function(index) {
                            return modifiedApiList[index];
                        });
                    } catch (e) {
                        console.log(e.message);
                    }

                    //console.log('fuzzySuggestions', fuzzySuggestions);
                    Search.suggest({
                        q: text,
                        facetsOnly: false
                    }).success(function(results) {
                        strictSuggestions = _.compact(results);
                        //console.log('strictSuggestions', strictSuggestions);
                        $scope.query.suggestions = _.uniq(_.flatten([strictSuggestions, fuzzySuggestions], true));
                        //console.log('suggestions', $scope.suggestions);
                    }).error(function(error) {
                        console.log('error', error);
                    });
                },

                selectedApi: function() {
                    console.log('selectedApi');
                }
            };


            // for search
            $scope.search = function(text, fromSuggest) {

                $scope.query.q = text || $scope.query.q;
                var prefix = (fromSuggest) ? 'api:' : '';
                Search.search({
                    q: prefix + $scope.query.q,
                    facetsOnly: false
                }).success(function(response) {

                    // remove first item from array
                    $scope.results = _.rest(response);

                    // pluck only 'contents' 
                    $scope.results = _.pluck($scope.results, 'content');

                    // console.log('search results', $scope.results);

                }).error(function(error) {
                    console.error('Error', error);
                });
            };


            // for displaying api documentation
            $scope.details = function() {
                var url = '/' + $state.params.detail.replace(':', '/') + '.json';
                Search.get(url).success(function(doc) {
                    $scope.api = doc;
                   // console.log('api', $scope.api);
                }).error(function(error) {
                    console.error('error', error);
                });
            };

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

                  //  console.log('list', $scope.list);
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
               // console.log('api', $scope.api);
            }).error(function(error) {
                console.error('error', error);
            });
        }
    ])
    .controller('NavCtrl', ['$scope', '$mdSidenav',
        function($scope, $mdSidenav) {
            $scope.showSidebar = function() {
                return !$mdSidenav('left').isLockedOpen();
            }.call();

            // for sidebar toggling
            $scope.toggleSideBar = function() {
                console.log('toggling...');
                $mdSidenav('left').toggle();
            };
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