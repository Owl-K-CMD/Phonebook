
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
app.use(requestLogger)
app.use(express.static('dist'))
app.use(express.static(path.join(__dirname, 'dist')))



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  console.log('Attempting to fetch app persons')
  Person.find({})
  .then(persons => {
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
      response.status(404).send({error:'Person not found'})
    }
  })
  .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
  console.log('This is work');
Person.countDocuments({})
.then(count => {
const getCurrentDateTime  = ()  => new Date();
  response.send(`Phonebook has info for ${count} people </br> ${getCurrentDateTime()}`);
  })
.catch(error => next(error));
})



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

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  
  if (!body.name || !body.phonenumber) {
    return response.status(400).json({ 
      error: 'All the name and phonenumber are required' 
    })
  }

  Person.findOne({name: body.name})
  .then(existingPerson => {
   if (existingPerson) {
    existingPerson.phonenumber = body.phonenumber
    existingPerson.save()
    .then(updatedPerson => {
      console.log(updatedPerson)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
   } else {
       const person = new Person({
      name: body.name,
      phonenumber: body.phonenumber
    })

    person.save()
    .then(savedPerson => {
      console.log(`Added new person: ${savedPerson.name}`)
      response.json(savedPerson)
    })
    .catch(error => next(error))
   }
  })
  .catch(error => {
    if (error.name === 'ValidationError') {
      response.status(400).json({ error: error.message });
    } else {
      console.error('Unexpected error:', error);
      response.status(500).json({ error: 'Server error' });
    }
  });
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, phonenumber } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.phonenumber = phonenumber

      return person.save().then((updatedperson) => {
        response.json(updatedperson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
