import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState(null)
  const handleClick = async () => {
      const response = await fetch('http://localhost:3000/api/hello')
      const data = await response.json()
      setMessage(data.message)
  }
  return (
    <>
      <button onClick={handleClick}>GET: /api/hello</button>
      {message && <p>{message}</p>}
    </>
  )
}

export default App
