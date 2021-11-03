const express = require('express');
const auth = require('../middleware/userAuth');
const User = require('../model/user');
const Game = require('../model/game');
const upload = require('../helpers/multerUpload');
const cloudinary = require('../helpers/cloudinaryUpload');
const Admin = require('../middleware/adminAuth');

const router = new express.Router()

router.get('/api/users/profile', auth, async (req, res) =>{
    
    try {
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/api/users/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        if(req.user.avatar){
            await cloudinary.uploader.destroy(req.user.avatarDeleteId)
        }
        const result = await cloudinary.uploader.upload(req.file.path, 
            { folder: "Avatars/", 
               public_id: req.user.name 
            }
        );
        req.user.avatar = result.secure_url
        req.user.avatarDeleteId = result.public_id
        const user = await req.user.save() 
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message)
    }

})
router.post('/api/users', async (req, res) =>{
    try {
        const user = new User(req.body);
         await user.save();
        if(!user){
            throw new Error('operation failed')
        }
        const token = await user.generateSessionToken()
        res.status(201).send({token, user})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/**  Endpoint for adding watch later */
router.post('/api/watchlater/:gameId', auth, async (req, res) =>  {
    const gameId = req.params.gameId;
    try {
        if(req.user.watchLater.includes(gameId)){
            throw new Error('This game has already been added')
        }
        req.user.watchLater = req.user.watchLater.concat(gameId)
         await req.user.save()
         res.send('successfully added to watch later list')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/**  Endpoint for removing watch later */
router.post('/api/removewatchlater/:gameId', auth, async (req, res) =>  {
    const gameId = req.params.gameId;
    try {  
        const deleteID = req.user.watchLater.find(id => id?.toString() === gameId)
        if (!deleteID){
            throw new Error('This game doesn\'t exist in your watch later list')
        }

        req.user.watchLater = req.user.watchLater.filter(id => id.toString() !== gameId)
         await req.user.save()
         res.send('successfully removed from watch later list')
    } catch (error) {
        res. status(400).send(error.message)
    }
})

router.patch('/api/users/profile/update', auth, async (req, res) =>{
    const updates = Object.keys(req.body);
    const AllowableUpdates = ['name', 'email', 'password'];
    const isValidUpdate = updates.every(update => AllowableUpdates.includes(update))
    if(!isValidUpdate){
        throw new Error('Invalid update operation')
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
         await req.user.save()
        
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).json({"error": e.message})
    }
})

router.post('/api/users/login', async (req, res) =>{
    try {
        const user = await User.getUserByCredentials(req.body.email, req.body.password);
        const token  = await user.generateSessionToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/api/users/logout', auth, async (req, res) =>{
    try {
        // req.user.tokens = req.user.tokens.filter(token =>{
        //     return token != req.token;
        // }) for multiple clients
        req.user.tokens = []
        await req.user.save();
        res.status(200).send();
        
    } catch (e) {
        res.status(500).send()
    }
});

/** ****************************Admin Routes ************************************************** */
router.get('/api/users',auth, Admin, async (req, res) =>{
    try {
        const users = await User.find()
        if(users.length === 0){
            throw new Error('No users found')
        }
        res.send(users)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.get('/api/users/:id',auth, Admin, async (req, res) =>{
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            throw new Error('No user found')
        }
        
        res.send(user)
    } catch (error) {
        console.log({error})
        res.status(400).send(error)
    }
})

router.delete('/api/users/:id',auth, Admin, async (req, res) =>{
    try {
        
        const user = await User.findById(req.params.id)
        if(!user){
            throw new Error('failed')
        }
        await User.deleteOne({_id:user._id})
        res.status(200).send('successfully deleted')
    } catch (error) {
        res.status(400).send(error.message)
    }
})
module.exports = router