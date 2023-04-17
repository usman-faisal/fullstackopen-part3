const mongoose = require("mongoose");
require("dotenv").config();
if (process.argv.length < 3) {
  console.log("please provide password");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://usman:${password}@cluster0.hkd7kos.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = new mongoose.model("Person", personSchema);

if (!name && !number) {
  Person.find({}).then((res) => {
    res.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name,
    number,
  });

  person.save().then((res) => {
    console.log("person Saved");
    mongoose.connection.close();
  });
}
