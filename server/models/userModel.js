const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:String,
    email:String,
    password:String,
    postsUploaded:[{ type:Schema.Types.ObjectId,ref:'Post' }]
},{timestamps:{createdAt:'createdAt',updatedAt:'updatedAt'}})

const userModel = mongoose.model('User', userSchema)

module.exports = { userModel,userSchema }