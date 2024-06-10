import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarProfesor'
import TablaSimple from '../../Componentes/Tablaejemplo/TablaSimpleProfesor'
import axiosInstance from '../../utils/axiosInstance'

const Postulantes = () => {
  const titulos = ['Ayudantias', 'Horas Asignadas', 'Postulantes', 'Ver postulantes']
  const navigate = useNavigate()

  const [rows, setRows] = useState([])

  const setearRows = (data) => {
    const rows = data.map((oferta) => {
      return {
        id: oferta.id,
        Ayudantia: oferta.modulo,
        HorasAsignadas: oferta.horas_ayudantia,
        Postulantes: oferta.postulantes,
        BotonPostulantes: {
          estado: oferta.estado,
          titulo: 'Ver Postulantes',
          funcion: () => {
            navigate(`/Postulantes/${oferta.id}`)
          }
        }
      }
    })
    setRows(rows)
  }
  useEffect(() => {
    axiosInstance.get('/Ofertas/').then((response) => {
      setearRows(response.data)
    })
  }, [])

  return (
    <div className='principal'>
      <Navbar />

      <div className='container Componente'>
        <TablaSimple rows={rows} titulos={titulos} />

        <div className='row'>
          <NavLink to='/' className='btn color-btn'>
            {' '}
            Salir{' '}
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Postulantes
