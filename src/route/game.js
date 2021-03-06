const express = require('express')
const auth = require('../middleware/userAuth');
const Admin = require('../middleware/adminAuth');
const router = express.Router()
const Game = require('../model/game')
const upload = require('../helpers/multerUpload');
const cloudinary = require('../helpers/cloudinaryUpload');

 router.get('/api/games', async (req, res) => {
    try {
        console.log('yes')
        const games = await Game.find()
        if(games.length === 0 ){
            throw new Error('Names games found')
        }
        res.send(games)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
//get games by category name
router.get('/api/games/category/:cat_name', async (req, res) => {
    try {
        
        const games = await Game.find({'category.tournament.name': req.params.cat_name})
        if(!games){
            throw new Error('Names games found')
        }
        res.send(games)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// get games by category specific name
router.get('/api/games/category/:cat_name/specific/:cat_spec_name', async (req, res) => {
    try {
        //console.log(req.path, req.params)
        const games = await Game.find({'category.tournament.specific_name': req.params.cat_spec_name})
        if(!games){
            throw new Error('Names games found')
        }
        res.send(games)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/api/games/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const game = await Game.findById(req.params.id)
        if(!game){
            throw new Error('no found !')
        }
        res.send(game)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.post('/api/games', auth, Admin, upload.single('thumbnail'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, 
            { folder: "GameThumbnails/", 
               public_id: req.file.filename 
            }
        );
        const newGame = new Game({
            title : req.body.title,
            description : req.body.description,
            youtubeId : req.body.youtubeId,
            category :{
                tournament : {
                    name : req.body.tournament_name,
                    specific_name : req.body.tournament_specific_name
                }
            },
            game_date : req.body.game_date,
            duration: req.body.duration,
            homeTeam : {
                name : req.body.homeTeam_name,
                goals : req.body.homeTeam_goals
            },
            awayTeam : {
                name : req.body.awayTeam_name,
                goals : req.body.awayTeam_goals
            },
            thumbnail : result.secure_url,
            thumbnailDeleteId : result.public_id,
        });
        
        const game = await newGame.save()
        res.status(201).send(game)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.put('/api/games/:id', auth, Admin, upload.single('thumbnail'), async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if(!game){
            throw new Error('game no found')
        }
        await cloudinary.uploader.destroy(game.thumbnailDeleteId)
        const result = await cloudinary.uploader.upload(req.file.path, 
            { folder: "GameThumbnails/", 
               public_id: req.file.filename 
            }
        );
        game.title = req.body.title,
        game.description = req.body.description
        game.youtubeId = req.body.youtubeId
        game.category.tournament.name = req.body.tournament_name
        game.category.tournament.specific_name = req.body.tournament_specific_name
        game.game_date = req.body.game_date,
        game.duration = req.body.duration,
        game.homeTeam.name = req.body.homeTeam_name
        game.homeTeam.goals = req.body.homeTeam_goals
        game.awayTeam.name = req.body.awayTeam_name
        game.awayTeam.goals = req.body.awayTeam_goals
        game.thumbnail = result.secure_url
        game.thumbnailDeleteId = result.public_id
        
        const gameUpdate = await game.save()
        res.status(201).send(gameUpdate)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/** Route for liking a game */
router.post('/api/games/:id/liked', auth, async (req, res) => {
    try {
        if(req.user.liked.includes(req.params.id)){
            throw new Error('You already liked this game!')
        }
        const game = await Game.findById(req.params.id)
        if(!game){
            throw new Error('Game not found!')
        }
        game.likes++;
        await game.save()
        req.user.liked = req.user.liked.concat(req.params.id);
        await req.user.save();
        res.send('Game Liked')
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.delete('/api/games/:id', auth, Admin, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if(!game){
            throw new Error('game no found')
        }
        await cloudinary.uploader.destroy(game.thumbnailDeleteId)
        const gameDeleted = await Game.deleteOne({_id : game._id})
        res.status(201).send(`successfully deleted : ${game.title}`)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router
