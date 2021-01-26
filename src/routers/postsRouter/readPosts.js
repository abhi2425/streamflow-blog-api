const express = require('express')
const router = express.Router()
const PostsCollection = require('../../models/postCollection')
const UsersCollection = require('../../models/usersCollection')

//search for any thing
router.get('/search', async ({ query }, res) => {
   try {
      const postsResult = await PostsCollection.aggregate([
         {
            $match: {
               $text: {
                  $search: query.search,
                  $caseSensitive: false,
                  $diacriticSensitive: false,
               },
            },
         },
         { $project: { title: 1, body: 1, blogImages: 1, _id: 0 } },
      ])
      const usersResult = await UsersCollection.aggregate([
         {
            $match: {
               $text: {
                  $search: query.search,
                  $caseSensitive: false,
                  $diacriticSensitive: false,
               },
            },
         },
         {
            $project: {
               name: 1,
               userName: 1,
               email: 1,
               interest: {
                  $filter: {
                     input: '$interests',
                     as: 'interest',
                     cond: {
                        $eq: ['$$interest', query.search],
                     },
                  },
               },
               avatar: 1,
               _id: 0,
            },
         },
      ])
      if (!postsResult.length && !usersResult.length)
         throw new Error('nothing found for search term-:' + query.search)
      res.status(200).send([...postsResult, ...usersResult])
   } catch (error) {
      res.status(404).send({ error: error.message })
   }
})

// get all posts of every user
router.get('/posts', async (_, res) => {
   try {
      const posts = await PostsCollection.find({})
      if (posts.length === 0) throw new Error('no posts found!')
      return res.status(200).send(posts)
   } catch (error) {
      res.status(404).send({ error: error.message })
   }
})
//get titles of all post of every user
router.get('/posts/titles', async (_, res) => {
   try {
      const titles = await PostsCollection.aggregate([{ $project: { _id: 0, title: 1 } }])
      if (titles.length === 0) throw new Error('no posts found')
      return res.status(200).send(titles)
   } catch (error) {
      res.status(500).send({ error: error.message })
   }
})

// get titles of all post of particular user
router.get('/:userName/posts/titles', async ({ params }, res) => {
   try {
      const titles = await PostsCollection.aggregate([
         { $match: { postOwner: params.userName.toLowerCase() } },
         { $project: { title: 1, _id: 0 } },
      ])
      if (titles.length === 0) throw new Error('user not found')
      return res.status(200).send(titles)
   } catch (error) {
      res.status(404).send({ error: error.message })
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
      if (post.length === 0) throw new Error('either user or post not found!!')

      return res.status(200).send(...post)
   } catch (error) {
      res.status(404).send({ error: error.message })
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
      if (comments.length === 0) throw new Error('either user or post not found!!')
      res.status(200).send(comments)
   } catch (error) {
      res.status(404).send({ error: error.message })
   }
})

module.exports = router
