import { useState, useEffect } from 'react'
import personService from './services/persons'

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
        <div key={person.name}>{person.name} {person.number} 
        <button onClick={() => props.handlePersonDelete(person.id)}>delete</button></div>
      )))
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

 useEffect(() => {
  personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const handlePersonDelete = (id) => {
    if (window.confirm("Delete " + persons.find(person => person.id === id).name + "?")) {
      personService.remove(id).then(() => {setPersons(persons.filter(person => person.id !== id))})
    }
  }

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

  const existingPerson = persons.find(person => person.name === newName)
  
  if (existingPerson) {
    //alert(`${newName} is already added to phonebook`)
    if (window.confirm(`Update ${newName} phone number?`)) {
    personService
      .update(existingPerson.id, { ...existingPerson, number: newNumber })
      .then((returnedPerson) => {
        setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
        setNewName('')
        setNewNumber('')
      })
  }

    return
  }
  personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
}

const filterPerson = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} 
      newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={filterPerson} handlePersonDelete={handlePersonDelete} />
    </div>
  )
}

export default App