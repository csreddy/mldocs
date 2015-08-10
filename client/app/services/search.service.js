'use strict';

angular.module('search.service', []).service('Search', ['$http',
    function($http) {
        function search(searchCriteria) {
            return $http({
                method: 'POST',
                url: '/api/search',
                data: searchCriteria
            });
        }

        function suggest(searchCriteria) {
            return $http({
                method: 'POST',
                url: '/api/search/suggest',
                data: searchCriteria
            });
        }

        function all() {
            return $http({
                method: 'GET',
                url: '/api/search/all'
            });
        }

        function get(url) {
            return $http({
                method: 'GET',
                url: '/api/search/get?uri=' + url
            });
        }

        this.search = search;

        this.suggest = suggest;

        this.all = all;

        this.get = get;

        // this.query = {
        //     q: '',
        //     fuzzy: false,
        //     strict: true,
        //     suggestions: [],
        //     strictSuggest: function(text) {
        //         suggest({
        //             q: text,
        //             facetsOnly: false
        //         }).success(function(results) {
        //              return _.compact(results);
        //             //$scope.query.suggestions = _.compact(results);
        //         }).error(function(error) {
        //             console.log('error', error);
        //         });
        //     },
        //     fuzzySuggest: function(text) {
        //         var options = {
        //             keys: ['lib', 'apiName']
        //         };

        //         var f = new Fuse(modifiedApiList, options);
        //         return f.search(text);
        //         //$scope.query.suggestions = f.search(text);
        //     },
        //     suggest: function(text) {
        //         var fuzzySuggestions = [];
        //         var strictSuggestions = [];
        //         try {
        //             var f = new Fuse(modifiedApiList);
        //             fuzzySuggestions = f.search(text); // this returns indexes
        //             fuzzySuggestions = fuzzySuggestions.map(function(index) {
        //                 return modifiedApiList[index];
        //             });
        //         } catch (e) {
        //             console.log(e.message);
        //         }

        //         //console.log('fuzzySuggestions', fuzzySuggestions);
        //         suggest({
        //             q: text,
        //             facetsOnly: false
        //         }).success(function(results) {
        //             strictSuggestions = _.compact(results);
        //             //console.log('strictSuggestions', strictSuggestions);
        //             return _.uniq(_.flatten([strictSuggestions, fuzzySuggestions], true));
        //             //console.log('suggestions', $scope.suggestions);
        //         }).error(function(error) {
        //             console.log('error', error);
        //         });
        //     },

        //     selectedApi: function() {
        //         console.log('selectedApi');
        //     }
        // };

    }
]);