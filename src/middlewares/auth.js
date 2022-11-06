require('dotenv').config()
const UserCollection = require('../models/usersCollection')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
   try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await UserCollection.findOne({
         _id: decoded._id,
         'tokens.token': token,
      })
      if (!user) throw new Error('User not found!!')
      req.token = token
      req.user = user
      next()
   } catch (error) {
      res.status(401).send({
         error: 'Invalid Authenticate ' + error.message,
      })
   }
}
module.exports = auth
