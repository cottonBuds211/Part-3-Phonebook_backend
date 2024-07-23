const express = require("express");
const app = express();
const morgan = require("morgan");
let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
	{
		id: "5",
		name: "Jimmy Poppendieck",
		number: "39-23-6423124",
	},
];

const generateId = () => {
	const id = Math.floor(Math.random() * 2000);
	return String(id);
};

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(
	morgan(":method :status :res[content-length] - :response-time ms :body")
);

app.get("/", (request, response) => {
	response.send("<h1>hello there</h1>");
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});
app.get("/info", (request, response) => {
	const date = new Date();
	const info = `<p>Phone book has info for ${persons.length} people <br /> ${date} </p>`;

	response.send(info).end();
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const person = persons.find((person) => person.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id !== id);
	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const body = request.body;
	const duplicate = persons.find((p) => p.name === body.name);
	if (duplicate) {
		response.status(400).json({ error: "must be unique" });
	} else if (!body.name || !body.number) {
		response.status(400).json({ error: "name or number missing" });
	} else {
		const person = {
			name: body.name,
			number: body.number,
			id: generateId(),
		};

		persons = persons.concat(person);
		response.json(person);
	}
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
