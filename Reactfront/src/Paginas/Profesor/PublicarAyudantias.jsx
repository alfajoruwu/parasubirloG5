import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState, useRef } from 'react'
import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarProfesor'
import Tabla from '../../Componentes/Tablaejemplo/TablaProfesor'
import axiosInstance from '../../utils/axiosInstance'

const PublicarAyudantias = () => {
  const titulos = {
    Asignatura: 'Asignatura',
    Nayudantes: 'N° Ayudantes',
    HorasTotales: 'Horas a repartir',
    Vacio: 'Solicitar horas'
  }

  const [modulos, setModulos] = useState([])
  const rowRefs = useRef([])

  useEffect(() => {
    const ObtenerDatos = () => {
      const OfertasTemp = []
      axiosInstance.get('Ofertas/')
        .then(response => {
          response.data.forEach(oferta => {
            OfertasTemp.push({
              id: oferta.id,
              modulo: oferta.modulo,
              horas_ayudantia: oferta.horas_ayudantia,
              disponibilidad: oferta.disponibilidad,
              nota_mini: oferta.nota_mini,
              tareas: oferta.tareas,
              otros: oferta.otros,
              estado: oferta.estado
            })
          })
          const modulosTemp = []
          axiosInstance.get('Modulos/')
            .then(response => {
              response.data.forEach(modulo => {
                modulosTemp.push({
                  id: modulo.id,
                  Asignatura: modulo.nombre,
                  Nayudantes: 1,
                  HorasTotales: modulo.horas_asignadas,
                  ofertas: OfertasTemp.filter(oferta => oferta.modulo === modulo.nombre)
                })
              })
              setModulos(modulosTemp)
            })
            .catch(error => {
              console.error('Error al obtener los módulos:', error)
            })
        })
        .catch(error => {
          console.error('Error al obtener las ofertas:', error)
        })
    }
    ObtenerDatos()
  }, [])

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row'>
          <Tabla titulos={titulos} rows={modulos} rowRefs={rowRefs} mostrarBoton />
        </div>
      </div>
    </div>
  )
}

export default PublicarAyudantias
