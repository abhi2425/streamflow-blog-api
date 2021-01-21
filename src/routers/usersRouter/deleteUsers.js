const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

router.delete('/user/me', auth, async (req, res) => {
   try {
      const user = await req.user.remove()
      res.status(200).send({ message: `${user.name}'s account deleted permanently!!` })
   } catch (error) {
      res.status(500).send(error.message)
   }
})

module.exports = router
