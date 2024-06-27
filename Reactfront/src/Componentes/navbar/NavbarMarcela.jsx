import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import './NavbarMarcela.css'
import logo from './logo.png'
import cerrarSesion from './cerrarSesion.png'

const CustomNavbar = () => {
  const [nombre, setNombre] = useState('por defecto')
  const [error, setError] = useState(null)

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Datos/')
        setNombre(response.data.nombre_completo)
      } catch (error) {
        setError(error)
        console.log(error)
      }
    }

    obtenerDatos()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('logout/')
      console.log(response.data)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <Navbar expand='lg' className='custom-navbar-color'>
        <Container>
          <Navbar.Brand>
            <img
              src={logo}
              alt='Logo'
              height='60'
              width='auto'
              className='d-inline-block align-top'
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <NavLink
                className={({ isActive }) => `nav-link colorTexto${isActive ? ' active' : ''}`}
                to='/HorasAsignadas'
              >
                Asig. de horas
              </NavLink>
              <NavLink
                className={({ isActive }) => `nav-link colorTexto${isActive ? ' active' : ''}`}
                to='/Difusion'
              >
                Difusión
              </NavLink>
              <NavLink
                className={({ isActive }) => `nav-link colorTexto${isActive ? ' active' : ''}`}
                to='/Ayudantes'
              >
                Ayudantes
              </NavLink>
              <NavLink
                className={({ isActive }) => `nav-link colorTexto${isActive ? ' active' : ''}`}
                to='/Resolucion'
              >
                Proceso
              </NavLink>
              <NavLink
                className={({ isActive }) => `nav-link colorTexto${isActive ? ' active' : ''}`}
                to='/ListaProfesores'
              >
                Profesores
              </NavLink>
            </Nav>
            <Nav>
              <NavLink className='nav-link colorTextoGris' to='/PublicarAyudantias'>
                {nombre}
              </NavLink>
              <button onClick={handleLogout} className='iconoperfil'>
                <img
                  src={cerrarSesion}
                  alt='Logout'
                  height='60'
                  width='60'
                  className='logout-icon'
                />
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className='lineaCeleste' />
    </div>
  )
}

export default CustomNavbar
