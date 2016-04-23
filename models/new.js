/**
 * Created by snooze on 4/23/16.
 */


// grab the things we need
var mongoose = require('mongoose');
var sanitizerPlugin = require('mongoose-sanitizer');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
commentSchema.plugin(sanitizerPlugin);

// create a schema
var newSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    category:{
        type: String,
        default: "none"
    },
    // Sub document -> WOW
    comments:[commentSchema]
}, {
    timestamps: true
});
newSchema.plugin(sanitizerPlugin);

// the schema is useless so far
// we need to create a model using it

/*
 * This creates the collection on mongodb with the plural name, so the collection is dishes
 */
var News = mongoose.model('New', newSchema);

// make this available to our Node applications
module.exports = News;