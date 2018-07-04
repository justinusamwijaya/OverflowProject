const { postSchema, postModel } = require('./postModel.js')
const { answerSchema, answerModel } = require('./answerModel.js')
const { userSchema, userModel } = require('./userModel.js')

postSchema.pre('save', function(next) {
    userModel.update(
        { }, 
        { $pull: { postsUploaded: this._id } },
        { multi: true })
        .exec()
    userModel.findById(this.uploader,(err,userFound)=>{
        if(err) return res.status(400)
        userFound.postsUploaded.push(this)
        userFound.save()
        next();
    })
});

postSchema.pre('remove', function(next) {
    userModel.update(
        { }, 
        { $pull: { postsUploaded: this._id } },
        { multi: true })
    .exec();
    answerModel.deleteMany({ postParent: this._id })
    next();
})

answerSchema.pre('save', function(next) {
    postModel.update(
        { },
        { $pull: { answers: this._id } },
        { multi:true }
    ).exec();
    postModel.findById(this.postParent)
    .then(postFound =>{
        postFound.answers.push(this)
        postFound.save()
        next()
    })
    .catch(error=>{
        res.status(400)
    })
})

answerSchema.pre('remove',function(next){
    postModel.update(
        { },
        { $pull: { answers: this._id } },
        { multi:true }
    ).exec();
    next();
})

module.exports = { User: userModel, Answer: answerModel, Post:postModel }