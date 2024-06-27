// components/PasswordReset.js
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

function PasswordReset () {
  const { uid, token } = useParams()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    try {
      const response = await axiosInstance.post(`/reset/${uid}/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword
      },
      { headers: { 'Content-Type': 'application/json' } }
      )
      setMessage(response.data.message)
      if (response.status === 200) {
        navigate('/')
      }
    } catch (error) {
      setMessage(error.response.data.error)
    }
  }

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default PasswordReset
