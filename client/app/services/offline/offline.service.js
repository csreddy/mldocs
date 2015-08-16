'use strict';

angular.module('offline.service', [])
    .service('offline', ['$window', '$q',
        function($window, $q) {
            var db = new Dexie('offlineDB'); // new Dexie('offlineDB').delete();
            db.version(1).stores({
                apis: '++id,&apiName,isRest,lib,category,subcategory,bucket,summary'
            });
            // *params,*headers,return,usage,*examples
            db.open();
            db.apis.count(function(count) {
                console.log('count', count);
            });


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
                    console.log('added api', item.apiName);
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
                 var collection =  db.apis.where('apiName').equalsIgnoreCase(searchCriteria.q);
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



            this.db = db;
            this.defineDBSchema = defineDBSchema;
            this.save = saveApis;
            this.getDBSchema = getDBSchema;
            this.search = search;
            this.addData = addSampleData;
        }
    ]);