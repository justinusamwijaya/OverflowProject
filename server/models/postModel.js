const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    content:String,
    answers:[{ type:Schema.Types.ObjectId, ref: 'Answer' }],
    uploader:{ type:Schema.Types.ObjectId,ref:'User' },
    upvotes: [{ type:Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type:Schema.Types.ObjectId, ref: 'User' }]
},{timestamps:{createdAt:'createdAt',updatedAt:'updatedAt'}})

const postModel = mongoose.model('Post', postSchema)

module.exports = { postModel,postSchema }