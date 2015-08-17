'use strict';

var express = require('express');
var controller = require('./search.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.search);
router.post('/suggest', controller.suggest);
router.get('/get', controller.get);
router.get('/all', controller.all);
router.get('/check', controller.checkConnectivity);

module.exports = router; 