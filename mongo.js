
  





const addPerson = () => {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}

const showPeople = () => {
  console.log('PhoneBook people: ');
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + " " + person.number)
    })
    mongoose.connection.close()
  })
  
}



