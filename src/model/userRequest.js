const mongoose = require('mongoose')
const {isEmail} = require('validator')
const userRequestSchema = new mongoose.Schema({
    email:{
        type : String,
        required: [true, 'email is required!'],
        validate : {
            validator : function(value){
                if(!isEmail(value)){
                    throw new Error('email is invalid')
                }
            }
        }
    },
    subject : {
        type : String,
        required: [true, 'subject is required, please add a subject'],
        trim : true
    },
    message:{
        type : String,
        required: [true, 'message is required, please add a message'],
        trim : true
    },
    received : {
        type : Boolean,
        default : false
    }
});

const UserRequest = mongoose.model('UserRequest', userRequestSchema)
module.exports = UserRequest;