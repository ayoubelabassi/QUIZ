var express = require('express');
var con = require('./connection');

var quiz = {
    getAll: function(){
        return new Promise( ( resolve, reject ) => {
            con.query('SELECT * from quiz', function (err, rows, fields) {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    },
    getQuizByCode: function(code){
        return new Promise( ( resolve, reject ) => {
            con.query('SELECT * from quiz where code like \''+code+'\'', function (err, rows, fields) {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    },
    getQuizScoresByCode: function(code){
        return new Promise( ( resolve, reject ) => {
            con.query('SELECT p.ID, p.MARK, u.NAME, p.USER_FK, p.QUIZ_FK FROM pass as p JOIN user as u ON u.ID=p.USER_FK WHERE p.QUIZ_FK='+code+' ORDER BY MARK DESC;', function (err, rows, fields) {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    },
    getQuizQuestins: function(idQuiz){
        return new Promise( ( resolve, reject ) => {
            var query='SELECT q.ID as ID_QUESTION, q.QUESTION, q.QUIZ_FK, a.ID as ID_ANSWER, '+
            ' a.ANSWER, a.ISTRUE, a.QUESTION_FK'+  
            ' FROM question as q JOIN answer as a ON a.QUESTION_FK=q.ID'+' WHERE q.QUIZ_FK = '+idQuiz+
            ' ORDER BY q.ID'
            con.query(query, function (err, rows, fields) {
                if ( err )
                    return reject( err );
                var questions=[];
                var id=0;
                rows.forEach(element => {
                    if(id!=element.ID_QUESTION){
                        var quest={
                            ID:element.ID_QUESTION,
                            QUESTION: element.QUESTION,
                            QUIZ_FK: element.QUIZ_FK,
                            ANSWERS: []
                        }
                        questions.push(quest);
                        id=element.ID_QUESTION;
                    }
                });

                questions.forEach(item => {
                    rows.forEach(element => {
                        if(item.ID==element.QUESTION_FK){
                            var answer={
                                ID:element.ID_ANSWER,
                                ANSWER: element.ANSWER,
                                QUESTION_FK: element.QUESTION_FK,
                                ISTRUE:  element.ISTRUE
                            }
                            item.ANSWERS.push(answer);
                        }
                    });
                });
                resolve( questions );
            } );
        } );
    },
    saveUser: function(username){
        return new Promise( ( resolve, reject ) => {
            var query="INSERT INTO user (NAME, USERNAME, PASSWORD, TYPE) VALUES ('"+username+"', NULL, NULL, 'STUDENT')";
            con.query(query, function (err, result, fields) {
                if ( err )
                    return reject( err );
                con.query('SELECT * FROM user WHERE ID='+result.insertId, function (err, rows, fields) {
                    if ( err )
                        return reject( err );
                        if(rows)
                            resolve( rows[0] );
                })
            } );
        } );
    },
    saveResult: function(USER_ID, QUIZ_ID, SCORE, SCORE_ID){
        return new Promise( ( resolve, reject ) => {
            
            console.log(SCORE_ID);
            var query="";
            if(SCORE_ID==0){
                query="INSERT INTO pass (MARK, USER_FK, QUIZ_FK) VALUES ("+SCORE+", "+USER_ID+", "+QUIZ_ID+");";
            }else{
                query="UPDATE pass SET MARK="+SCORE+" WHERE ID="+SCORE_ID+";";
            }
            console.log(query);
            con.query(query, function (err, result, fields) {
                if ( err )
                    return reject( err );
                con.query('SELECT * FROM pass WHERE ID='+result.insertId, function (err, rows, fields) {
                    if ( err )
                        return reject( err );
                        if(rows)
                            resolve( rows[0] );
                })
            } );
        } );
    },
}
module.exports=quiz;