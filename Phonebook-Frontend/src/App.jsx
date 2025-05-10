
import { useState, useEffect } from "react";
import phoneservices from './service/phone';
import Button from './button';
import style from './components/line.module.css'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}

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
  const [showAll, setShowAll] = useState("");
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
setErrorMessage(`${newName} is already added to phonebook`);
setTimeout(() => { setErrorMessage(null)}, 10000)
      return; 
  }

  if (persons.some(person => person.phonenumber === newPhoneNumber)) {
    setErrorMessage(`${newPhoneNumber} is already added to phonebook`);
    setTimeout(() => { setErrorMessage(null)}, 10000)
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
  /*
  //.then(returnedPerson => {
    console.log('Server response from create:', returnedPerson);
    if (returnedPerson && returnedPerson.id && returnedPerson.name) {
      setPersons(persons.concat(returnedPerson));
      setNewName('');
      setNewPhoneNumber('');
      setErrorMessage(`${returnedPerson.name} was successfully added!`);
      setTimeout(() => { setErrorMessage(null)}, 10000)
    } else {
      console.error('Failed to add person: Invalid response from server.', returnedPerson);
      setErrorMessage('Failed to add person: Invalid response from server.');
      setTimeout(() => { setErrorMessage(null)}, 10000)
    }
  })
  */

  .catch(error => {
    console.log(error.response.data.error)
    setErrorMessage(`Error: ${error.response?.data?.error || 'Unknown error'}`);
  })
  setTimeout(() => {setErrorMessage(null)}, 10000)}

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
          
          <h1 className={style.title}>Phonebook</h1>
          <Notification message = {errorMessage} className={style.error}/>

          <div className={style.filter}>filter shown with: <input
    value = {showAll}
    onChange={e => setShowAll(e.target.value)}
    /></div>

      <h2 className={style.addNew}>Add a new</h2>
      <form className={style.Form} onSubmit={addName}>
        <div className={style.formGroup}>
          name: <input value={newName}         
          onChange={handleNameChange} />
          </div>
          <div className={style.formGroup}>phone: <input value={newPhoneNumber} 
          onChange={handlePhoneNumberChange}
          /></div>
        
        <div>
          
          <button type="submit"  className={style.buttonAdd}>add</button>
        </div>

        </form>
        <h2 className={style.title}>Numbers</h2> 

{filterphonebook.length > 0 ? (
  filterphonebook.map(persons => (
    <div key={persons.id} className={style.personItem}>{persons.name} :
    {persons.phonenumber}  <Button handleDelete= {handleDelete} 
    id={persons.id} /> </div>))
  ) : (
    <div className={style.noPersons}>No persons found</div>
  )
 }

<div className={style.line}></div>
  <Footer />
    </div>
)

}

export default App;