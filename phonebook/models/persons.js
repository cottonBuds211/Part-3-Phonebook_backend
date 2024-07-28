require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose.set("strictQuery", false);

mongoose
	.connect(url)
	.then((result) => console.log("connected to mongoDB"))
	.catch((error) =>
		console.log("error connecting to database", error.message)
	);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject._v;
	},
});

module.exports = mongoose.model("Person", personSchema);
