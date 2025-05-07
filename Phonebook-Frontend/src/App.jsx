
import { useState, useEffect } from "react";
import phoneservices from './service/phone';
import Button from './button';



const Notification = ({message}) => {
  if (message === null) {
    return null;
  }
  return (< div className = "error">
    {message}
  </div> 
)
}

const App = () => {  
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [showAll, setShowAll] = useState(" ");
  const [errorMessage, setErrorMessage] = useState(null);
  
  
  useEffect(() => {
    phoneservices.getAll()
      .then(initialPersons => {
        console.log('Data received from getAll:', initialPersons);

        if (Array.isArray(initialPersons)) {
          setPersons(initialPersons);
          console.log('Persons state succesfully');
           } else {
            console.error("Error: Data received from server is not array!", initialPersons)
           
        setPersons([])
        alert("Could not load phonebok data correctly.")
           }
      })

      .catch(error => {
       console.error("Error fetching data:", error);
      //alert("Error fetching data. Please try again later.");
      })
    }, []);
    

const handleNameChange = (e) =>  {  
  setNewName(e.target.value);
};
const handlePhoneNumberChange = (e) => {
  setNewPhoneNumber(e.target.value);
};


const addName = (e) => {
  e.preventDefault();
    if (persons.some(person => person.name === newName)) {
alert(`${newName} is already added to phonebook`);

      return; 
  }

  if (persons.some(person => person.phonenumber === newPhoneNumber)) {
    alert(`${newPhoneNumber} is already added to phonebook`);
        return;    
  }

  const nameObject = {
    name: newName,
    phonenumber: newPhoneNumber
  }

  phoneservices
  .create(nameObject)
  .then(response => {
    setPersons(persons.concat(response));
    setNewName('');
     setNewPhoneNumber('')
    
  }) 

  .catch(error => {
    console.log(error.response.data.error)
    setErrorMessage(`Error: ${error.response?.data?.error || 'Unknown error'}`);
  })
  setTimeout(() => {
    setErrorMessage(null)
  }, 10000)

}

const filterphonebook = persons.filter(person => person.name.toLowerCase().includes(showAll.toLowerCase()));

const handleDelete = (id) => {
  const person = persons.find(p => p.id === id);
  if (!person) {
    console.error(`Person with ID ${id} not found.`);
    return;
  }
  const confirmDelete = window.confirm(`Delete ${person.name}?`);
  if (confirmDelete) {
    phoneservices
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id));
        
      })
    
    
      .catch(error => {
        console.error("Error deleting person:", error);
        setErrorMessage(
          `Information of ${person.name} has already been removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
        setPersons(persons.filter(n => n.id !== id))
      })
  }
  }

return (
    <div>
          
          <h2>Phonebook</h2>
          <Notification message = {errorMessage} />

          <div>filter shown with: <input
    value = {showAll}
    onChange={e => setShowAll(e.target.value)}
    /></div>

      <h2 >Add a new</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName}         
          onChange={handleNameChange} />
          </div>
          <div>phone: <input value={newPhoneNumber} 
          onChange={handlePhoneNumberChange}
          /></div>
        
        <div>
          
          <button type="submit" >add</button>
        </div>

        </form>
        <h2>Numbers</h2> 

{filterphonebook.length > 0 ? (
  filterphonebook.map(persons => (
    <div key={persons.id}>{persons.name} :
    {persons.phonenumber}  <Button handleDelete= {handleDelete} 
    id={persons.id} /> </div>))
  ) : (
    <div>No persons found</div>
  )
 }
    </div>
)

}

export default App;