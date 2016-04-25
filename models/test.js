/**
 * Created by snooze on 4/23/16.
 */

var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var searchplugin = require('mongoose-search-plugin');
// var autoincrement = require('mongoose-auto-increment');
var sanitizerPlugin = require('mongoose-sanitizer');
var Schema = mongoose.Schema;

function validateimage (url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

var ResultSchema = new mongoose.Schema(
    {
        description: { type: String, required:true },
        image: {
            type: String,
            required: true,
            validate: {
                validator: validateimage,
                message: 'Please input a valid image link'
            }
        },
        title: { type: String, required: true }
    }, {
        versionKey: false
    }
);
ResultSchema.plugin(sanitizerPlugin);

var OptionsSchema = new Schema(
    {
        result: { type: Number, min: 0, required:true },
        title: { type: String, required: true},
        image: {
            type: String,
            required: true,
            validate: {
                validator: validateimage,
                message: 'Please input a valid image link'
            }
        },
        description: {type: String}
    }, {
        versionKey: false
    }
);
OptionsSchema.plugin(sanitizerPlugin);

var QuestionSchema = new Schema(
    {
        question: { type: String, required:true},
        image: {
            type: String,
            required: true,
            validate: {
                validator: validateimage,
                message: 'Please input a valid image link'
            }
        },
        options: { type: [OptionsSchema], required: true }
    }, {
        versionKey: false
    }
);
QuestionSchema.plugin(sanitizerPlugin);


var CommentSchema = new Schema(
    {
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
        timestamps: true,
        versionKey: false
    }
);
CommentSchema.plugin(sanitizerPlugin);

var TestSchema = new Schema(
    {
        image: {
            type: String,
            required: true,
            validate: {
                validator: validateimage,
                message: 'Please input a valid image link'
            }
        },
        postedBy: {type: String, required: true},
        description: {type: String, required: true},
        category: {type: String, default: "None"},
        title: {type: String, required: true},
        rating: {type: Number, default: 5},
        results: { type: [ResultSchema] },
        questions: { type: [QuestionSchema],
            validate: {
                validator: function (v) {
                    // console.log('-- Trying to validate');
                    var lres = this.results.length;
                    for (var w in v) {
                        // console.log("Cuantos resultados tiene: "+lres);
                        // console.log("Cuantas opciones tiene: "+v[w].options.length);
                        for (var j in v[w].options) {;
                            var aux = v[w].options[j].result;
                            if (aux < 0 || aux > (lres - 1)) {
                                // console.log('Invalid');
                                return false;
                            }
                        }
                    }
                    return true;
                },
                message: 'Please input a valid result'
            }
        },
        comments: { type: [CommentSchema] }
    }, {
        timestamps: true,
        versionKey: false
    }
);
TestSchema.plugin(sanitizerPlugin);
TestSchema.plugin(paginate);
// TODO: Add user to search
TestSchema.plugin(searchplugin, {
    fields: [ 'title', 'description', 'category', 'category']
});
// TestSchema.index({ user:'text', rating:'text', category:'text'});

module.exports = mongoose.model('Test', TestSchema);
