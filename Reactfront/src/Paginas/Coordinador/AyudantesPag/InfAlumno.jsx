import React, { useEffect } from 'react'
import { Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { NavLink } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

import '../../App/App.css'
import Navbar from '../../../Componentes/navbar/NavbarMarcela'
import Tabla from '../../../Componentes/Tablaejemplo/TablaSimplev2'
import '../ComponentesCoordinador/Ayudante.css'
import axiosInstance from '../../../utils/axiosInstance'

const InfAlumno = () => {
  const titulos = ['Nombre', 'RUN', 'Modulo', 'NAprobacion', 'Promedio', 'Ncontacto', 'Correo']

  const rows = [
    {
      NAlumno: 'Matias Camilla',
      Rut: '12.345.678-9',
      Módulo: 'Programación Avanzada',
      NAprobacion: 5.5,
      Promedio: 5.9,
      Ncontacto: '+56912345678',
      Correo: 'afuenzalida20@alumnos.utalca.cl'
    }
  ]
  useEffect(() => {
    axiosInstance.get('/Postulaciones').then((res) => {
      console.log(res.data)
    })
  }, [])

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row mt-3 align-items-center'>
          <Col xs='auto' className='d-flex align-items-center'>
            <span className='mr-2' style={{ color: '#1ECCCC' }}>Resolución</span>
          </Col>
          <Col xs='auto'>
            <DropdownButton
              id='dropdown-basic-button'
              title='2024-1'
              className='custom-dropdown'
            >
              <Dropdown.Item href='#/action-1'>2023-2</Dropdown.Item>
              <Dropdown.Item href='#/action-2'>2023-1</Dropdown.Item>
              <Dropdown.Item href='#/action-3'>2022-2</Dropdown.Item>
            </DropdownButton>
          </Col>
        </div>
        <div className='row mt-3 justify-content-center'>
          <Col xs='auto' className='d-flex justify-content-center'>
            <NavLink
              to='/Ayudantes'
              className={({ isActive }) =>
                'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
            >
              {' '}
              Inf. Alumno{' '}
            </NavLink>
            <NavLink
              to='/DatosCuenta'
              className={({ isActive }) =>
                'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
            >
              {' '}
              Datos cuenta{' '}
            </NavLink>
            <NavLink
              to='/Extras'
              className={({ isActive }) =>
                'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
            >
              {' '}
              Extras{' '}
            </NavLink>
          </Col>
        </div>
        <div className='row mt-3'>
          <Tabla titulos={titulos} rows={rows} mostrarBoton={false} />
        </div>
        <div className='row mt-3 justify-content-center'>
          <Col xs='auto' className='d-flex justify-content-center'>
            <NavLink to='/' className='btn color-btn mr-2'>
              Volver
            </NavLink>
            <NavLink to='/' className='btn color-btn'>
              Exportar excel
            </NavLink>
          </Col>
        </div>
      </div>
    </div>
  )
}

export default InfAlumno
