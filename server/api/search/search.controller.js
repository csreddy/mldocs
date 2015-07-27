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
    var searchCriteria = [q.collection('docs')];
    var facetOptions = [q.facet('lib', 'lib'), q.facet('bucket', 'bucket')]
    var resultLimit = 100; // default
    if (req.body.facetsOnly) {
        resultLimit = 0;
    }
    console.log('req.body', req.body);
    var queryStr = (req.body.q) ? req.body.q : '';
    searchCriteria.push(q.parsedFrom(
        queryStr,
        q.parseBindings(
            q.range('apiName', q.bind('api'))
        )))


    if (req.body.collection) {
        searchCriteria.push(q.collection(req.body.collection))
    }


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
            return res.status(200).json(result);
        }, function(error) {
            return res.status(error.statusCode).json({
                error: error.body.errorResponse.messageCode + ':' + error.body.errorResponse.message
            });
        });
};

exports.suggest = function(req, res) {
    var searchCriteria = [q.collection('docs')];
    var facetOptions = [q.facet('lib', 'lib'), q.facet('bucket', 'bucket')]
    var resultLimit = 20; // default
    if (req.body.facetsOnly) {
        resultLimit = 0;
    }
    console.log('req.body', req.body);
    var queryStr = (req.body.q) ? req.body.q : '';
    searchCriteria.push(q.parsedFrom(
        queryStr,
        q.parseBindings(
            q.range('apiName', q.bindDefault())
        )))


    if (req.body.collection) {
        searchCriteria.push(q.collection(req.body.collection))
    }


    db.documents.suggest(queryStr,
        q.where(
            q.parsedFrom(
                '',
                q.parseBindings(
                    q.range('apiName', q.bindDefault())
                ))
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
            return res.status(200).json(result);
        }, function(error) {
            return res.status(error.statusCode).json({
                error: error.body.errorResponse.messageCode + ':' + error.body.errorResponse.message
            });
        });
};

// returns list of api names
exports.all = function(req, res) {
    var resultLimit = 100; // default
    console.log('req.body', req.body);

    db.documents.query(
        q.where(
           q.collection('docs')
        )
        .slice(0, resultLimit, q.extract(['/lib', '/apiName']))
    )
        .result(function(result) {
            result = result.map(function(item) {
                if (item.content) {
                    return {
                       lib: item.content.extracted[1].lib,
                       apiName: item.content.extracted[0].apiName
                    }
                }
            })
            result = _.compact(result);
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