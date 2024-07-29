require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')

// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(express.static('dist'))
app.use(
	morgan(':method :status :res[content-length] - :response-time ms :body')
)
app.use(cors())

app.get('/', (req, res) => {
	res.send('<h1>hello there</h1>')
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})
app.get('/info', (req, res) => {
	const date = new Date()
	Person.find({}).then(result => {
		res.send(
			`<p>Phone book has info for ${result.length} people <br /> ${date} </p>`
		)
	})
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(result => res.json(result))
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then(result => res.status(204).json(result).end())
		.catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person
		.save()
		.then(result => res.json(result))
		.catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const { name, number } = req.body
	Person.findByIdAndUpdate(
		req.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then(updatedPerson => res.json(updatedPerson))
		.catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
	console.error(error.name)
	if (error.name === 'CastError') {
		return res.status(400).json({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		console.log(error.message)
		return res.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
