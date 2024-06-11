import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TablaSimplev2 from '../../Componentes/Tablaejemplo/TablaSimplev2'
import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarMarcela'
import axiosInstance from '../../utils/axiosInstance'
import CsvUploadPopup from './ComponentesCoordinador/CsvUploadPopup'

const HorasAsignadas = () => {
  const [listaProfesor, setListaProfesor] = useState([])
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [modulos, setModulos] = useState([])
  const [moduloSeleccionado, setModuloSeleccionado] = useState('Todos')
  const [profesores, setProfesores] = useState([])
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('Todos')
  const [hoursFilter, setHoursFilter] = useState('all') // 'all', 'non-zero', 'zero'
  const [showPopup, setShowPopup] = useState(false)

  const Tablatitulos = ['Nombre del profesor', 'Nombre del módulo', 'N° de horas', 'Observaciones', '']

  const ObtenerDatos = async () => {
    try {
      const responseModulos = await axiosInstance.get('Modulos/')
      const responseProfesores = await axiosInstance.get('NombresProfesor/')

      // Añadir "No asignado" a la lista de profesores
      const profesores = [{ id: null, nombre_completo: 'No asignado' }, ...responseProfesores.data]
      setListaProfesor(profesores)
      setProfesores(['Todos', ...profesores.map(prof => prof.nombre_completo)])

      const newData = responseModulos.data.map(item => ({
        Dropdown: {
          lista_profesor: profesores,
          default: { nombre_completo: item.profesor_asignado || 'No asignado' }
        },
        Asignatura: item.nombre,
        HorasTotales: item.horas_asignadas,
        id: item.id,
        Boton: { titulo: 'Observaciones', funcion: () => {} }
      }))
      setData(newData)
      setModulos(['Todos', ...new Set(responseModulos.data.map(item => item.nombre))])
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }

  useEffect(() => {
    ObtenerDatos()
  }, [])

  const handleDropdownChange = async (moduloId, nuevoProfesor) => {
    const responseProfesores = await axiosInstance.get('NombresProfesor/')
    const profesor = responseProfesores.data.find(profesor => profesor.nombre_completo === nuevoProfesor)

    try {
      const response = await axiosInstance.patch('Modulos/' + moduloId + '/', { profesor_asignado: profesor ? profesor.id : null })
      if (response.status === 200) {
        setData(prevData =>
          prevData.map(row =>
            row.id === moduloId ? { ...row, Dropdown: { ...row.Dropdown, default: { nombre_completo: nuevoProfesor } } } : row
          )
        )
        toast.success('Profesor actualizado exitosamente', { position: 'bottom-right' })
      } else {
        console.error('Error al actualizar el profesor:', response)
        toast.error('Error al actualizar el profesor', { position: 'bottom-right' })
      }
    } catch (error) {
      console.error('Error al actualizar el profesor:', error)
      toast.error('Error al actualizar el profesor', { position: 'bottom-right' })
    }
  }

  const handleHorasChange = (moduloId, nuevasHoras) => {
    axiosInstance.patch('Modulos/' + moduloId + '/', { horas_asignadas: nuevasHoras }).then((response) => {
      if (response.status === 200) {
        setData(prevData =>
          prevData.map(row =>
            row.id === moduloId ? { ...row, HorasTotales: nuevasHoras } : row
          )
        )
        toast.success('Horas actualizadas exitosamente', { position: 'bottom-right' })
      } else {
        console.error('Error al actualizar las horas:', response)
        toast.error('Error al actualizar las horas', { position: 'bottom-right' })
      }
    }).catch((error) => {
      console.error('Error al actualizar las horas:', error)
      toast.error('Error al actualizar las horas', { position: 'bottom-right' })
    })
  }

  const handleModuloSeleccionado = (modulo) => {
    setModuloSeleccionado(modulo)
  }

  const handleProfesorSeleccionado = (profesor) => {
    setProfesorSeleccionado(profesor)
  }

  const handleHoursFilterChange = (filter) => {
    setHoursFilter(filter)
  }

  const filteredData = data.filter(item => {
    if (hoursFilter === 'non-zero') {
      return (moduloSeleccionado === 'Todos' || item.Asignatura === moduloSeleccionado) &&
        (profesorSeleccionado === 'Todos' || item.Dropdown.default.nombre_completo === profesorSeleccionado) &&
        item.HorasTotales !== 0
    } else if (hoursFilter === 'zero') {
      return (moduloSeleccionado === 'Todos' || item.Asignatura === moduloSeleccionado) &&
        (profesorSeleccionado === 'Todos' || item.Dropdown.default.nombre_completo === profesorSeleccionado) &&
        item.HorasTotales === 0
    } else {
      return (moduloSeleccionado === 'Todos' || item.Asignatura === moduloSeleccionado) &&
        (profesorSeleccionado === 'Todos' || item.Dropdown.default.nombre_completo === profesorSeleccionado)
    }
  })

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row mb-3'>
          <div className='col-md-4'>
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
            <select
              className='form-control'
              value={profesorSeleccionado}
              onChange={(e) => handleProfesorSeleccionado(e.target.value)}
            >
              {profesores.map((profesor, index) => (
                <option key={index} value={profesor}>{profesor}</option>
              ))}
            </select>
          </div>
          <div className='col-md-2'>
            <label htmlFor='hours-filter' className='form-label'>Filtrar por horas:</label>
            <select
              className='form-control'
              id='hours-filter'
              value={hoursFilter}
              onChange={(e) => handleHoursFilterChange(e.target.value)}
            >
              <option value='all'>Todos</option>
              <option value='non-zero'>Modulos con horas</option>
              <option value='zero'>Modulos sin horas</option>
            </select>
          </div>
          <div className='col-md-2'>
            <button className='btn color-btn' onClick={() => setShowPopup(true)}>Subir CSV</button>
          </div>
        </div>
        <div className='row'>
          <TablaSimplev2
            titulos={Tablatitulos}
            rows={filteredData}
            onDropdownChange={handleDropdownChange}
            onHorasChange={handleHorasChange}
          />
        </div>
      </div>
      <CsvUploadPopup show={showPopup} onClose={() => setShowPopup(false)} updateModules={ObtenerDatos} />
      <ToastContainer />
    </div>
  )
}

export default HorasAsignadas
