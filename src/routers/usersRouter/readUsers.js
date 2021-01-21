const express = require('express')
const router = express.Router()
const UsersCollection = require('../../models/usersCollection')

router.get('/users', async (_, res) => {
   try {
      const users = await UsersCollection.find({})
      res.status(200).send(users)
   } catch (error) {
      res.status(500).send(error.message)
   }
})

router.get('/user/:userName', async ({ params }, res) => {
   try {
      const user = await UsersCollection.findOne({ userName: params.userName })
      //const user = await UsersCollection.aggregate([{ $match: { userName: params.userName } }])

      //aggregate--> return array of docs which u have to manually filter password,tokens and rest off stuff u don't wanna send
      return res.status(200).send(user)
   } catch (error) {
      res.status(500).send(error.message)
   }
})

const getUserByFilter = async (filter, userName) => {
   if (filter === 'password') throw new Error(`Error-: Don't try to be smart😁`)
   if (filter === 'tokens') throw new Error(`Error-: Don't try to be smart😁`)
   if (filter === 'followers') {
      const user = await UsersCollection.aggregate([
         { $match: { userName } },
         { $project: { data: `$${filter}`, followersCount: { $size: `$${filter}` }, _id: 1 } },
      ])
      return user
   }
   const user = await UsersCollection.aggregate([
      { $match: { userName } },
      {
         $project: {
            data: `$${filter}`,
            _id: 0,
            // totalCount: {
            //    $cond: { if: { $isArray: `$${filter}` }, then: { $size: `$${filter}` }, else: 0 },
            // },
         },
      },
   ])
   if (Object.keys(user[0]).length === 0) throw new Error('incorrect query!!')
   return user
}

router.get('/user/:userName/:filter', async ({ params }, res) => {
   try {
      const user = await getUserByFilter(params.filter, params.userName)
      return res.status(200).send(...user)
   } catch (error) {
      res.status(400).send(error.message)
   }
})
module.exports = router
