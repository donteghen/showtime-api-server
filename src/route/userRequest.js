const express = require('express');
const Admin = require('../middleware/adminAuth');
const auth = require('../middleware/userAuth');
const UserRequest = require('../model/userRequest')

const router = new express.Router()

router.get('/api/userRequests', auth, Admin, async (req, res) =>{
    try {
        const userRequests = await UserRequest.find();
        if (userRequests.length === 0) {
            throw new Error('No User Requests founds !')
        }
        res.send(userRequests)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/api/userRequests/:id', auth, Admin, async (req, res) =>{
    try {
        const userRequest = await UserRequest.findById(req.params.id);
        if (!userRequest) {
            throw new Error('User Requests founds !')
        }
        res.send(userRequest)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/api/userRequests', auth, async (req, res) =>{
    try {
        const newUserRequest = new UserRequest(req.body);
        if (!newUserRequest) {
            throw new Error('Operation failed !')
        }
        const userRequest = await newUserRequest.save();
        res.send(userRequest)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/api/userRequests/:id/received', auth, Admin, async (req, res) =>{
    try {
        const userRequest = await UserRequest.findById(req.params.id);
        if (!userRequest) {
            throw new Error('not found !')
        }
        userRequest.received = true;
        
        const userRequestUpdate = await userRequest.save();
        res.send(userRequestUpdate)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete('/api/userRequests/:id', auth, Admin, async (req, res) =>{
    try {
        const userRequest = await UserRequest.findById(req.params.id)
        if (!userRequest) {
            throw new Error('not found !')
        }
        await UserRequest.deleteOne({_id : userRequest._id})
        res.send('Successfully deleted')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router