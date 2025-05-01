

require('dotenv').config();
const Person = require('./module/person');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())

app.use(express.static('dist'))
app.use(requestLogger)
//app.use('dist')

const persons = [];



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/person',(request, response, next) => {
  console.log('Attempting to fetch app persons')
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
  })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).send({error:'Person not foud'})
    }
  })
  .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
  console.log('This is work')
Person.countDocument({}).then(count => {
const getCurrentDateTime  = () => new Date()
  response.send(`Phonebook has info for ${count} 
    people </br> ${getCurrentDateTime()}`)
  })
.catch(error => next(error))
} )



app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).end({error: 'Person not found'});
      }
    })
    .catch(error => next(error));
})
/*
app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
   }
    if (!body.phonenumber) {
    return response.status(400).json({
      error: 'phonenumber missing'
})
}  

 
Person.findOne({$or: [{ name: body.name }, { phonenumber: body.phonenumber}] })
.then(existingPerson => {
  if (existingPerson) {
    if(existingPerson.name ===body.name) {
      return response.status(400).json({error: 'name must be unique'})
    } else {
      return response.status(400).json({error: 'phonenumber must be unique'})
    }
  }
  const person = new Person({
    name: body.name,
    phonenumber: body.phonenumber
})
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})
.catch(error => next(error))
})
*/
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  
  if (!body.name || !body.phonenumber) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const person = new Person({
    name: body.name,
    phonenumber: body.phonenumber
  })



  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})


  
/*
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
