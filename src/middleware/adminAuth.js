const User = require("../model/user");

const Admin = async function(req, res, next){
    try {
        if(!req.user.isAdmin){
            throw new Error('Unauthorized, requires ADMIN')
        }
        next()
    } catch (error) {
        res.status(401).send(error.message)
    }
}
module.exports = Admin;