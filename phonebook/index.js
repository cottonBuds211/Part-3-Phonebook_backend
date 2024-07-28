require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/persons");
// let persons = [
// 	{
// 		id: "1",
// 		name: "Arto Hellas",
// 		number: "040-123456",
// 	},
// 	{
// 		id: "2",
// 		name: "Ada Lovelace",
// 		number: "39-44-5323523",
// 	},
// 	{
// 		id: "3",
// 		name: "Dan Abramov",
// 		number: "12-43-234345",
// 	},
// 	{
// 		id: "4",
// 		name: "Mary Poppendieck",
// 		number: "39-23-6423122",
// 	},
// 	{
// 		id: "5",
// 		name: "Jimmy Poppendieck",
// 		number: "39-23-6423124",
// 	},
// ];

const generateId = () => {
	const id = Math.floor(Math.random() * 2000);
	return String(id);
};

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(express.static("dist"));
app.use(
	morgan(":method :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

app.get("/", (req, res) => {
	res.send("<h1>hello there</h1>");
});

app.get("/api/persons", (req, res) => {
	Person.find({}).then((persons) => {
		res.json(persons);
		console.log(persons);
	});
});
app.get("/info", (req, res) => {
	const date = new Date();
	const persons = Person.find({}).then((result) => result);
	const info = `<p>Phone book has info for ${persons.length} people <br /> ${date} </p>`;

	res.send(info).end();
});

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then((result) => res.json(result))
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then((result) => res.status(204).end())
		.catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
	const body = req.body;

	if (!body.name || !body.number) {
		res.status(400).json({ error: "name or number missing" });
	} else {
		const person = new Person({
			name: body.name,
			number: body.number,
		});

		person
			.save()
			.then((result) => console.log(`${body.name} saved to database`))
			.catch((error) => next(error));
		res.json(person);
	}
});

const errorHandler = (error, req, res, next) => {
	console.error(error.name);
	if (error.name === "CastError") {
		res.status(400).json({ error: "malformatted id" });
	}
	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
