const express = require('express')
const Comment = require('../model/comment')
const Admin = require('../middleware/adminAuth');
const auth = require('../middleware/userAuth');

const router =  express.Router()

router.get('/api/comments', auth, Admin, async (req, res) =>{
    try {
        const comments = await Comment.find().populate('author')
        res.send(comments)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.get('/api/comments/:gameId/comments', async (req, res) =>{
    try {
        const comments = await Comment.find({gameId : req.params.gameId}).populate('author')
        res.send(comments)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.get('/api/comments/:id', auth, Admin, async (req, res) =>{
    try {
        const comment = await Comment.findById(req.params.id).populate('author')
        if(!comment){
            throw new Error('No found')
        }
        res.send(comment)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.post('/api/comments', auth, async (req, res) =>{
    try {
        const newComment = new Comment({
            authorId : req.user._id,
            gameId : req.body.gameId,
            content : req.body.content
        })
        const comment = await newComment.save()
        if(!comment){
            throw new Error('failed')
        }
        res.status(201).send()
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete('/api/comments/:id/admin', auth, Admin, async (req, res) =>{
    try {
        const comment = await Comment.findById(req.params.id)
        if(!comment){
            throw new Error('Failed, comment not found!')
        }
        await Comment.deleteOne({_id : req.params.id})
        res.send('successfully deleted')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// router.delete('/api/comments/:id', auth, async (req, res) =>{
//     try {
//         const comment = await Comment.findById(req.params.id)
       
//         if(!comment || !comment.authorId === req.user._id){
//             throw new Error('Not allowed.')
//         }
//         await Comment.deleteOne({_id : req.params.id})
//         res.send('successfully deleted')
//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// })

module.exports = router