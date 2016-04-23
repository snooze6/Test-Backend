/**
 * Created by snooze on 4/23/16.
 */

var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var searchplugin = require('mongoose-search-plugin');
//var autoincrement = require('mongoose-auto-increment');

var TestSchema = new mongoose.Schema(
    {
        URLPhoto: String,
        user: String,
        description: String,
        category: {type: String, default: "DEFAULT"},
        title: {type: String, required: true},
        rating: {type: Number, default: 0},
        results:
            [
                {
                    description: { type: String, required:true },
                    URLPhoto: String,
                    title: { type: String, required: true }
                    /*
                     * MongoDB arrays keep their order so by adding an
                     * id you're only creating more data
                     */
                    //id: { type: Number, required: true, unique: true}
                }
            ],
        questions:
            [
                {
                    question: { type: String, required:true},
                    URLPhoto: String,
                    options:
                        [
                            {
                                //result: {
                                //    description: String,
                                //    idResult: String,
                                //    URLPhoto:    String,
                                //    title:      String,
                                //    id: Number,
                                //},
                                id_result: {type: Number, min: 0, required:true
                                    //validate: {
                                    //    validator: function(v){
                                    //        console.log('-- Trying to validate');
                                    //        return v<this.results.length;
                                    //    },
                                    //    message: 'Cannot validate'
                                    //}
                                },
                                title: { type: String, required: true},
                                URLPhoto: String,
                                selected: {type: Boolean, default: false}
                            }
                        ]
                }
            ]
    }
);
TestSchema.plugin(paginate);
TestSchema.plugin(searchplugin, {
    fields: ['user', 'description', 'category']
});
TestSchema.index({ user:'text', rating:'text', category:'text'});
TestSchema.path('questions').validate(function(value,done){
    console.log('--Intentaré validar');

    var q
    for (var i=0; i < this.questions.length; i++){
        q = this.questions[i];
        for (var j=0; j< q.options.length; j++){
            console.log(q.options[j].id_result+'>'+this.results.length);
            if (q.options[j].id_result>this.results.length) {
                console.log('Validado mal');
                done(false);
                //this.invalidate();
                //return false;
                //next(Error('id_result must be lower than results.lenght'));
            }
        }
    }
    console.log('Validado bien');
    done(true);
})


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
