const express = require('express')
const cors = require('cors')
const app = express()
var morgan = require('morgan')

app.use(cors())

app.use(express.json());

app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
}))

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

app.use((request,response)=> {
    response.status(404).end()
})
const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
    return maxId + 1
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})