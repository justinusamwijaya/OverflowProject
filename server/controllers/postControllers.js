const { Post } = require('../models')
const mongoose = require('mongoose')

module.exports = {
    addPost:(req,res)=>{
        let { content } = req.body
        let newPost = new Post({
            content,
            answers:[],
            uploader: mongoose.Types.ObjectId(req.user.id),
            upvotes: [],
            downvotes:[],
        })
        Post.create(newPost)
        .then(result =>{
            res.status(200).json({
                msg:'data berhasil ditambahkan!',
                result
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'ada terjadi kesalahan',
                error
            })
        })
    },
    getAllPost:(req,res)=>{

        let condition = !req.params.id ? {} : { uploader: req.params.id }

        Post.find(condition)
        .populate('uploader','username')
        .populate('upvotes', 'username')
        .populate('downvotes','username')
        .exec()
        .then(postsFound =>{
            res.status(200).json({
                msg:'data berhasil didapatkan!',
                postsFound
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan!',
                error
            })
        })

    },
    getOnePost:(req,res)=>{

        Post.findById(req.params.id)
        .then(postFound =>{
            res.status(200).json({
                msg:'data berhasil ditemukan!',
                postFound
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan!',
                error
            })
        })
    },
    addUpvote:(req,res)=>{
        Post.update({_id: req.params.id}, { $pull: { downvotes: req.user.id } }, { multi: true })
        .then(()=>{
            Post.findById(req.params.id)
            .then(postFound=>{
                postFound.upvotes.push(mongoose.Types.ObjectId(req.user.id))
                postFound.save(error=>{
                    if(error) res.status(400).json({
                        msg:"terjadi kesalahan",
                        error
                    })
                    res.status(200).json({
                        msg:'berhasil masuk dalam upvoted post!'
                    })
                })
            })
            .catch(error=>{
                res.status(400).json({
                    msg:'terjadi kesalahan',
                    error
                })
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
    removeUpvote:(req,res)=>{
        Post.update({_id: req.params.id}, { $pull: { upvotes: req.user.id } }, { multi: true })
        .then(()=>{
            res.status(200).json({
                msg:'data berhasil dikeluarkan dari upvoted post!'
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
    addDownvote:(req,res)=>{
        Post.update({_id: req.params.id}, { $pull: { upvotes: req.user.id } }, { multi: true })
        .then(()=>{
            Post.findById(req.params.id)
            .then(postFound=>{
                postFound.downvotes.push(mongoose.Types.ObjectId(req.user.id))
                postFound.save(error=>{
                    if(error) res.status(400).json({
                        msg:"terjadi kesalahan",
                        error
                    })
                    res.status(200).json({
                        msg:'berhasil masuk dalam upvoted post!'
                    })
                })
            })
            .catch(error=>{
                res.status(400).json({
                    msg:'terjadi kesalahan',
                    error
                })
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
    removeDownvote:(req,res)=>{
        Post.update({_id: req.params.id}, { $pull: { downvotes: req.user.id } }, { multi: true })
        .then(()=>{
            res.status(200).json({
                msg:'data berhasil dikeluarkan dari downvoted post!'
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
    updatePost:(req,res)=>{
        let { content } = req.body
        Post.findById(req.params.id)
        .then(postFound => {
            if(req.user.id !== postFound.uploader.toString()) return res.status(403).json({
                msg:"you can't update post that isn't yours!"
            })

            let updatedPost = {
                content
            }

            Post.updateOne({_id:req.params.id},updatedPost,(err,result)=>{
                if(err) return res.status(400).json(err)
                Post.findById(req.params.id,(err,updatedData)=>{
                    res.status(200).json({
                        msg: "data berhasil diupdate!",
                        result:updatedData
                    })
                })
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
    deletePost:(req,res)=>{
        Post.findById(req.params.id)
        .then(postFound => {
            if(req.user.id !== postFound.uploader.toString()) return res.status(403).json({
                msg:"you can't delete post that isn't yours!"
            })
            postFound.remove(error =>{
                if(error) return res.status(400).json({
                    msg:'terjadi kesalahan',
                    error
                })
                res.status(200).json({
                    msg:'data berhasil dihapus!'
                })
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
}