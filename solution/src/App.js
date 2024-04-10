import './App.css'
import React, { useState } from 'react'
import Form from './Components/Form'
import Table from './Components/Table'

function App() {
  const [data, setData] = useState([])
  return (
    <div className="App">
      <div className="form-table-container">
        <Form data={data} setData={setData} />
        <Table data={data} />
      </div>
    </div>
  )
}

export default App
