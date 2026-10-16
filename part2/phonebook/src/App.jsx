import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (props) => {
  return (
    <div>
      Filter <input value={props.filter} onChange={props.handleFilterChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (<form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange} />
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>)
}

const Persons = (props) => {
  return (props.persons.map((person) => (
        <div key={person.name}>{person.name} {person.number}</div>
      )))
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
     axios
       .get('http://localhost:3001/persons')
       .then(response => {
         setPersons(response.data)
       })
   }, [])

  const handleNameChange = (event) => {
  setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
  setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
  setFilter(event.target.value)
}

  const addPerson = (event) => {
  event.preventDefault()
  const personObject = {
    name: newName,
    number: newNumber,
  }
  if (persons.some(person => person.name === newName)) {
    alert(`${newName} is already added to phonebook`)
    return
  }
  setPersons(persons.concat(personObject))
  setNewName('')
  setNewNumber('')
 }
const filterPerson = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <div>debug: {newName}</div>
      <h2>Numbers</h2>
      <Persons persons={filterPerson} />
    </div>
  )
}

export default App