/**
 * Created by snooze on 4/20/16.
 */

var express = require('express');
var bodyParser = require('body-parser');

var Tests = require('../models/test');

var testrouter = express.Router();
testrouter.use(bodyParser.json());

function first(obj){
    for (var j in obj) return obj[j];
}

function lastcomment(obj){
    return obj[obj.length-1];
}

function showError(res, err, next) {
    res.status(403).json(
        {
            message: first(err.errors).message
            ,error: err
        }
    );
    // next(err);
}

function parseArguments(req, limit, page) {
    if ((parseInt(req.query.limit) > 0 ) && (parseInt(req.query.limit) < 31 )) {
        limit = parseInt(req.query.limit);
    }
    if (parseInt(req.query.page) > 0) {
        page = parseInt(req.query.page) > 0
    }
    return {limit: limit, page: page};
}

// TEST LISTS ------------------------------------------------------------------
testrouter.route('/')
    .get(function (req, res, next) {
        // console.log('-- Trying to get test');
        var page = 1;
        var limit = 10;
        var __ret = parseArguments(req, limit, page);
        limit = __ret.limit;
        page = __ret.page;
        Tests.paginate({},
            {
                select: 'title description image rating category postedBy',
                page: page,
                limit: limit
            }, function(err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(auxtest);
            }
        });

    })
    .post(function (req, res, next) {
        // console.log('-- Trying to post a new test');
        Tests.create(req.body, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(auxtest);
            }
        });
    })
    .delete(function (req, res, next) {
        // console.log('-- Trying to delete all test');
        Tests.remove({}, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            }
            res.json(auxtest);
        });
    });

// TEST INDIVIDUAL -------------------------------------------------------------
testrouter.route('/:testId')
    .get(function (req, res, next) {
        // console.log('-- Trying to get '+req.params.testId+' test');
        Tests.findById(req.params.testId)
            .exec(function (err, auxtest) {
                if (err) {
                    showError(res, err, next);
                } else {
                    res.json(auxtest);
                }
            });
    })
    .put(function (req, res, next) {
        // console.log('-- Trying to update '+req.params.testId+' test');
        Tests.findByIdAndUpdate(req.params.testId, {
            $set: req.body
        }, {
            new: true
        }, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(auxtest);
            }
        });
    })
    .delete(function (req, res, next) {
        // console.log('-- Trying to delete '+req.params.testId+' test');
        Tests.findByIdAndRemove(req.params.testId, function (err, resp) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(resp);
            }
        });
    });




// TESTS COMMENTS --------------------------------------------------------------
testrouter.route('/:testId/comments')
    .get(function (req, res, next) {
        // console.log('-- Trying to get '+req.params.testId+' test comments');
        Tests.findById(req.params.testId,{"questions":0,"results":0}, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(auxtest.comments);
            }
        });
    })
    .post(function (req, res, next) {
        // console.log('-- Trying to post '+req.params.testId+' test a new comment');
        Tests.findById(req.params.testId, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                auxtest.comments.push(req.body);
                auxtest.save(function (err, auxtest) {
                    if (err) {
                        showError(res, err, next);
                    } else {
                        res.json(lastcomment(auxtest.comments));
                    }
                });
            }
        });
    })
    .delete(function (req, res, next) {
        // console.log('-- Trying to delete all '+req.params.testId+' test comments');
        Tests.findById(req.params.testId, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                for (var i = (auxtest.comments.length - 1); i >= 0; i--) {
                    auxtest.comments.id(auxtest.comments[i]._id).remove();
                }
                auxtest.save(function (err, result) {
                    if (err) {
                        showError(res, err, next);
                    } else {
                        res.json(result.comments);
                    }
                });
            }
        });
    });

