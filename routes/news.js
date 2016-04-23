/**
 * Created by snooze on 4/20/16.
 */

var express = require('express');
var bodyParser = require('body-parser');

var News = require('../models/new');

var newsrouter = express.Router();
newsrouter.use(bodyParser.json());

/* GET users listing. */
newsrouter.route('/')
    .get(function (req, res, next) {
        console.log('Trying to get news');
        // Hide comments here
        News.find({},{"comments":0})
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
        console.log('Trying to post a new');
        News.create(req.body, function (err, noticia) {
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
        console.log('Trying to delete all news');
        News.remove({}, function (err, noticia) {
            if (err) {
                res.json({
                    message: err.errors.title.message
                    // ,error: err
                })
            }
            res.json(noticia);
        });
    });

newsrouter.route('/:newId')
    .get(function (req, res, next) {
        News.findById(req.params.newId)
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
        News.findByIdAndUpdate(req.params.newId, {
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
        News.findByIdAndRemove(req.params.newId, function (err, resp) {
            if (err) {
                res.json({
                    message: err.errors.title.message
                    // ,error: err
                })
            }
            res.json(resp);
        });
    });


module.exports = newsrouter;