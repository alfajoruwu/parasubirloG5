import 'bootstrap/dist/css/bootstrap.min.css'
import '../App/App.css'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import Navbar from '../../Componentes/navbar/NavbarProfesor'
import TablaSimple from '../../Componentes/Tablaejemplo/TablaSimpleProfesor'
import axiosInstance from '../../utils/axiosInstance'

const Postulantes = () => {
  const titulos = ['Postulantes', 'Nota Aprobacion', 'Comentario', 'Contacto', 'Seleccionar']
  const navigate = useNavigate()
  const { oferta } = useParams()
  const [rows, setRows] = useState([])

  const setearRows = (data) => {
    const rows = data.map((postulante) => {
      return {
        id: postulante.id,
        Nombre: postulante.nombre_postulante,
        NotaAprovacion: postulante.nota_aprobacion,
        Comentario: postulante.comentario,
        BotonContacto: {
          titulo: 'Ver Contacto',
          funcion: () => {
            window.alert('Correo: ' + postulante.contacto.correo + '\nTelefono: ' + postulante.contacto.telefono + '\nOtro: ' + postulante.contacto.otro)
          }
        },
        BotonSeleccionar: {
          titulo: 'Seleccionar',
          estado: postulante.estado,
          funcion: () => {
            axiosInstance.patch('/Postulaciones/' + postulante.id + '/', { id: postulante.id, estado: !postulante.estado }).then((response) => {
              if (response.data.estado) {
                navigate('/VerPostulantes')
              } else {
                // actualizar datos
                axiosInstance.get('/Postulaciones/' + oferta + '/').then((response) => {
                  setearRows(response.data)
                })
              }
            })
          }
        }
      }
    })
    setRows(rows)
  }
  useEffect(() => {
    axiosInstance.get('/Postulaciones/' + oferta + '/').then((response) => {
      setearRows(response.data)
    })
  }, [oferta])

  return (
    <div className='principal'>
      <Navbar />

      <div className='container Componente'>
        <TablaSimple rows={rows} titulos={titulos} />

        <div className='row'>
          <NavLink to='/VerPostulantes' className='btn color-btn'>
            {' '}
            Volver{' '}
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Postulantes