testrouter.route('/:testId/comments/:commentId')
    .get(function (req, res, next) {
        // console.log('-- Trying to get '+req.params.testId+' test comment '+req.params.CommentId);
        Tests.findById(req.params.testId,{"questions":0,"results":0}, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(auxtest.comments.id(req.params.commentId));
            }
        });
    })
    // .put(function (req, res, next) {
    //     console.log('-- Trying to put '+req.params.testId+' test comment '+req.params.CommentId);
    //     // We delete the existing commment and insert the updated
    //     // comment as a new comment
    //     Tests.findById(req.params.testId, function (err, auxtest) {
    //         if (err) {
    //             showError(res, err, next);
    //         } else {
    //             auxtest.comments.id(req.params.commentId).remove();
    //             req.body.postedBy = req.decoded._doc._id;
    //             // req.body.postedBy = req.decoded._doc._id;
    //             auxtest.comments.push(req.body);
    //             auxtest.save(function (err, auxtest) {
    //                 if (err){
    //                     console.log(err);
    //                     showError()
    //                 } else {
    //                     console.log('Updated Comments!');
    //                     res.json(lastcomment(auxtest.comments));
    //                 }
    //             });
    //         }
    //     });
    // })
    .delete(function (req, res, next) {
        Tests.findById(req.params.testId, function (err, auxtest) {
            // if (auxtest.comments.id(req.params.commentId).postedBy
            //     != req.decoded._doc._id) {
            //     var err = new Error('You are not authorized to perform this operation!');
            //     err.status = 403;
            //     showError(res, err, next);
            //     // return next(err);
            // }
            auxtest.comments.id(req.params.commentId).remove();
            auxtest.save(function (err, resp) {
                if (err) {
                    showError(res, err, next);
                } else {
                    res.json(resp.comments);
                }
            });
        });
    });


// TESTS RESULTS --------------------------------------------------------------
testrouter.route('/:testId/results')
    .get(function (req, res, next) {
        // console.log('-- Trying to get '+req.params.testId+' test results');
        Tests.findById(req.params.testId,{"questions":0,"comments":0},  function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(auxtest.results);
            }
        });
    })
    .post(function (req, res, next) {
        // console.log('-- Trying to post '+req.params.testId+' test a new result');
        Tests.findById(req.params.testId, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                auxtest.results.push(req.body);
                auxtest.save(function (err, auxtest) {
                    if (err) {
                        showError(res, err, next);
                    } else {
                        res.json(lastcomment(auxtest.results));
                    }
                });
            }
        });
    })
    .delete(function (req, res, next) {
        // console.log('-- Trying to delete all '+req.params.testId+' test results');
        Tests.findById(req.params.testId, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                for (var i = (auxtest.results.length - 1); i >= 0; i--) {
                    auxtest.results.id(auxtest.results[i]._id).remove();
                }
                auxtest.save(function (err, result) {
                    if (err) {
                        showError(res, err, next);
                    } else {
                        res.json(result.results);
                    }
                });
            }
        });
    });

testrouter.route('/:testId/results/:resultId')
    .get(function (req, res, next) {
        // console.log('-- Trying to get '+req.params.testId+' test comment '+req.params.resultId);
        Tests.findById(req.params.testId, {"questions":0,"comments":0}, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(auxtest.results.id(req.params.resultId));
            }
        });
    })
    // .put(function (req, res, next) {
    //     console.log('-- Trying to put '+req.params.testId+' test comment '+req.params.resultId);
    //     // We delete the existing commment and insert the updated
    //     // comment as a new comment
    //     Tests.findById(req.params.testId, function (err, auxtest) {
    //         if (err) {
    //             showError(res, err, next);
    //         } else {
    //             auxtest.results.id(req.params.resultId).remove();
    //             req.body.postedBy = req.decoded._doc._id;
    //             // req.body.postedBy = req.decoded._doc._id;
    //             auxtest.results.push(req.body);
    //             auxtest.save(function (err, auxtest) {
    //                 if (err){
    //                     console.log(err);
    //                     showError()
    //                 } else {
    //                     console.log('Updated Comments!');
    //                     res.json(lastcomment(auxtest.results));
    //                 }
    //             });
    //         }
    //     });
    // })
    .delete(function (req, res, next) {
        Tests.findById(req.params.testId, function (err, auxtest) {
            // if (auxtest.results.id(req.params.resultId).postedBy
            //     != req.decoded._doc._id) {
            //     var err = new Error('You are not authorized to perform this operation!');
            //     err.status = 403;
            //     showError(res, err, next);
            //     // return next(err);
            // }
            auxtest.results.id(req.params.resultId).remove();
            auxtest.save(function (err, resp) {
                if (err) {
                    showError(res, err, next);
                } else {
                    res.json(resp.results);
                }
            });
        });
    });


