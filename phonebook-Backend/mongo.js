const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('use password as argument')
process.exit(1);
}

var password = process.argv[2];


const url =  `mongodb+srv://kumutimam:${password}@cluster0.eckuzim.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name : String,
  phonenumber : String,
})

const Person = mongoose.model('Person', personSchema)




Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})
