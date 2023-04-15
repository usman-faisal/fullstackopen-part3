const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.static("dist"))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

morgan.token("body",function(req,res) {
    return JSON.stringify(req.body);
})

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/",(req,res) => {
    res.send("<h1>Phonebook</h1>")
})

app.get("/info",(req,res) => {
    res.send(
        `<h2>Phone book has info of ${persons.length} people</h2>
              <p>${new Date()}</p>
`
    )
})

app.get("/api/persons",function(req,res){
    res.json(persons);
})

app.get("/api/persons/:id",(req,res) => {
    const {id} = req.params;

    const person =
        persons.find(person => person.id === Number.parseInt(id));
    if(!person) return res.status(404).send("no person found").end();
    res.json(person);
})

app.delete("/api/persons/:id",(req,res) => {
    const {id} = req.params;
    persons = persons.filter(person => person.id !== Number.parseInt(id));
    res.status(204).end();
})

const generateId = () => {
    const randomNumber = Math.floor(Math.random()*10000)
    return randomNumber;
}


app.post("/api/persons",(req,res) => {
    const {name,number} = req.body;
    if(!name) return res.status(400).json({error: "missing name"})
    if(!number) return res.status(400).json({error: "missing number"})
    if(persons.some(person => person.name === name)){
        return res.status(409).json({error: "name must be unique"})
    }
    const newPerson = {
        name,
        number,
        id: generateId(),
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
})
const unknownPath = (req,res) => {
    res.status(404).send("<h1>Not found</h1>")
}
app.use(unknownPath);
const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
    console.log("app listening on ",PORT)
})

