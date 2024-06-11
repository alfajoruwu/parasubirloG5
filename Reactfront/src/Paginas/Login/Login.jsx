import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { NavLink, useNavigate } from 'react-router-dom'

import './Login.css'
import axiosInstance from '../../utils/axiosInstance'
import authService from '../../utils/authService'
import { useContext } from 'react'
import { DataContext } from '../../Datos/DataContext'
import VerifyCode from './VerifyCode'

export default function (props) {
  const {usuario,setUsuariofinal} = useContext(DataContext)
  const [authMode, setAuthMode] = useState('signin')
  const [run, setUsuario] = useState('')
  const [password, setContraseña] = useState('')
  const [email, setEmail] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const navigate = useNavigate()
  const changeAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  const logearUsuario = async (event) => {
    event.preventDefault()
    try {
      await authService.login(run, password)
      mandarAVista()
    } catch (error) {
      console.log(error)
    }
  }

  const mandarAVista = () => {
    axiosInstance.get('/TipoUsuario/').then((response) => {
      console.log(response.data.tipo)
      if (response.data.tipo === 'Profesor') {
        navigate('/PublicarAyudantias')
      } else if (response.data.tipo === 'Coordinador') {
        navigate('/HorasAsignadas')
      } else {
        navigate('/OfertasAyudantias')
      }
    })
  }

  const crearUsuario = (event) => {
    event.preventDefault()
    const data = {
      run,
      email,
      password,
      nombre_completo: nombreCompleto
    }
    setUsuariofinal(data)
    setAuthMode('verificar')

    axiosInstance.post('correo_enviar/', {"destinatario":email}).then((response) => {
      if (response.status === 201) {
        setEmail('')
        setNombreCompleto('')
        changeAuthMode()
      }
    }

    )
  }

  if (authMode === 'signin') {
    return (
      <div className='Auth-form-container'>
        <form className='Auth-form' onSubmit={logearUsuario}>
          <div className='Auth-form-content'>
            <h3 className='Auth-form-title'>Utalca ayudantias</h3>
            <div className='text-center'>
              No tienes cuenta?{' '}
              <span className='link-primary' onClick={changeAuthMode}>
                Registrase
              </span>
            </div>
            <div className='form-group mt-3'>
              <label>Usuario</label>
              <input
                className='form-control mt-1'
                placeholder='Usuario'
                value={run}
                onChange={(e) => { setUsuario(e.target.value) }}
              />
            </div>
            <div className='form-group mt-3'>
              <label>Contraseña</label>
              <input
                type='password'
                className='form-control mt-1'
                value={password}
                placeholder='Contraseña'
                onChange={(e) => { setContraseña(e.target.value) }}
              />
            </div>
            <div className='d-grid gap-2 mt-3'>
              <button type='submit' className='btn btn-primary'>
                Ingresar
              </button>
            </div>
            <p className='text-center mt-2'>
              Olvidaste tu contraseña? <a href='#'>Que pena</a>
            </p>
          </div>


        </form>
      </div>

    )
  }

  if (authMode === 'verificar'){
    return (<VerifyCode />)
  }

  return (
    <div className='Auth-form-container'>
      <form className='Auth-form' onSubmit={crearUsuario}>
        <div className='Auth-form-content'>
          <h3 className='Auth-form-title'>Utalca ayudantias</h3>
          <div className='text-center'>
            Ya tienes cuenta?{' '}
            <span className='link-primary' onClick={changeAuthMode}>
              Iniciar secion
            </span>
          </div>
          <div className='form-group mt-3'>
            <label>Usuario</label>
            <input
              value={run}
              onChange={(e) => { setUsuario(e.target.value) }}
              className='form-control mt-1'
              placeholder='Usuario'
            />
          </div>
          <div className='form-group mt-3'>
            <label>Nombre completo</label>
            <input
              className='form-control mt-1'
              placeholder='Nombre completo'
              value={nombreCompleto}
              onChange={(e) => { setNombreCompleto(e.target.value) }}
            />
          </div>
          <div className='form-group mt-3'>
            <label>Correo electronico</label>
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              type='email'
              className='form-control mt-1'
              placeholder='Correo electronico'
            />
          </div>
          <div className='form-group mt-3'>
            <label>Contraseña</label>
            <input
              value={password}
              onChange={(e) => { setContraseña(e.target.value) }}
              type='password'
              className='form-control mt-1'
              placeholder='Contraseña'
            />
          </div>
          <div className='d-grid gap-2 mt-3'>
            <button type='submit' className='btn btn-primary'>
              Crear
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
