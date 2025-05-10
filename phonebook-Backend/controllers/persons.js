const personsRouter = require('express').Router()
const Person = require('../module/person')

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id) 
  .then(person =>{
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
  const body =  request.body

  const person = new Person ({
    name : body.name,
    phonenumber : body.phonenumber
  })
person.save().then(savedPerson => {
  response.json(savedPerson)
})
.catch(error => next(error))
})

personsRouter.delete(':id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  then(() => {
    response.status(204).end()
  })
  .catch(error => next(error))
})
personsRouter.put('/:id', (request, response,next) => {
  const {name, phonenumber} = request.body

  Person.findById(request.params.id).then(person => {
    if (!person) {
      return response.status(404).end()
    }
    person.name = name
    person.phonenumber = phonenumber

    return person.save().then(updatedperson => {
      response.json(updatedPerson)
    })
})
.catch(error => next(error))
})

module.exports = personsRouter