'use strict';

var marklogic = require('marklogic');
var conn = require('../../config/db-config.js').connection;
var db = marklogic.createDatabaseClient(conn);
var q = marklogic.queryBuilder;
var _ = require('lodash');

// Get list of searchs
exports.index = function(req, res) {
    res.json([]);
};


exports.search = function(req, res) {
    var facetOptions = [q.facet('module_category', q.pathIndex('/module/category')),
        q.facet('module_name', q.pathIndex('/module/name')),
    ]
console.log('req.body', req.body);
    db.documents.query(
        q.where(
            [q.parsedFrom(req.body.q || ''), q.directory('/docs/')]
        )
        .calculate(
            facetOptions
        )
        .slice(0, 20, q.snippet())
        .withOptions({
            debug: true,
            queryPlan: true,
            metrics: true,
            categories: ['content']
        })
    )
        .result(function(result) {
            //   log.info('\n------------------------------------------');
            _.transform(result, function(result, item, index) {
                if (item.content) delete item.content.changeHistory
                result[index] = item;
            })

            //  log.info('/search', result);
            // console.log("result count"+JSON.stringify(result[0].plan["query-plan"].result.estimate,null,2));
            //console.log("result count"+JSON.stringify(result,null,2));
            res.status(200).json(result);
        }, function(error) {
            res.status(error.statusCode).json({
                error: error.body.errorResponse.messageCode + ':' + error.body.errorResponse.message
            });
        });
};