// components/PasswordResetRequest.js
import { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'

function PasswordResetRequest () {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axiosInstance.post('/password_reset/', {
        email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setMessage(response.data.message)
    } catch (error) {
      setMessage(error.response.data.error)
    }
  }

  return (
    <div>
      <h2>Password Reset Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Send Password Reset Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default PasswordResetRequest
