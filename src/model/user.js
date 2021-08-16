const mongoose = require('mongoose')
const {isEmail} = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const {jwtSecret} = require('../config/env')
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : [true, 'This email is already in use !'],
        validate : {
            validator : function(value){
                if(!isEmail(value)){
                    throw new Error('email is invalid')
                }
            }
        }
    },
    password : {
        type : String,
        minlength : [6, 'minimum length must be 6 !'],
        validate :{
            validator : function(value){
                if(value.includes('password') || value.includes('abcdef') || value.includes('123456')){
                    throw new Error('Please enter a stronger password!')
                }
            }
        }
    },
    isAdmin :{
        type: Boolean,
        default: false
    },

    avatar : {
        type: String
    },
    avatarDeleteId :{
        type: String
    },
    
    watchLater : {
        type: [String],
    },
    tokens : {
        type : [String],
        required : true
    }
}, {
    timestamps:true
})


userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.getUserByCredentials = async function(email, password){
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error('login failed')
    }
    const matchPassword = await bcrypt.compare(password, user.password)
    if(!matchPassword){
        throw new Error('Wrong password')
    }
    return user
}

userSchema.methods.generateSessionToken = async function(){
    const user = this
    const jwt_secret = process.env.JWT_SECRET || jwtSecret
    const token = jwt.sign({_id:user._id.toString()}, jwt_secret)
    
    if(!token){
        throw new Error('operation failed')
    }
    user.tokens = user.tokens.concat(token);
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this;

    let userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    //delete userObject.isAdmin;
    return userObject;
}

const User = mongoose.model('User', userSchema)
module.exports = User