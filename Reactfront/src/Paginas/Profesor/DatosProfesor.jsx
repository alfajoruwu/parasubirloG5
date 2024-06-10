import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarProfesor'
import axiosInstance from '../../utils/axiosInstance'

const DatosProfesor = () => {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contacto, setContacto] = useState('')

  useEffect(() => {
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Datos/')
        setNombre(response.data.nombre_completo)
        setCorreo(response.data.email)
        setContacto(response.data.otro_contacto)
      } catch (error) {
        console.error('Error al enviar la solicitud:', error)
      }
    }
    ObtenerDatos()
  }, [])

  const LlenarDatos = async () => {
    try {
      await axiosInstance.patch('Datos/uwu/',
        {
          nombre_completo: nombre,
          email: correo,
          otro_contacto: contacto
        }
      )
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
    }
  }

  return (
    <div className='principal'>
      <Navbar />

      <div className='container Componente'>
        <div className='container Componente '>

          <div className='row margen'>

            <div className='col'>

              <div className='row'>

                <div className='col-3'>
                  <h6 className='letra'>Nombre</h6>
                  <div className='linea' />
                </div>

                <div className='col'>
                  <input name='nombre' className='' onChange={(e) => setNombre(e.target.value)} value={nombre} />
                </div>

              </div>

            </div>

            <div className='col' />
          </div>

          <div className='row margen'>

            <div className='col'>

              <div className='row'>

                <div className='col-3'>
                  <h6 className='letra'>Correo</h6>
                  <div className='linea' />
                </div>

                <div className='col'>
                  <input name='correo' className='' onChange={(e) => setCorreo(e.target.value)} value={correo} />
                </div>

              </div>

            </div>

            <div className='col' />

          </div>

          <div className='row margen'>

            <div className='col'>

              <div className='row'>

                <div className='col-3'>
                  <h6 className='letra'>Otro contacto</h6>
                  <div className='linea' />
                </div>

                <div className='col'>
                  <input name='otro_contacto' className='' onChange={(e) => setContacto(e.target.value)} value={contacto} />
                </div>

              </div>

            </div>

            <div className='col' />

          </div>

        </div>

        <div className='container d-flex justify-content-center align-items-center'>
          <button onClick={LlenarDatos} className='btn color-btn'> Guardar</button>

        </div>

      </div>
    </div>
  )
}

export default DatosProfesor
