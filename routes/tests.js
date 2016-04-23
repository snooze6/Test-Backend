/**
 * Created by snooze on 4/20/16.
 */

var express = require('express');
var bodyParser = require('body-parser');

var Tests = require('../models/test');

var testrouter = express.Router();
testrouter.use(bodyParser.json());

/* GET users listing. */
testrouter.route('/')
    .get(function (req, res, next) {
        console.log('Trying to get test');
        // Hide comments here
        Tests.find({},{"comments":0,"questions":0,"results":0})
            .exec(function (err, noticia) {
                if (err) {
                    res.json({
                        message: err.errors.title.message
                        // ,error: err
                    })
                }
                res.json(noticia);
            });
    })
    .post(function (req, res, next) {
        console.log('Trying to post a new test');
        Tests.create(req.body, function (err, noticia) {
            if (err) {
                res.json({
                    message: err.errors.title.message
                    // ,error: err
                })
            }
            console.log('New created!');
            res.json(noticia);
        });
    })
    .delete(function (req, res, next) {
        console.log('Trying to delete all test');
        Tests.remove({}, function (err, noticia) {
            if (err) {
                res.json({
                    message: err.errors.title.message
                    // ,error: err
                })
            }
            res.json(noticia);
        });
    });

testrouter.route('/:testId')
    .get(function (req, res, next) {
        Tests.findById(req.params.testId)
            .populate('comments.postedBy')
            .exec(function (err, dish) {
                if (err) {
                    res.json({
                        message: err.errors.title.message
                        // ,error: err
                    })
                }
                res.json(dish);
            });
    })

    .put(function (req, res, next) {
        Tests.findByIdAndUpdate(req.params.testId, {
            $set: req.body
        }, {
            new: true
        }, function (err, dish) {
            if (err) {
                res.json({
                    message: err.errors.title.message
                    // ,error: err
                })
            }
            res.json(dish);
        });
    })

    .delete(function (req, res, next) {
        Tests.findByIdAndRemove(req.params.testId, function (err, resp) {
            if (err) {
                res.json({
                    message: err.errors.title.message
                    // ,error: err
                })
            }
            res.json(resp);
        });
    });


module.exports = testrouter;