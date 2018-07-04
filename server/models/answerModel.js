const mongoose = require("mongoose")
const Schema = mongoose.Schema

const answerSchema = new Schema({
    content:String,
    postParent:{ type:Schema.Types.ObjectId, ref:'Post' },
    uploader:{ type:Schema.Types.ObjectId,ref:'User' },
    upvotes:[{ type:Schema.Types.ObjectId,ref:'User' }],
    downvotes:[{ type:Schema.Types.ObjectId,ref:'User' }]
},{timestamps:{ createdAt:'createdAt',updatedAt:'updatedAt' }})

const answerModel = mongoose.model('Answer', answerSchema)

module.exports = { answerModel,answerSchema }