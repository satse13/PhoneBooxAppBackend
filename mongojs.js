const mongoose = require('mongoose')

if (process.argv.length<5) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url =
  `mongodb+srv://aletob:${password}@cluster0.gltfean.mongodb.net/?retryWrites=true&w=majority&appName=PhoneBooxApp`

  
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})