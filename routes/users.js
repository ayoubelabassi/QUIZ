var express = require('express');
var router = express.Router();
var connection = require('./../db_handler/connection');
var quiz = require('./../db_handler/quiz');

router.get('/', function(req, res, next) {
    quiz.getAll().then(rows=>res.send(rows)).then(row=>quiz.close());
});

module.exports = router;
