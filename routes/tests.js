/**
 * Created by snooze on 4/23/16.
 */

var express = require('express');
var router = express.Router();
var http = require('http');
var url  = require('url');

//var mongoose = require('mongoose');
var Test = require('../models/test');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
    var page = parseInt(req.query.page) || 1
    var limit = parseInt(req.query.limit) || 4
    var search = req.query.search || ''
    var categ = req.query.category || ''
    var rating = req.query.rating || 0
    console.log('Página: '+page)
    console.log('Límite: '+limit)

    if ((search==='') && (categ==='') && (rating==0)){
        console.log('-- No buscando')
        Test.paginate({}, { 'page': page, 'limit': limit }, function(err, todos) {
            if (err) return next(err);
            res.json(todos);
        });
    } else {
        console.log('Búsqueda: '+search+' - Categoria: '+categ+' - Rating: '+rating)
        console.log('-- Buscando')
        var regex = new RegExp(search, 'i');  // 'i' makes it case insensitive
        var regca = new RegExp(categ, 'i');  // 'i' makes it case insensitive
        return Test.paginate(
            {
                $or: [
                    {'title': regex, 'category':regca, 'rating': {$gt : rating}},
                    {'description': regex, 'category':regca, 'rating': {$gt : rating}}
                ]
            }
            , { 'page': page, 'limit': limit }, function(err, todos){
                return res.send(todos);
            });
    }

});

/* POST /todos */
router.post('/', function(req, res, next) {
    Test.create(req.body, function (err, post) {
        //if (err) return next(err);
        if (err) return res.json(0);
        res.json(post);
    });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
    Test.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
    Test.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        //if (err) return next(err);
        if (err) return res.json(0);
        res.json(post);
    });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
    Test.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;