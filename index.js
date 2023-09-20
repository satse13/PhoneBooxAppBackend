const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

var morgan = require('morgan')

app.use(cors())
app.use(express.static('dist'))

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


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/people', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/people/:id', (req,res,next) => {
    Person.findById(req.params.id)
    .then(person => {
        person
         ? res.json(person)
         : res.status(404).end()
    })
    .catch(error => next(error))
    
})

app.get('/info', (req,res) => {
    res.send(`<h1>Phonebook has info for ${4} people</h1>
    <p>${new Date()}</p>`)
})

app.post('/api/people',(req,res) => {

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
    
    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })
    console.log({newPerson}) // comentario prueba

    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.delete('/api/people/:id',(req,res,next) => {

    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
 
})

app.use((request,response)=> {
    response.status(404).end()
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})