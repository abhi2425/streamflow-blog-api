const express = require('express')
const router = express.Router()

const auth = require('../../middlewares/auth')
const postImageUpload = require('../../utils/multerUpload')
const uploadToCloudinaryByStreams = require('../../utils/uploadToCloudinary')
const PostsCollection = require('../../models/postCollection')

//create post only if u r authorized user
router.post('/profile/post/create', auth, async ({ user, body }, res) => {
   try {
      body.title = body.title.replace(/\s/g, '-')

      const post = await PostsCollection({
         postOwner: user.userName,
         ...body,
      })
      await post.save()
      res.status(201).send(post)
   } catch (error) {
      res.status(500).send({ error: error.message })
   }
})

//upload image in  a post if any ---> must be owner of post
router.post(
   '/profile/post/upload/:postTitle',
   auth,
   postImageUpload.array('blogImages', 10),
   async ({ params, user, files }, res) => {
      try {
         const post = await PostsCollection.findOne({
            postOwner: user.userName,
            title: params.postTitle,
         })
         if (!post) throw new Error('post not found!')

         const images = []
         for (const file of files) {
            const result = await uploadToCloudinaryByStreams(file.buffer)
            images.push({
               url: result.secure_url,
               publicId: result.public_id,
            })
            post.blogImages = [
               ...post.blogImages,
               { image: result.secure_url, publicId: result.public_id },
            ]
            await post.save()
         }

         res.status(200).send({
            message: 'images uploaded!!',
            images,
         })
      } catch (error) {
         res.status(400).send({
            error: error.message,
         })
      }
   },
   (error, _, res, next) => {
      res.status(400).send({
         error: error.message,
      })
   },
)

module.exports = router
