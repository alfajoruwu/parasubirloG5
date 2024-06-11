import React from 'react'
import { Col, Form, Button, Card, Row } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarMarcela'
import { NavLink } from 'react-router-dom'
import Tabla from '../../Componentes/Tablaejemplo/TablaSimplev2'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import './ComponentesCoordinador/Ayudante.css'
import ListGroup from 'react-bootstrap/ListGroup'
import Precio from './ComponentesCoordinador/Precio'

const Resolucion = () => {
  const titulos = ['Modulo', 'NAprobacion', 'Promedio', 'NAlumno', 'Rut', 'Banco', 'Mes', 'CantidadMes', 'PagoMensual']

  const rows = [
    {
      Módulo: 'Programación Avanzada',
      NAlumno: 'Matias Camilla',
      Rut: '12.345.678-9',
      Mes: 8,
      CantidadMes: 4,
      PagoMensual: '$56000'
    },
    {
      Módulo: 'Programación Avanzada',
      NAlumno: 'Matias Camilla',
      Rut: '12.345.678-9',
      Mes: 8,
      CantidadMes: 4,
      PagoMensual: '$56000'
    }
  ]

  return (
    <div className='principal'>
      <Navbar />

      <div className='container Componente'>

        <div className='row mt-3 align-items-center'>
          <Col xs='auto'>
            <Form.Control
              type='text'
              placeholder='Ingresar rut'
              className='mr-sm-2'
            />
          </Col>
          <Col xs='auto'>
            <Form.Control
              type='text'
              placeholder='Ingresar nombre'
              className='mr-sm-2'
            />
          </Col>
          <Col xs='auto'>
            <Button type='submit' className='color-btn'>Buscar</Button>
          </Col>
          <Col xs='auto' className='d-flex align-items-center ml-auto'>
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
        <div className='row mt-3'>
          <Tabla titulos={titulos} rows={rows} mostrarBoton={false} />
        </div>
        <Row className='mt-3 align-items-center justify-content-end'>
          <Col xs='auto'>
            <span style={{ color: '#1ECCCC' }}>Total</span>
          </Col>
          <Col xs='auto' className='d-flex'>
            <Card className='total-card flex-fill'>
              <Card.Body className='total-card-body'>
                16
              </Card.Body>
            </Card>
            <Card className='total-card flex-fill'>
              <Card.Body className='total-card-body'>
                16
              </Card.Body>
            </Card>
            <Card className='total-card flex-fill'>
              <Card.Body className='total-card-body'>
                $112000
              </Card.Body>
            </Card>
          </Col>
        </Row>
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

export default Resolucion
