const express = require('express');
const path = require('path')
const cors = require('cors');
require('./src/config/db')()

const userRouter = require('./src/route/user')
const gameRouter = require('./src/route/game')
const userRequestRouter = require('./src/route/userRequest')
const CommentRouter = require('./src/route/comment');
const sendMail = require('./src/helpers/mailer');


const app = express()
const port = process.env.PORT || 8080

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//app.use(express.static(path.join(__dirname, '../client', 'build')))

app.use(userRouter)
app.use(gameRouter)
app.use(userRequestRouter)
app.use(CommentRouter)
app.post('/api/contact', sendMail)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
});
const server = app.listen(port, ()=>{
    console.log(`http://localhost:${port}`)
})
//const server = app.listen(port, () => console.log('Server ready'))

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Program is exiting ...')
      setTimeout(() => {
        console.log('Process terminated at 5 seconds')
        process.exit(0)
      }, 5000)
    
  })
})