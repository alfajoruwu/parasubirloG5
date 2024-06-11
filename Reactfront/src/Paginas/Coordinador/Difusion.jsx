import 'bootstrap/dist/css/bootstrap.min.css'
import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarMarcela'
import TablaCoordinador2 from '../../Componentes/Tablaejemplo/TablaCoordinador2'
import axiosInstance from '../../utils/axiosInstance'
import { useState, useEffect } from 'react'

const Difusion = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [modulos, setModulos] = useState([])
  const [moduloSeleccionado, setModuloSeleccionado] = useState('Todos')
  const [profesores, setProfesores] = useState([])
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('Todos')
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos')

  const obtenerDatos = async () => {
    try {
      const response = await axiosInstance.get('Ofertas/')
      const newData = response.data.map(item => ({
        Estado: item.estado ? 'Publicado' : 'Pendiente',
        Asignatura: item.modulo,
        NombreProfesor: item.profesor,
        HorasTotales: item.horas_ayudantia,
        id: item.id
      }))
      setData(newData)
      setModulos(['Todos', ...new Set(newData.map(item => item.Asignatura))])
      setProfesores(['Todos', ...new Set(newData.map(item => item.NombreProfesor))])
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    obtenerDatos()
  }, [])

  const handleModuloSeleccionado = (modulo) => setModuloSeleccionado(modulo)
  const handleProfesorSeleccionado = (profesor) => setProfesorSeleccionado(profesor)
  const handleEstadoSeleccionado = (estado) => setEstadoSeleccionado(estado)

  const titulos = {
    estado: 'Estado',
    Asignatura: 'Asignatura',
    Nprofesor: 'Nombre profesor',
    HorasTotales: 'Horas totales',
    Vacio: 'Observaciones',
    publicar: 'Publicar'
  }

  const rows = data.filter(item =>
    (moduloSeleccionado === 'Todos' || item.Asignatura === moduloSeleccionado) &&
    (profesorSeleccionado === 'Todos' || item.NombreProfesor === profesorSeleccionado) &&
    (estadoSeleccionado === 'Todos' || item.Estado === estadoSeleccionado)
  )

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row mb-3'>
          <div className='col-md-6'>
            <label htmlFor='filtro-modulo' className='form-label'>Filtrar por módulo:</label>
            <select
              className='form-select'
              id='filtro-modulo'
              value={moduloSeleccionado}
              onChange={(e) => handleModuloSeleccionado(e.target.value)}
            >
              {modulos.map((modulo, index) => (
                <option key={index} value={modulo}>{modulo}</option>
              ))}
            </select>
          </div>
          <div className='col-md-3'>
            <label htmlFor='filtro-profesor' className='form-label'>Filtrar por profesor:</label>
            <div className='d-flex align-items-center'>
              <select
                className='form-control me-2'
                value={profesorSeleccionado}
                onChange={(e) => handleProfesorSeleccionado(e.target.value)}
              >
                {profesores.map((profesor, index) => (
                  <option key={index} value={profesor}>{profesor}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='col-md-3'>
            <label htmlFor='filtro-estado' className='form-label'>Filtrar por Estado:</label>
            <div className='d-flex align-items-center'>
              <select
                className='form-control me-2'
                id='filtro-estado'
                value={estadoSeleccionado}
                onChange={(e) => handleEstadoSeleccionado(e.target.value)}
              >
                <option value='Todos'>Todos</option>
                <option value='Pendiente'>Pendiente</option>
                <option value='Publicado'>Publicado</option>
              </select>
            </div>
          </div>
        </div>
        <TablaCoordinador2 titulos={titulos} rows={rows} actualizarDatos={obtenerDatos} />
        <div className='row justify-content-center mt-3' />
      </div>
    </div>
  )
}

export default Difusion
