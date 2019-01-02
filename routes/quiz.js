var express = require('express');
var router = express.Router();
var connection = require('./../db_handler/connection');
var quiz = require('./../db_handler/quiz');
var url  = require('url');

router.get('/getquiz', function(req, res, next) {
    var result;
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    //Get quiz by Code
    quiz.getQuizByCode(query.quizCode).then(rows=>{
        result=rows?rows[0]:{};
        quiz.getQuizQuestins(result.ID).then(quests=>{
            result.QUESTIONS=quests;
            res.send(result);
        });
    });
    
});

router.get('/getquizscores', function(req, res, next) {
    var result;
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    //Get quiz by Code
    quiz.getQuizScoresByCode(query.quizID).then(rows=>{
        res.send(rows);
    });
    
});

router.post('/saveUser', function(req, res) {
    var username=req.body.NAME;
    quiz.saveUser(username).then(user=>res.send(user));
});

router.post('/saveResult', function(req, res) {
    var USER_ID=req.body.USER_ID;
    var SCORE=req.body.USER_SCORE;
    var QUIZ_ID=req.body.QUIZ_ID;
    var SCORE_ID=req.body.SCORE_ID;
    quiz.saveResult(USER_ID, QUIZ_ID, SCORE, SCORE_ID).then(result=>res.send(result));
});

module.exports = router;
