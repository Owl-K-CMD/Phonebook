const mongoose = require('mongoose')

mongoose.set( 'strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

//const personSchema = new mongoose.Schema({
  //name: String,
  //phonenumber: String,
//})

const personSchema = new mongoose.Schema({
  name : {
    type: String,
    minLength: [3, 'Person validation fail: name {VALUE} is shorter that minimum length (3)'],
    required: [true, 'name is required']
  },
  phonenumber : {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    minLength: [8, 'Person validation fail: phonenumber {VALUE} is shorter that minimum length (8)'],
    required: [true, 'phonenumber is required']
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)