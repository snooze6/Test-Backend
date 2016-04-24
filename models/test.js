/**
 * Created by snooze on 4/23/16.
 */

var mongoose = require('mongoose');
// var paginate = require('mongoose-paginate');
// var searchplugin = require('mongoose-search-plugin');
// var autoincrement = require('mongoose-auto-increment');
var sanitizerPlugin = require('mongoose-sanitizer');
var Schema = mongoose.Schema;

function validateimage (url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

var ResultSchema = new mongoose.Schema(
    {
        description: { type: String, required:true },
        image: String,
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
        image: String
    }, {
        versionKey: false
    }
);
OptionsSchema.plugin(sanitizerPlugin);

var QuestionSchema = new Schema(
    {
        question: { type: String, required:true},
        image: String,
        options: [OptionsSchema]
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
        results: [ResultSchema],
        questions: [QuestionSchema],
        comments: [CommentSchema]
    }, {
        timestamps: true,
        versionKey: false
    }
);
TestSchema.plugin(sanitizerPlugin);

// TestSchema.plugin(paginate);
// TestSchema.plugin(searchplugin, {
//     fields: ['user', 'description', 'category']
// });
// TestSchema.index({ user:'text', rating:'text', category:'text'});

// TestSchema.path('questions').validate(function(value, done){
//     console.log('--Intentaré validar');
//
//     var q;
//     for (var i=0; i < this.questions.length; i++){
//         q = this.questions[i];
//         for (var j=0; j< q.options.length; j++){
//             console.log(q.options[j].id_result+'>'+this.results.length);
//             if (q.options[j].id_result>this.results.length) {
//                 console.log('Validado mal');
//                 done(false);
//                 //this.invalidate();
//                 //return false;
//                 //next(Error('id_result must be lower than results.lenght'));
//             }
//         }
//     }
//     console.log('Validado bien');
//     done(true);
// })

//TestSchema.pre('validate', function(next){
//    //console.log("post validate called");
//    //next();
//    console.log('--Intentaré validar');
//    var q
//    for (var i=0; i < this.questions.length; i++){
//        q = this.questions[i];
//        for (var j=0; j< q.options.length; j++){
//            console.log(q.options[j].id_result+'>'+this.results.length);
//            if (q.options[j].id_result>this.results.length) {
//                console.log('Validado mal');
//                //this.invalidate();
//                //return false;
//                next(Error('id_result must be lower than results.lenght'));
//            }
//        }
//    }
//    console.log('Validado bien');
//    return true;
//    //next();
//})
//if (global.autoincrement) {
//    console.log('autoincrement added to plugins')
//    TestSchema.plugin(global.autoincrement.plugin, 'Test')
//}
//schema.index({ animal: 'text', color: 'text', pattern: 'text', size: 'text' });

module.exports = mongoose.model('Test', TestSchema);
