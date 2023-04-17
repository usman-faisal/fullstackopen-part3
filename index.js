const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.get("/", (req, res) => {
  res.send("<h1>Phonebook</h1>");
});

app.get("/info", (req, res) => {
  res.send(
    `<h2>Phone book has info of ${Person.length} people</h2>
                <p>${new Date()}</p>
  `
  );
});

app.get("/api/persons", function (req, res) {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Person.findById(id)
    .then((person) => {
      if (!person) return res.status(404);
      res.json(person);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;
  const newPerson = {
    name,
    number,
  };
  Person.findByIdAndUpdate(id, newPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((person) => {
      if (!person) return res.status(404).end();
      res.send(person);
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  const person = new Person({
    name,
    number,
  });
  person
    .save()
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
});

const unknownPath = (req, res) => {
  res.status(404).json("<h1>Not found</h1>");
};
app.use(unknownPath);

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("app listening on ", PORT);
});
