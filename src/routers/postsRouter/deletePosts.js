const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const PostsCollection = require('../../models/postCollection')
const deleteImageFromCloudinary = require('../../services/cloudinary/deleteFromCloudinary')

//delete a post along with all images in it using title only if u r owner of post
router.delete('/profile/post/delete/:title', auth, async ({ user, params }, res) => {
   try {
      const post = await PostsCollection.findOne({
         postOwner: user.userName,
         title: params.title,
      })
      if (!post) throw new Error('Posts not found!!')
      const deletedPost = await post.remove()

      return res
         .status(200)
         .send({ message: `${user.name}'s '${deletedPost.title} post' deleted successfully!!` })
   } catch (error) {
      res.status(404).send({ error: error.message })
   }
})
//delete post image of particular post
router.delete(
   '/profile/post/delete/:title/post-image/:publicId',
   auth,
   async ({ user, params }, res) => {
      try {
         const result = await deleteImageFromCloudinary(params?.publicId)
         if (result.result === 'not found') throw new Error('Something went wrong!!')
         const postResult = await PostsCollection.updateOne(
            {
               postOwner: user.userName,
               title: params.title,
            },
            [
               {
                  $set: {
                     blogImages: {
                        $filter: {
                           input: '$blogImages',
                           as: 'blogImage',
                           cond: {
                              $ne: ['$blogImage.publicId', params.publicId],
                           },
                        },
                     },
                  },
               },
            ],
         )
         if (postResult.nModified === 0) throw new Error('Could not finish the job!')
         res.status(200).send({ message: 'image deleted!' })
      } catch (error) {
         res.status(500).send({ error: error.message })
      }
   },
)

//delete all posts only if u r owner of them
router.delete('/profile/posts/deleteAll', auth, async ({ user }, res) => {
   try {
      const posts = await PostsCollection.deleteMany({ postOwner: user.userName })
      if (posts.deletedCount === 0) throw new Error(`you don't have any post to delete!`)
      return res.status(200).send({ message: `${user.name}'s all posts deleted successfully!!` })
   } catch (error) {
      res.status(404).send({ error: error.message })
   }
})
module.exports = router
