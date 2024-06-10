import React, { useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { DataContext } from '../../Datos/DataContext'

export default function VerifyCode (props) {
  const [codigo, setCodigo] = useState('')
  const navigate = useNavigate()
  const { usuario } = useContext(DataContext)
  const verificarCodigo = (event) => {
    event.preventDefault()
    // Aquí puedes enviar el código de verificación al backend para su validación
    const data = {
      run: usuario.run,
      nombre_completo: usuario.nombre_completo,
      codigo,
      email: usuario.email,
      password: usuario.password
    }
    axiosInstance.post('/create/', data)
      .then((response) => {
        if (response.status === 201) {
          // Si el código es válido, redirige a la página deseada
          navigate('/')
        } else {
          // Manejar el caso en el que el código no sea válido
          console.log('Código inválido')
        }
      })
      .catch((error) => {
        // Manejar errores de la solicitud
        console.error('Error al verificar el código:', error)
      })
  }

  return (
    <div className='Auth-form-container'>
      <form className='Auth-form' onSubmit={verificarCodigo}>
        <div className='Auth-form-content'>
          <h3 className='Auth-form-title'>Verificar Código</h3>
          <div className='form-group mt-3'>
            <label>Código de 6 dígitos</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className='form-control mt-1'
              placeholder='Código de verificación'
              maxLength={6}
            />
          </div>
          <div className='d-grid gap-2 mt-3'>
            <button type='submit' className='btn btn-primary'>
              Verificar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
