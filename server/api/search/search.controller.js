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
    var searchCriteria = [q.parsedFrom(req.body.q || ''), q.collection('docs')];
    var facetOptions = [q.facet('lib', 'lib'), q.facet('bucket', 'bucket')]
    var resultLimit = 20; // default
    if (req.body.facetsOnly) {
        resultLimit = 0;
    }

    if (req.body.collection) {
        searchCriteria.push(q.collection(req.body.collection))
    }

    console.log('req.body', req.body);
    db.documents.query(
        q.where(
            searchCriteria
        )
        .calculate(
            facetOptions
        )
        .slice(0, resultLimit, q.snippet())
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
            return res.status(200).json(result);
        }, function(error) {
            return res.status(error.statusCode).json({
                error: error.body.errorResponse.messageCode + ':' + error.body.errorResponse.message
            });
        });
};



exports.get = function(req, res) {
    //console.log('req.params', req);
    db.documents.read(req.query.uri).result(function(doc) {
        if (doc[0]) {
            if (doc[0].content) {
                return res.status(200).json(doc[0].content)
            }
        } else {
            return res.status(200).json({})
        }

    }, function(error) {
        return res.status(error.statusCode).json({
            error: error.body.errorResponse.messageCode + ':' + error.body.errorResponse.message
        });
    })
};