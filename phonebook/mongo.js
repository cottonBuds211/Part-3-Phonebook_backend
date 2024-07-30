const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("add parameters");
	process.exit(1);
}

const name = process.argv[3];
const number = process.argv[4];
const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.yxn3u0t.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
	const person = new Person({
		name: name,
		number: number,
	});
	person.save().then((result) => {
		console.log("person saved");
		mongoose.connection.close();
	});
} else {
	Person.find({}).then((result) => {
		result.forEach((p) => console.log(p));
		mongoose.connection.close();
	});
}
