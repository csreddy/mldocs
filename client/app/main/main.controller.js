'use strict';

angular
    .module('mldocsApp')
    .controller('SearchCtrl', ['$rootScope', '$scope', '$timeout', 'isOnline', '$mdSidenav', '$mdUtil', '$log', 'Search', '$state', 'modules', 'apiList', 'offline',
        function($rootScope, $scope, $timeout, isOnline, $mdSidenav, $mdUtil, $log, Search, $state, modules, apiList, offline) {


            var _isOnline = $rootScope.isOnline || isOnline;
            console.log('---------- THE APP IS ONLINE: ' + isOnline + '  ------------');
            $scope.intro = true;
            $scope.results = [];
            $scope.modules = modules || [];
            var _apiList = apiList || [];

            // $scope.$on('online', function(event, healthcheck) {
            //     _isOnline = healthcheck;
            // });


            if (!_isOnline) {
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
                    if (!_isOnline) {
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
                $scope.showProgress = true;
                $scope.intro = false;
                $scope.query.q = text || $scope.query.q;
                var prefix = (fromSuggest) ? 'api:' : '';

                // if app offline then use search() provided for offline service
                if (!_isOnline) {
                    offlineSearch({
                        q: $scope.query.q,
                        facetsOnly: false,
                        perPage: 9999
                    });
                    $state.go('app.search', {
                        q: $scope.query.q
                    });
                    $scope.showProgress = false;
                    return;
                } else {
                    Search.search({
                        q: prefix + $scope.query.q,
                        facetsOnly: false,
                        perPage: 9999
                    }).success(function(response) {
                        $scope.showProgress = false;
                        // remove first item from array
                        $scope.results = _.rest(response);

                        $state.$current.data = $scope.results;
                        $state.go('app.search', {
                            q: $scope.query.q
                        });

                        // $state.go('app.search.result');

                    }).error(function(error) {
                        $scope.showProgress = false;
                        console.error('Error', error);
                    });
                }

            };


            function offlineSearch(searchCriteria) {
                offline.search(searchCriteria).then(function(results) {
                    $scope.$apply(function() {
                        $scope.results = results;
                    });
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
    .controller('ListCtrl', ['$rootScope', '$scope', '$state', 'isOnline', 'Search', 'offline',
        function($rootScope, $scope, $state, isOnline, Search, offline) {
            $scope.showProgress = true;
            $scope.getList = function(name) {
                var _isOnline = $rootScope.isOnline || isOnline;

                if (!_isOnline) {
                    console.log('showProgress', $scope.showProgress);
                    offline.getApisInModule(name).then(function(list) {
                        console.log('list', list);
                        $scope.list = list;
                    }, function(error) {
                        console.log('error', error);
                    });
                    $scope.showProgress = false;
                    return;
                }

                Search.search({
                    collection: name,
                    perPage: 9999
                }).success(function(result) {
                    $scope.showProgress = false;
                    $scope.list = result;
                    // remove first item from array
                    $scope.list = _.rest(result);

                    //console.log('list', $scope.list);

                    // save into indexedDB for offline access
                    // offline.addApis($scope.list);


                }).error(function(error) {
                    $scope.showProgress = false;
                    console.error('Error in list', error);
                });
            };

            $scope.$evalAsync(function() {
                $scope.getList($state.params.lib);
            });


            $scope.addItems = function() {
                offline.save($scope.list);
            };

            $scope.getOfflineItems = function() {
                offline.getList();
            };
        }
    ])
    .controller('DetailCtrl', ['$rootScope', '$scope', '$state', 'isOnline', 'Search', 'offline',
        function($rootScope, $scope, $state, isOnline, Search, offline) {
            // console.log('$state', $state);
            $scope.showProgress = true;
            var _isOnline = $rootScope.isOnline || isOnline;
            $scope.$evalAsync(function() {
                if (!_isOnline) {
                    offline.get($state.params.uri).then(function(doc) {
                        $scope.api = doc;
                    });
                    $scope.showProgress = false;
                    return;
                }

                //var url = '/' + $state.params.detail.replace(':', '/') + '.json';
                Search.get($state.params.uri).success(function(doc) {
                    $scope.showProgress = false;
                    $scope.api = doc;
                    // console.log('api', $scope.api);
                }).error(function(error) {
                    $scope.showProgress = false;
                    console.error('error', error);
                });
            });

        }
    ])
    .controller('NavCtrl', ['$rootScope', '$scope', '$mdSidenav', '$mdToast', 'Search', 'offline', 'isOnline',
        function($rootScope, $scope, $mdSidenav, $mdToast, Search, offline, isOnline) {

            $rootScope.isOnline = isOnline;
            // $scope.$on('online', function(event, healthcheck) {
            //     console.log('healthcheck', healthcheck);
            //     $rootScope.isOnline = healthcheck;
            // });

             $rootScope.showToast = function() {
                var toast = $mdToast.simple()
                    .content('Unable to connect to the internet, switched to offline mode')
                    .action('OK')
                    .highlightAction(false)
                    .position('top left')
                    .hideDelay(3000);
                $mdToast.show(toast);
            };

            if (!$rootScope.isOnline) {
                $rootScope.showToast();
            }
            
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