const bcrypt = require('bcryptjs')
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const helper = require('../helpers')

module.exports = {
    signup:(req,res)=>{
        let { username, email, password } = req.body
        password = bcrypt.hashSync(password, 10);
        let newUser = new User({
            username,
            email,
            password,
            postsUploaded:[],
            postsUpvoted:[]
        })
        User.create(newUser)
        .then(result =>{
            res.status(200).json({
                msg:'user berhasil ditambahkan!',
                result,
            })
        })
        .catch(error =>{
            res.status(400).json({
                msg:'terjadi kesalahan!',
                error,
            })
        })
    },
    login:(req,res)=>{
        let { user, password } = req.body
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let dataSearch = regex.test(user)?{ email:user }:{ username:user }
        User.findOne( dataSearch ,(err,data)=>{
            if(err) return res.status(400).json({msg:'terjadi kesalahan', err})
            if(!data)return res.status(400).json({msg:"data tidak ditemukan!"}) 
            if(bcrypt.compareSync(password, data.password)){
                jwt.sign({ id:data._id,username:data.username },process.env.SECRETKEY,(err,result)=>{
                    if(err) res.status(400).json({msg:'terjadi kesalahan', err})
                    res.status(200).json({
                        token:result,
                        id:data._id,
                        username:data.username,
                    })
                })
            }else{
                res.status(403).json({
                    msg: "password yang dimasukkan salah!"
                })
            }

        })
    },
    facebookLogin:(req,res)=>{
        let { email } = req.body
        User.findOne({ email },(err,data)=>{
            if(err) return res.status(400).json({msg:'terjadi kesalahan', err})
            if(!data){
                function userAvailable(){
                    let newName = helper.generateRandomUser()
                    User.findOne({ username:newName }, (err,result)=>{
                        if(err) throw err
                        if(result) return userAvailable()
                        let newUser = {
                            username:newName,
                            email,
                            password:'',
                            postsUploaded:[],
                            postsUpvoted:[]
                        }
                        User.create(newUser)
                        .then(FBuserCreated =>{
                            jwt.sign({ id:FBuserCreated._id,username:FBuserCreated.username },process.env.SECRETKEY,(err,result)=>{
                                if(err) res.status(400).json({msg:'terjadi kesalahan', err})
                                res.status(200).json({
                                    token:result,
                                    id:FBuserCreated._id,
                                    username:FBuserCreated.username,
                                })
                            })
                        })
                        .catch(error =>{
                            res.status(400).json({
                                msg:'terjadi kesalahan!',
                                error,
                            })
                        })
                    })
                }
                userAvailable()
            }else{
                jwt.sign({ id:data._id,username:data.username },process.env.SECRETKEY,(err,result)=>{
                    if(err) res.status(400).json({msg:'terjadi kesalahan', err})
                    res.status(200).json({
                        token:result,
                        id:data._id,
                        username:data.username,
                    })
                })
            }
        })
    },
    requestProfile:(req,res)=>{
        let { id } = req.user
        User.findById(id)
        .then(userFound => {
            res.status(200).json({
                msg:'data berhasil didapatkan',
                userFound
            })
        })
    },
    updateProfile:(req,res,next)=>{
        let { giveOldPassword, username, password, oldPassword } = req.body
        User.findById(req.user.id)
        .then(foundUser=>{
            if(giveOldPassword){
                if(bcrypt.compareSync(oldPassword, foundUser.password)){
                    foundUser.username = username
                    if(password !== ''){
                        return foundUser.save(()=>{
                            next()
                        })
                    }
                }else{
                    res.status(403).json({
                        msg: "password yang dimasukkan salah!"
                    })
                }
            }else{
                foundUser.username = username
                return foundUser.save(()=>{
                    next()
                })
            }

            foundUser.save(error=>{
                if(error) return res.status(500).json({msg:'terjadi kesalahan!', error})
                res.status(200).json({msg:'data berhasil diupdate!', foundUser})
            })
        })
    },
    updatePasswordProfile:(req,res)=>{
        let { password } = req.body
        User.findById(req.user.id)
        .then(foundUser=>{
            console.log(foundUser)
            foundUser.password = password
            foundUser.save(error=>{
                if(error) return res.status(500).json({msg:'terjadi kesalahan!', error})
                res.status(200).json({msg:'data berhasil diupdate!', foundUser})
            })
        })
    }
}