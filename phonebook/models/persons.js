require('dotenv').config()
const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.set('strictQuery', false)

mongoose
	.connect(url)
	.then(() => console.log('connected to mongoDB'))
	.catch(error => console.log('error connecting to database', error.message))

const personSchema = new mongoose.Schema({
	name: { type: String, minLength: 3, required: true },
	number: {
		type: String,
		validate: {
			validator: v => {
				return /^\d{2,3}-\d+$/.test(v)
			},
			message: props => `${props.value} not a valid number`,
		},

		required: true,
	},
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject._v
	},
})

module.exports = mongoose.model('Person', personSchema)
