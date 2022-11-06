require('./db/connection')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const createUsers = require('./routers/usersRouter/createUsers')
const readUsers = require('./routers/usersRouter/readUsers')
const updateUsers = require('./routers/usersRouter/updateUsers')
const deleteUsers = require('./routers/usersRouter/deleteUsers')

const createPosts = require('./routers/postsRouter/createPosts')
const readPosts = require('./routers/postsRouter/readPosts')
const updatePosts = require('./routers/postsRouter/updatePosts')
const deletePosts = require('./routers/postsRouter/deletePosts')

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(
   express.urlencoded({
      extended: false,
   }),
)
app.use(createUsers)
app.use(readUsers)
app.use(updateUsers)
app.use(deleteUsers)

app.use(createPosts)
app.use(readPosts)
app.use(updatePosts)
app.use(deletePosts)
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
   return res.send({
      hello: 'Welcome to streamflow api',
      message: 'Please use postman for interacting with the api.',
      postmanCollection: "https://github.com/abhi2425/streamflow-blog-api/blob/master/stream_flow_blog_api.postman_collection.json"
   });
})

app.listen(port, () => {
   console.log('Server is up at ', port);
})
