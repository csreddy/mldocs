'use strict';

angular.module('offline.service', [])
    .service('offline', ['$window', '$http',
        function($window, $http) {
            var isOnline = true;

            // check if db is online
            checkIsOnline().then(function(response) {
                isOnline = response.data.isOnline;
            }, function(error) {
                isOnline = false;
            });


            var db = new Dexie('offlineMLDocs'); // new Dexie('offlineMLDocs').delete();
            db.version(1).stores({
                apis: '++id,&apiName,isRest,lib,category,subcategory,bucket,summary'
            });
            // *params,*headers,return,usage,*examples
            db.open();


            function defineDBSchema(version) {
                db.version(version).stores({
                    apis: '++id,isRest,&apiName,lib,category,subcategory,bucket,summary,*params,*headers,return,usage,*examples'
                });
            }


            function saveApis(data) {
                // db.close();
                // db.delete();
                // db.version(1).stores({
                //     apis: '++id,isRest,apiName,lib,category,subcategory,bucket,summary'
                // });
                // db.open();
                data.forEach(function(item) {
                    db.apis.put(item);
                    console.log('saved api', item.apiName);
                });


                /*db.transaction('rw', db.apis, function() {
                    data.forEach(function(item) {
                        db.apis.put(item);
                        console.log('added api from txn', item.apiName);
                    });
                }).catch(function(error) {
                    console.error('error', error);
                });
*/

                // .finally(function() {
                //     db.close();
                // });
            }

            function getDBSchema(table) {
                db.tables.forEach(function(table) {
                    console.log("Schema of " + table.name + ": " + JSON.stringify(table.schema));
                });
            }

            function search(searchCriteria) {
                console.log('seaching...');
                var collection = db.apis.where('apiName').equalsIgnoreCase(searchCriteria.q);
                return collection.toArray().then(function(apis) {
                    return apis;
                });
            }

            function addSampleData() {
                db.apis.add({
                    "apiName": "appserver-get-privilege",
                    "bucket": "XQuery Library Modules",
                    "category": "Admin Library",
                    "examples": [],
                    "headers": [],
                    "http-verb": "",
                    "isRest": false,
                    "lib": "admin",
                    "params": [{
                        "description": "A configuration specification, typically as returned from one of the Admin module functions",
                        "name": "config",
                        "type": "element(configuration)"
                    }, {
                        "description": "The ID of the App Server. Typically, this is the result of an admin:appserver-get-id call.",
                        "name": "appserver-id",
                        "type": "xs:unsignedLong"
                    }],
                    "return": "xs:unsignedLong",
                    "subcategory": "appserver",
                    "summary": "This function returns the privilege ID for the specified App Server. If no privilege is configured, It returns 0.",
                    "usage": ""
                });
            }

            function checkIsOnline() {
                return $http({
                    method: 'GET',
                    url: '/api/search/check'
                });
            }

            function apiList() {
                console.log('offline api list...');
                var collection = db.apis;
                return collection.toArray().then(function(apis) {
                    return _.pluck(apis, 'apiName');
                });
            }

            function moduleList() {
                console.log('offline module list...');
                var modules = {
                    lib: [],
                    bucket: []
                };
                return db.apis.toArray().then(function(apis) {
                    var libs = _.pluck(apis, 'lib').sort();
                    var buckets = _.pluck(apis, 'bucket').sort();
                    // lib
                    _.forEach(_.uniq(libs), function(libName) {
                        var count = 0;
                        _.forEach(libs, function(l) {
                            if (libName === l) {
                                count++;
                            }
                        });
                        modules.lib.push({
                            name: libName,
                            count: count
                        });
                    });
                    // bucket
                     _.forEach(_.uniq(buckets), function(libName) {
                        var count = 0;
                        _.forEach(buckets, function(l) {
                            if (libName === l) {
                                count++;
                            }
                        });
                        modules.bucket.push({
                            name: libName,
                            count: count
                        });
                    });

                    return modules;
                });
            }



            this.db = db;
            this.defineDBSchema = defineDBSchema;
            this.save = saveApis;
            this.getDBSchema = getDBSchema;
            this.search = search;
            this.addData = addSampleData;
            this.checkIsOnline = checkIsOnline;
            this.isOnline = isOnline;
            this.apiList = apiList;
            this.moduleList = moduleList;
        }
    ]);