/**
 * Created by snooze on 4/20/16.
 */

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var News = require('../models/new');

var newsrouter = express.Router();
newsrouter.use(bodyParser.json());

/* GET users listing. */
newsrouter.route('/')
    .get(function (req, res, next) {
        console.log('Trying to get news');
        News.find({})
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


module.exports = newsrouter;