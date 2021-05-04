const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const PostsCollection = require('../../models/postCollection')
const UsersCollection = require('../../models/usersCollection')

//update required field of a post---> only if you r owner of post
router.patch(
  '/profile/post/update/:title',
  auth,
  async ({ body, params, user }, res) => {
    try {
      const userUpdates = Object.keys(body)
      const allowedUpdates = ['title', 'body', 'blogImages']
      const isValidUpdate = userUpdates.every((updates) =>
        allowedUpdates.includes(updates)
      )
      if (!isValidUpdate) {
        return res.status(404).send({
          error: `invalid property is not updated `,
        })
      }
      const post = await PostsCollection.findOne({
        title: params.title.toLowerCase(),
        postOwner: user.userName.toLowerCase(),
      })
      //   const post1 = await PostsCollection.aggregate([
      //      {
      //         $match: {
      //            title: params.title.toLowerCase(),
      //            postOwner: user.userName.toLowerCase(),
      //         },
      //      },
      //   ])
      //   console.log(post1)

      // We can not use save method using aggregate and moreover it return an array of document so we have to go one step down to get the document.

      if (!post) throw new Error('post not found!')
      userUpdates.forEach((update) => (post[update] = body[update]))
      await post.save()
      res.status(202).send({ message: `${post.title}  updated successfully!!` })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }
)
// route for upVotes and downVotes any authorized person can access
router.patch(
  '/profile/post/votes/:title',
  auth,
  async ({ body, params }, res) => {
    try {
      const userUpdates = Object.keys(body)
      const allowedUpdates = ['upVote', 'downVote']
      const isValidUpdate = userUpdates.every((updates) =>
        allowedUpdates.includes(updates)
      )
      if (!isValidUpdate) {
        res.status(400).send({ error: error.message })
      }
      const post = await PostsCollection.findOne({
        title: params.title.toLowerCase(),
      })
      if (!post) throw new Error('post not found!')
      userUpdates.forEach((update) => (post[update] = body[update]))
      await post.save()
      res.status(202).send({ message: `${post.title}  updated successfully!!` })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }
)

//add or update comments in a post
router.patch(
  '/profile/post/:userName/:postTitle/comment',
  auth,
  async ({ body, params, user }, res) => {
    try {
      const post = await PostsCollection.findOne({
        postOwner: params.userName.toLowerCase(),
        title: params.postTitle.toLowerCase(),
      })
      if (!post) throw new Error('post not found!!')

      post.comments = [{ ...body, owner: user.userName }, ...post.comments]
      await post.save()
      res.status(202).send({ message: 'comment posted!', c: post.comments })
    } catch (error) {
      res.status(404).send({ error: error.message })
    }
  }
)

module.exports = router
