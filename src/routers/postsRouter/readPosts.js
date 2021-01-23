const express = require('express')
const router = express.Router()
const PostsCollection = require('../../models/postCollection')

// get all posts of every user
router.get('/posts', async (_, res) => {
   try {
      const posts = await PostsCollection.find({})
      if (!posts) return res.status(404).send({ error: 'No posts found' })
      return res.status(200).send(posts)
   } catch (error) {
      res.status(500).send('Error-: ' + error.message)
   }
})
//get titles of all post of every user
router.get('/posts/titles', async (_, res) => {
   try {
      const titles = await PostsCollection.aggregate([{ $project: { _id: 0, title: 1 } }])
      if (titles.length === 0) throw new Error()
      return res.status(200).send(titles)
   } catch (error) {
      res.status(500).send('Error-: ' + error.message)
   }
})

// get titles of all post of particular user
router.get('/:userName/posts/titles', async ({ params }, res) => {
   try {
      const titles = await PostsCollection.aggregate([
         { $match: { postOwner: params.userName.toLowerCase() } },
         { $project: { title: 1, _id: 0 } },
      ])
      if (titles.length === 0) throw new Error()
      return res.status(200).send(titles)
   } catch (error) {
      res.status(404).send({ error: 'user not found!!' })
   }
})
// get all post of one user
router.get('/:userName/posts', async ({ params }, res) => {
   try {
      const post = await PostsCollection.aggregate([
         {
            $match: {
               postOwner: params.userName.toLowerCase(),
            },
         },
      ])
      if (post.length === 0) throw new Error('no post found for user')
      return res.status(200).send(post)
   } catch (error) {
      res.status(404).send({ error: error.message })
   }
})

// get particular post of particular user
router.get('/:userName/post/:postTitle', async ({ params }, res) => {
   try {
      const post = await PostsCollection.aggregate([
         {
            $match: {
               postOwner: params.userName.toLowerCase(),
               title: params.postTitle.toLowerCase(),
            },
         },
      ])
      if (post.length === 0) throw new Error()

      return res.status(200).send(...post)
   } catch (error) {
      res.status(404).send({ error: 'either user or post not found!!' })
   }
})

//get comments on a post of a user
router.get('/:userName/post/:postTitle/comments', async ({ params }, res) => {
   try {
      const comments = await PostsCollection.aggregate([
         {
            $match: {
               postOwner: params.userName.toLowerCase(),
               title: params.postTitle.toLowerCase(),
            },
         },
         { $project: { _id: 0, comments: 1 } },
      ])
      if (comments.length === 0) throw new Error('Either user or post not found!!')
      res.status(200).send(comments)
   } catch (error) {
      res.status(404).send(error.message)
   }
})

module.exports = router
