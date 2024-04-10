import React, { useEffect, useState, useCallback } from 'react'
import { getLocations, isNameValid } from '../mock-api/apis'
import { debounce } from 'lodash'

export default ({ data, setData }) => {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [locations, setLocations] = useState([])
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    getLocations().then((locations) => {
      setLocations(locations)
      setLocation(locations[0])
    })
  }, [])

  const validateName = useCallback(
    debounce(async (newName) => {
      const isValid = await isNameValid(newName)
      setNameError(isValid ? '' : 'This name is invalid.')
    }, 500),
    []
  )

  useEffect(() => {
    if (name.trim() !== '') {
      validateName(name)
    }
  }, [name, validateName])

  const onSubmit = async (event) => {
    event.preventDefault()
    if (nameError || name.trim() === '') {
      return
    }
    const isValid = await isNameValid(name)
    if (isValid) {
      const newData = { name, location }
      setData((data) => [...data, newData])
      setName('')
      setLocation(locations[0])
    } else {
      setNameError('This name has already been taken.')
    }
  }

  const handleClear = () => {
    setData([])
    setLocation(locations[0] || '')
    setName('')
    setNameError('')
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={handleNameChange}
            className={`form-control ${nameError ? 'is-invalid' : ''}`}
          />
          {nameError && <div className="invalid-feedback">{nameError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="location">
            Location
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-group button-group">
          <button onClick={handleClear} className="btn btn-clear">
            Clear
          </button>
          <button
            type="submit"
            className="btn btn-add"
            disabled={nameError || !name || !location}
          >
            Add
          </button>
        </div>
      </form>
    </div>
  )
}
