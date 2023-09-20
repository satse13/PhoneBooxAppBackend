const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    else if(error.name === 'ValidationError'){
        return response.status(400).send({error: error.message})
    }
    
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json());
app.use(requestLogger)
app.use(express.static('dist'))

app.get('/api/people/info', (req,res) => {
    Person.countDocuments({}).then(count => {
        res.send({peopleAmount: count})
    })
})

app.get('/api/people', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.post('/api/people',(req,res,next) => {

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

    newPerson.save()
    .then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))
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


app.delete('/api/people/:id',(req,res,next) => {

    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
 
})

app.put('/api/people/:id', (req,res,next) => {

    const {name,number} = req.body

    Person.findByIdAndUpdate(req.params.id, {name,number}, {new:true, runValidators: true, context: 'query'})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))

})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})