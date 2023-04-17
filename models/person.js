const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log("error connecting to mongodb", err));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^\d{2}\d?-\d{5,}$/.test(v);
      },
    },
  },
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = new mongoose.model("Person", personSchema);