// TESTS questions --------------------------------------------------------------
testrouter.route('/:testId/questions')
    .get(function (req, res, next) {
        // console.log('-- Trying to get '+req.params.testId+' test questions');
        Tests.findById(req.params.testId, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(auxtest.questions);
            }
        });
    })
    .post(function (req, res, next) {
        // console.log('-- Trying to post '+req.params.testId+' test a new comment');
        Tests.findById(req.params.testId, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                auxtest.questions.push(req.body);
                auxtest.save(function (err, auxtest) {
                    if (err) {
                        showError(res, err, next);
                    } else {
                        res.json(lastcomment(auxtest.questions));
                    }
                });
            }
        });
    })
    .delete(function (req, res, next) {
        // console.log('-- Trying to delete all '+req.params.testId+' test questions');
        Tests.findById(req.params.testId, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                for (var i = (auxtest.questions.length - 1); i >= 0; i--) {
                    auxtest.questions.id(auxtest.questions[i]._id).remove();
                }
                auxtest.save(function (err, result) {
                    if (err) {
                        showError(res, err, next);
                    } else {
                        res.json(result.questions);
                        // res.writeHead(200, {
                        //     'Content-Type': 'text/plain'
                        // });
                        // res.end('Deleted all questions!');
                    }
                });
            }
        });
    });

testrouter.route('/:testId/questions/:commentId')
    .get(function (req, res, next) {
        // console.log('-- Trying to get '+req.params.testId+' test comment '+req.params.CommentId);
        Tests.findById(req.params.testId, function (err, auxtest) {
            if (err) {
                showError(res, err, next);
            } else {
                res.json(auxtest.questions.id(req.params.commentId));
            }
        });
    })
    // .put(function (req, res, next) {
    //     console.log('-- Trying to put '+req.params.testId+' test comment '+req.params.CommentId);
    //     // We delete the existing commment and insert the updated
    //     // comment as a new comment
    //     Tests.findById(req.params.testId, function (err, auxtest) {
    //         if (err) {
    //             showError(res, err, next);
    //         } else {
    //             auxtest.questions.id(req.params.commentId).remove();
    //             req.body.postedBy = req.decoded._doc._id;
    //             // req.body.postedBy = req.decoded._doc._id;
    //             auxtest.questions.push(req.body);
    //             auxtest.save(function (err, auxtest) {
    //                 if (err){
    //                     console.log(err);
    //                     showError()
    //                 } else {
    //                     console.log('Updated questions!');
    //                     res.json(lastcomment(auxtest.questions));
    //                 }
    //             });
    //         }
    //     });
    // })
    .delete(function (req, res, next) {
        Tests.findById(req.params.testId, function (err, auxtest) {
            // if (auxtest.questions.id(req.params.commentId).postedBy
            //     != req.decoded._doc._id) {
            //     var err = new Error('You are not authorized to perform this operation!');
            //     err.status = 403;
            //     showError(res, err, next);
            //     // return next(err);
            // }
            auxtest.questions.id(req.params.commentId).remove();
            auxtest.save(function (err, resp) {
                if (err) {
                    showError(res, err, next);
                } else {
                    res.json(resp.questions);
                }
            });
        });
    });

module.exports = testrouter;