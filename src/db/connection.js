require('dotenv').config()
const mongoose = require('mongoose')
mongoose
   .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
   })
   .then(() => console.log('Connected To Database!!'))
   .catch((error) => console.log(error.message))
