

require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(express.static('dist'))

app.use(express.json())



const person = [ ]



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons',(request, response, next) => {
  Person.find({ }).then(person => {
    response.json(person)
  })
})
  

app.get('/api/info', (request, response) => {
  console.log('This is work');
  const persons = person.length;
const getCurrentDateTime = () => new Date()
  response.send(`Phonebook has info for ${persons} 
    people </br> ${getCurrentDateTime()}`)  
})

app.get('/api/persons/:id', (request, response) => {
Person.findById(request.params.id).then(person => {
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const initialLenght = person.length
  const newPersons = person.filter(person => person.id !== id);
  const finalLenght = newPersons.length
  if(initialLenght === finalLenght)
  {
    response.status(404).end()
  } else{
    person.length = 0
    person.push(...newPersons)
    
    response.status(204).end()
  }
})

app.post('/api/persons', (request,response) => {
  const body = request.body


const id = Math.random()
  if(!body.name)
    return response.status(400).json({
      error: 'name missing'
    })

    if(!body.number)
    return response.status(400).json({
      error: 'number missing'
})
  

  
  const newPerson = {
    id: id,
    name: body.name,
    number: body.number
  }
   const nameExistence = person.some(person => person.name === newPerson.name)
  if(nameExistence)
  {
    return response.status(400).json({
      error: 'name must be unique'
    })}
   const numberExistence = person.some(person => person.number === newPerson.number)
   
    if(numberExistence)
    {
      return response.status(400).json({
        error: 'number must be unique'
      })}

  person.push(newPerson)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
