const mongoose = require('mongoose')

const commentsSchema = mongoose.Schema({
	_id: false,
	owner: {
		type: String,
		required: true,
	},
	description: String,
	upVote: [String],
	ownerAvatar: String,
	downVote: [String],
	date: {
		type: Date,
		default: Date.now(),
	},
})
module.exports = commentsSchema
