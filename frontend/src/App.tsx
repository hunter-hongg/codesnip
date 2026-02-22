import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [status, setStatus] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8081/api/health')
      .then(res => setStatus(res.data.status))
      .catch(_err => setStatus(`${_err}`))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">CodeSnip</h1>
      <p>Backend: {status}</p>
    </div>
  )
}

export default App