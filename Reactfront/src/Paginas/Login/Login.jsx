import React, { useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useNavigate } from 'react-router-dom'
import NavbarLogin from '../../Componentes/navbar/NavbarLogin'
import './Login.css'
import axiosInstance from '../../utils/axiosInstance'
import authService from '../../utils/authService'
import { DataContext } from '../../Datos/DataContext'
import VerifyCode from './VerifyCode'

export default function Login (props) {
  const { setUsuariofinal } = useContext(DataContext)
  const [authMode, setAuthMode] = useState('signin')
  const [run, setUsuario] = useState('')
  const [password, setContraseña] = useState('')
  const [email, setEmail] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const changeAuthMode = () => {
    setAuthMode((authMode === 'signin' ? 'signup' : 'signin'))
    setErrorMessage('')
  }

  const logearUsuario = async (event) => {
    event.preventDefault()
    try {
      if (!run) {
        setErrorMessage('El nombre de usuario es requerido.')
        return
      }
      if (!password) {
        setErrorMessage('La contraseña es requerida.')
        return
      }

      await authService.login(run, password)
      setErrorMessage('')
      mandarAVista()
    } catch (error) {
      setErrorMessage('Nombre de usuario o contraseña incorrecta. Inténtalo de nuevo.')
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

    if (!email.endsWith('@utalca.cl') && !email.endsWith('@alumnos.utalca.cl')) {
      setErrorMessage('El correo electrónico debe ser de dominio @utalca.cl o @alumnos.utalca.cl')
      return
    }

    const data = {
      run,
      email,
      password,
      nombre_completo: nombreCompleto
    }

    setUsuariofinal(data)
    setAuthMode('verificar')

    axiosInstance.post('correo_enviar/', { destinatario: email }).then((response) => {
      if (response.status === 201) {
        setEmail('')
        setNombreCompleto('')
        changeAuthMode()
      }
    }).catch((error) => {
      console.error('Error al enviar correo:', error)
      setErrorMessage('Error al enviar correo electrónico.')
    })
  }

  const formatearRun = (run) => {
    let runFormateado = run.replace(/[^0-9kK]/g, '')
    if (runFormateado.length > 9) {
      runFormateado = runFormateado.slice(0, -1)
      return
    }
    if (runFormateado.length > 1) {
      runFormateado = runFormateado.slice(0, -1) + '-' + runFormateado.slice(-1)
    }
    if (runFormateado.length > 6) {
      runFormateado = runFormateado.slice(0, -5) + '.' + runFormateado.slice(-5)
    }
    if (runFormateado.length > 9) {
      runFormateado = runFormateado.slice(0, -9) + '.' + runFormateado.slice(-9)
    }
    setUsuario(runFormateado)
  }

  const volver = () => {
    setAuthMode('signin')
  }

  return (
    <div className='login-page'>
      <NavbarLogin />
      <div className='Auth-form-container'>
        {authMode === 'signin'
          ? (
            <form className='Auth-form' onSubmit={logearUsuario}>
              <div className='Auth-form-content'>
                <h3 className='Auth-form-title'>Utalca ayudantias</h3>
                <div className='text-center'>
                  No tienes cuenta?{' '}
                  <span className='link-custom' onClick={() => changeAuthMode()}>
                    Registrarse
                  </span>
                </div>
                {errorMessage && (
                  <div className='alert alert-danger' role='alert'>
                    {errorMessage}
                  </div>
                )}
                <div className='form-group mt-3'>
                  <label>RUN</label>
                  <input
                    className='form-control mt-1'
                    placeholder='RUN'
                    value={run}
                    onChange={(e) => { formatearRun(e.target.value) }}
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
                  <button type='submit' className='btn btn-ingresar'>
                    Ingresar
                  </button>
                </div>
                <p className='text-center mt-2'>
                  ¿Olvidaste tu contraseña? <Link to='/password_request' className='link-custom'>Recuperar</Link>
                </p>
              </div>
            </form>
            )
          : authMode === 'verificar'
            ? (
              <VerifyCode volver={volver} />
              )
            : (
              <form className='Auth-form' onSubmit={crearUsuario}>
                <div className='Auth-form-content'>
                  <h3 className='Auth-form-title'>Utalca ayudantías</h3>
                  <div className='text-center'>
                    Ya tienes cuenta?{' '}
                    <span className='link-custom' onClick={changeAuthMode}>
                      Iniciar sesión
                    </span>
                  </div>
                  <div className='form-group mt-3'>
                    <label>RUN</label>
                    <input
                      value={run}
                      onChange={(e) => { formatearRun(e.target.value) }}
                      className='form-control mt-1'
                      placeholder='RUN'
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
                    <button type='submit' className='btn btn-ingresar'>
                      Crear
                    </button>
                  </div>
                </div>
              </form>
              )}
      </div>
    </div>
  )
}
