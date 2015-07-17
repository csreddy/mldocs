'use strict';

angular.module('search.service', []).service('Search', ['$http',
    function($http) {
        this.search = function(searchCriteria) {
            return $http({
                method: 'POST',
                url: '/api/search',
                data: searchCriteria
            });
        };
    }
]);