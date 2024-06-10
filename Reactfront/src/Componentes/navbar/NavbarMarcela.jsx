import './Navbar.css'
import '../../index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
const Navbar = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [nombre, setnombre] = useState('por defecto')
  useEffect(() => {
    // Código que se ejecuta una vez después de que el componente se monta
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Datos/')
        setnombre(response.data.nombre_completo)
      } catch (error) {
        setError(error)
        console.log(error)
      }
    }

    ObtenerDatos()
  }, [])

  return (
    <div style={{ marginBottom: '2rem' }}>
      <nav className='navbar navbar-expand-lg custom-navbar-color'>
        <div className='container-fluid'>
          <button
            className='navbar-toggler'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNavAltMarkup'
            aria-controls='navbarNavAltMarkup'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon' />
          </button>

          <div
            className='collapse navbar-collapse'
            id='navbarNavAltMarkup'
          >
            <div className='navbar-nav'>
              <NavLink
                to='/HorasAsignadas'
                className={({ isActive }) =>
                  'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
              >
                {' '}
                Asig. de horas{' '}
              </NavLink>
              <NavLink
                to='/Difusion
                '
                className={({ isActive }) =>
                  'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
              >
                {' '}
                Difusion{' '}
              </NavLink>
              <NavLink
                to='/Ayudantes'
                className={({ isActive }) =>
                  'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
              >
                {' '}
                Ayudantes{' '}
              </NavLink>
              <NavLink
                to='/Resolucion'
                className={({ isActive }) =>
                  'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
              >
                {' '}
                Resolución{' '}
              </NavLink>
            </div>
          </div>

          <div className=''>
            <div className='container'>
              <div className='row'>
                <a className='colorTexto ' href='#'>
                  Bienvenido
                </a>
              </div>
              <div className='row '>
                <NavLink
                  className='colorTextoGris'
                  to='/PublicarAyudantias'
                >
                  {nombre}
                </NavLink>
              </div>
            </div>
          </div>
          <NavLink to='/' className='iconoperfil'> </NavLink>
        </div>
      </nav>

      <div className='lineaCeleste' />
    </div>
  )
}

export default Navbar
