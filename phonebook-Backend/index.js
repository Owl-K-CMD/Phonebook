
//const http = require('http')
const express = require('express')
const app = express()
app.use(express.json())


const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "7675782910"
  }
]

const person = persons.length;
const getCurrentDateTime = () => new Date()

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/person',(request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  console.log('This is work')
  response.send(`Phonebook has info for ${person} 
    people </br> ${getCurrentDateTime()}`)  
})

app.get('/api/persons/:id', (request, response) => {
const id = request.params.id
const person2 =persons.find(person => person.id ===id)

if (person2) {
  response.json(person2)
}
else 
{
  response.status(404).end()
}
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const initialLenght = persons.length
  const newPersons = persons.filter(person => person.id !== id);
  const finalLenght = newPersons.length
  if(initialLenght === finalLenght)
  {
    response.status(404).end()
  } else{
    persons.length = 0
    persons.push(...newPersons)
    
    response.status(204).end()
  }
})

app.post('/api/persons', (request,response) => {
  const body = request.body

/*  const maxId = persons.length > 0
  ?Math.random(...persons.map(n => Number(n.id))) 
  : 0
  const id = (maxId + 1).toString()
*/
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
   const nameExistence = persons.some(person => person.name === newPerson.name)
  if(nameExistence)
  {
    return response.status(400).json({
      error: 'name must be unique'
    })}
   const numberExistence = persons.some(person => person.number === newPerson.number)
   
    if(numberExistence)
    {
      return response.status(400).json({
        error: 'number must be unique'
      })}

  persons.push(newPerson)
  response.json(newPerson)
})

const PORT = 3000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)