const jwt  = require('jsonwebtoken');
const User = require('../model/user');
const {jwtSecret} = require('../config/env');

const jwtsecret = process.env.JWT_SECRET || jwtSecret;

const auth = async function(req, res, next){
    try {
        
        if(!req.header('Authorization')){
            throw new Error('Unauthroized')
        }
        const token = req.header('Authorization').replace('Bearer ', '')
        //console.log(token)
        const decoded = jwt.verify(token, jwtsecret);
        const user  = await User.findOne({_id:decoded._id, 'tokens':token}).populate('watchLater');
        
        if(!user){
            throw new Error('access priviledged')
        }
        req.user = user; //  make user available in request object
        req.token = token   //  make token available in request object
        next()
    } catch (error) {
        res.status(401).send(error.message)
    }
}
module.exports = auth;