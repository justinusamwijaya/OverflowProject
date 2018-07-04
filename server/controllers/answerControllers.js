const { Answer } = require('../models')
const mongoose = require('mongoose')

module.exports = {
    addAnswer:(req,res)=>{
        let { content, postParentId } = req.body
        let newAnswer = new Answer({
            content,
            uploader: mongoose.Types.ObjectId(req.user.id),
            postParent: mongoose.Types.ObjectId(postParentId),
            upvotes:[],
            downvotes:[]
        })
        Answer.create(newAnswer)
        .then(result =>{
            res.status(200).json({
                msg: 'data berhasil ditambahkan!',
                result
            })
        })
        .catch(error =>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
    getAllAnswer:(req,res)=>{
        Answer.find({ postParent: req.params.postId })
        .populate('uploader')
        .populate('postParent')
        .populate('upvotes', 'username')
        .populate('downvotes','username')
        .exec()
        .then(answersFound =>{
            res.status(200).json({
                msg:'comment berhasil didapatkan!',
                answersFound
            })
        })
        .catch(error=>{
            res.status(400).json({
                msg:'terjadi kesalahan',
                error
            })
        })
    },
    updateAnswer:(req,res)=>{
        Answer.findById(req.params.id)
        .then(commentFound =>{
            if(req.user.id !== commentFound.uploader.toString()) return res.status(403).json({
                msg:"you can't edit comment that isn't yours!"
            })
            let { content } = req.body
            let updatedAnswer = {
                content
            }

            Answer.updateOne({ _id: req.params.id }, updatedAnswer)
            .then(()=>{
                Answer.findById(req.params.id)
                .then(commentFound=>{
                    res.status(200).json({
                        msg:'data berhasil diupdate!',
                        commentFound
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

        })
    },
    deleteAnswer:(req,res)=>{
        Answer.findById(req.params.id)
        .then(commentFound => {
            if(req.user.id !== commentFound.uploader.toString()) return res.status(403).json({
                msg:"you can't delete comment that isn't yours!"
            })
            commentFound.remove(error =>{
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
    addUpvote:(req,res)=>{
        Answer.update({_id: req.params.id}, { $pull: { downvotes: req.user.id } }, { multi: true })
        .then(()=>{
            Answer.findById(req.params.id)
            .then(commentFound=>{
                commentFound.upvotes.push(mongoose.Types.ObjectId(req.user.id))
                commentFound.save(error=>{
                    if(error) res.status(400).json({
                        msg:"terjadi kesalahan",
                        error
                    })
                    res.status(200).json({
                        msg:'berhasil masuk dalam upvoted comment!'
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
        Answer.update({_id: req.params.id}, { $pull: { upvotes: req.user.id } }, { multi: true })
        .then(()=>{
            res.status(200).json({
                msg:'data berhasil dikeluarkan dari upvoted comment!'
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
        Answer.update({_id: req.params.id}, { $pull: { upvotes: req.user.id } }, { multi: true })
        .then(()=>{
            Answer.findById(req.params.id)
            .then(commentFound=>{
                commentFound.downvotes.push(mongoose.Types.ObjectId(req.user.id))
                commentFound.save(error=>{
                    if(error) res.status(400).json({
                        msg:"terjadi kesalahan",
                        error
                    })
                    res.status(200).json({
                        msg:'berhasil masuk dalam upvoted comment!'
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
        Answer.update({_id: req.params.id}, { $pull: { downvotes: req.user.id } }, { multi: true })
        .then(()=>{
            res.status(200).json({
                msg:'data berhasil dikeluarkan dari downvoted comment!'
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