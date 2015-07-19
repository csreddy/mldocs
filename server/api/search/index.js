'use strict';

var express = require('express');
var controller = require('./search.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.search);
router.get('/get', controller.get);

module.exports = router; 