'use strict';

angular
    .module('mldocsApp')
    .controller('SearchCtrl', ['$scope', '$timeout', 'isOnline', '$mdSidenav', '$mdUtil', '$log', 'Search', '$state', 'modules', 'apiList', 'offline',
        function($scope, $timeout, isOnline, $mdSidenav, $mdUtil, $log, Search, $state, modules, apiList, offline) {

            console.log('---------- THE APP IS ONLINE: ' + isOnline + '  ------------');
            $scope.intro = true;
            $scope.results = [];
            $scope.modules = modules || [];
            var _apiList = apiList || [];

            if (!isOnline) {
                //  get api list
                offline.apiList().then(function(apis) {
                    _apiList = apis;
                }, function(error) {
                    console.log('Error getting offline api list', error);
                });
                // get module list
                offline.moduleList().then(function(modules) {
                    $scope.modules = modules;
                }, function(error) {
                    console.log('Error getting offline api list', error);
                });

            }


            $scope.query = {
                q: $state.params.q || '',
                fuzzy: false,
                strict: true,
                suggestions: [],
                strictSuggest: function(text) {
                    Search.suggest({
                        q: decodeURIComponent(text),
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

                    var f = new Fuse(_apiList, options);
                    $scope.query.suggestions = f.search(text);
                },
                suggest: function(text) {
                    var fuzzySuggestions = [];
                    var strictSuggestions = [];
                    try {
                        var f = new Fuse(_apiList);
                        fuzzySuggestions = f.search(text); // this returns indexes
                        fuzzySuggestions = fuzzySuggestions.map(function(index) {
                            return _apiList[index];
                        });
                    } catch (e) {
                        console.log(e.message);
                    }

                    // if app is offline, then get suggestions from fuzzy search only, 
                    // do not call ML suggest api
                    if (!isOnline) {
                        $scope.query.suggestions = fuzzySuggestions;
                        return;
                    }

                    Search.suggest({
                        q: decodeURIComponent(text),
                        facetsOnly: false
                    }).success(function(results) {
                        strictSuggestions = _.compact(results);
                        $scope.query.suggestions = _.uniq(_.flatten([strictSuggestions, fuzzySuggestions], true));
                    }).error(function(error) {
                        console.log('error', error);
                    });
                }
            };

            // $state.go('app.search', {q: $scope.query.q})

            // for search
            $scope.search = function(text, fromSuggest) {
                $scope.intro = false;
                $scope.query.q = text || $scope.query.q;
                var prefix = (fromSuggest) ? 'api:' : '';

                // if app offline then use search() provided for offline service
                if (!isOnline) {
                    offlineSearch({
                        q: $scope.query.q,
                        facetsOnly: false,
                        perPage: 9999
                    });
                    return;
                }


                Search.search({
                    q: prefix + $scope.query.q,
                    facetsOnly: false,
                    perPage: 9999
                }).success(function(response) {
                    // remove first item from array
                    $scope.results = _.rest(response);

                    $state.$current.data = $scope.results;
                    $state.go('app.search', {
                        q: $scope.query.q
                    });

                    // $state.go('app.search.result');

                }).error(function(error) {
                    console.error('Error', error);
                });
            };


            function offlineSearch(searchCriteria) {
                offline.search(searchCriteria).then(function(results) {
                    $scope.results = results;
                    console.log('offline results', $scope.results);
                }, function(error) {
                    console.log('error in offline search', error);
                });
            }



            // if the url contains query params, then execute search
            try {
                if ($state.params.q) {
                    $scope.intro = false;
                    $scope.query.q = decodeURIComponent($state.params.q);
                    $scope.search($scope.query.q);
                }
            } catch (e) {
                console.error('error', e.toString());
            }
        }
    ])
    .controller('ResultCtrl', ['$scope', '$state',
        function($scope, $state) {
            $scope.results = $state.$current.data; //($state.$current.data) ? $state.$current.data: $state.current.parant.data;
            console.log('resultCtrl data', $scope.results);

        }
    ])
    .controller('ListCtrl', ['$scope', '$state', 'Search', 'offline',
        function($scope, $state, Search, offline) {
            $scope.getList = function(name) {
                Search.search({
                    collection: name,
                    perPage: 9999
                }).success(function(result) {
                    $scope.list = result;
                    // remove first item from array
                    $scope.list = _.rest(result);

                    //console.log('list', $scope.list);

                    // save into indexedDB for offline access
                    // offline.addApis($scope.list);


                }).error(function(error) {
                    console.error('Error in list', error);
                });
            };

            $scope.getList($state.params.lib);

            $scope.addItems = function() {
                offline.save($scope.list);
            };

            $scope.getOfflineItems = function() {
                offline.getList();
            };
        }
    ])
    .controller('DetailCtrl', ['$scope', '$state', 'Search',
        function($scope, $state, Search) {
            // console.log('$state', $state);
            //var url = '/' + $state.params.detail.replace(':', '/') + '.json';
            Search.get($state.params.uri).success(function(doc) {
                $scope.api = doc;
                // console.log('api', $scope.api);
            }).error(function(error) {
                console.error('error', error);
            });
        }
    ])
    .controller('NavCtrl', ['$scope', '$mdSidenav', 'Search', 'offline',
        function($scope, $mdSidenav, Search, offline) {
            $scope.showSidebar = function() {
                return !$mdSidenav('left').isLockedOpen();
            }.call();

            // for sidebar toggling
            $scope.toggleSideBar = function() {
                console.log('toggling...');
                $mdSidenav('left').toggle();
            };

            // save for offline access
            $scope.saveForOffline = function() {
                Search.search({
                    q: '',
                    facetsOnly: false,
                    perPage: 9999
                }).success(function(response) {
                    $scope.forOffline = _.rest(response);
                    offline.save($scope.forOffline);
                }).error(function(error) {
                    console.error('error', error);
                });

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