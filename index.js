const express = require('express')
const app = express()
app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(!person)
        res.status(404).end()
    else
        res.json(person)
})

app.get('/info', (req,res) => {
    res.send(`<h1>Phonebook has info for ${persons.length} people</h1>
    <p>${new Date()}</p>`)
})

app.post('/api/persons',(req,res) => {

    const body = req.body

    if(!body.name) {
        return res.status(400).json({
            error:'Nombre faltante en la solicitud'
        });
    }
    if(!body.number){
        return res.status(400).json({
            error:'Numero faltante en la solicitud'
        });
    }
    
    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    console.log({newPerson})

    persons = persons.concat(newPerson)

    res.json(newPerson)
})

app.delete('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    
    res.status(204).end()
})


const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
    return maxId + 1
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})