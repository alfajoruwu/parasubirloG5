import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Modal, Button, ModalBody, Dropdown } from 'react-bootstrap'
import TablaSimplev2 from '../../Componentes/Tablaejemplo/TablaSimplev2'
import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarMarcela'
import axiosInstance from '../../utils/axiosInstance'
import CsvUploadPopup from './ComponentesCoordinador/CsvUploadPopup'
import FiltroModulo from '../../Componentes/Filtros/FiltroModulo'
import FiltroProfesor from '../../Componentes/Filtros/FiltroProfesor'
import FiltroHoras from '../../Componentes/Filtros/FiltroHoras'
import { FiltroYear, FiltroSemestre } from '../../Componentes/Filtros/FiltroSemestre'

const HorasAsignadas = () => {
  const [listaProfesor, setListaProfesor] = useState([])
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [modulos, setModulos] = useState([])
  const [moduloSeleccionado, setModuloSeleccionado] = useState('Todos')
  const [profesores, setProfesores] = useState([])
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('Todos')
  const [hoursFilter, setHoursFilter] = useState('all')
  const [showPopup, setShowPopup] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalContent2, setModalContent2] = useState('')
  const [yearSeleccionado, setYearSeleccionado] = useState('Todos')
  const [semestreSeleccionado, setSemestreSeleccionado] = useState('Todos')
  const [years, setYears] = useState([])
  const [semestres, setSemestres] = useState([])

  const Tablatitulos = ['Nombre del profesor', 'Nombre del módulo', 'N° de horas', 'Observaciones', '']

  const ObtenerDatos = async () => {
    try {
      const responseModulos = await axiosInstance.get('Modulos/')
      setYears([...new Set(responseModulos.data.map(item => item.anio))])
      setSemestres([...new Set(responseModulos.data.map(item => item.semestre))])
      const responseProfesores = await axiosInstance.get('NombresProfesor/')

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
        Boton: { titulo: 'Observaciones', funcion: () => handleShowModal(item.solicitud_horas, item.historial) },
        anio: item.anio,
        semestre: item.semestre
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
    axiosInstance.get('Modulos/' + moduloId + '/').then((response) => {
      const historialold = response.data.historial

      axiosInstance.patch('Modulos/' + moduloId + '/', { horas_asignadas: nuevasHoras, historial: historialold + '\n - Se cambio la hora a: ' + nuevasHoras }).then((response) => {
        if (response.status === 200) {
          setData(prevData =>
            prevData.map(row =>
              row.id === moduloId ? { ...row, HorasTotales: nuevasHoras } : row
            )
          )
          ObtenerDatos()
          toast.success('Horas actualizadas exitosamente', { position: 'bottom-right' })
        } else {
          console.error('Error al actualizar las horas:', response)
          toast.error('Error al actualizar las horas', { position: 'bottom-right' })
        }
      }).catch((error) => {
        console.error('Error al actualizar las horas:', error)
        toast.error('Error al actualizar las horas', { position: 'bottom-right' })
      })
    }).catch((error) => {
      console.error('Error al obtener el historial:', error)
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

  const handleYearSeleccionado = (year) => {
    setYearSeleccionado(year)
  }

  const handleSemestreSeleccionado = (semestre) => {
    setSemestreSeleccionado(semestre)
  }

  const actualizarFiltros = () => {
    const filteredData = aplicarFiltros(data, {
      moduloSeleccionado: (item) => moduloSeleccionado === 'Todos' || item.Asignatura === moduloSeleccionado,
      profesorSeleccionado: (item) => profesorSeleccionado === 'Todos' || item.Dropdown.default.nombre_completo === profesorSeleccionado,
      hoursFilter: (item) => {
        if (hoursFilter === 'non-zero') {
          return item.HorasTotales !== 0
        } else if (hoursFilter === 'zero') {
          return item.HorasTotales === 0
        } else {
          return true
        }
      },
      yearSeleccionado: (item) => yearSeleccionado === 'Todos' || item.anio === parseInt(yearSeleccionado),
      semestreSeleccionado: (item) => semestreSeleccionado === 'Todos' || item.semestre === parseInt(semestreSeleccionado)
    })
    setModulos(['Todos', ...new Set(filteredData.map(item => item.Asignatura))])
    setProfesores(['Todos', ...new Set(filteredData.map(item => item.Dropdown.default.nombre_completo))])
  }

  useEffect(() => {
    actualizarFiltros()
  }, [moduloSeleccionado, profesorSeleccionado, hoursFilter, yearSeleccionado, semestreSeleccionado])

  const filtros = {
    moduloSeleccionado: (item) => moduloSeleccionado === 'Todos' || item.Asignatura === moduloSeleccionado,
    profesorSeleccionado: (item) => profesorSeleccionado === 'Todos' || item.Dropdown.default.nombre_completo === profesorSeleccionado,
    hoursFilter: (item) => {
      if (hoursFilter === 'non-zero') {
        return item.HorasTotales !== 0
      } else if (hoursFilter === 'zero') {
        return item.HorasTotales === 0
      } else {
        return true
      }
    },
    yearSeleccionado: (item) => yearSeleccionado === 'Todos' || item.anio === parseInt(yearSeleccionado),
    semestreSeleccionado: (item) => semestreSeleccionado === 'Todos' || item.semestre === parseInt(semestreSeleccionado)
  }

  // Función que aplica los filtros a los datos
  const aplicarFiltros = (data, filtros) => {
    return data.filter(item => {
      for (const key in filtros) {
        if (filtros[key] && !filtros[key](item)) {
          return false
        }
      }
      return true
    }).map(item => {
      return {
        Dropdown: item.Dropdown,
        Asignatura: item.Asignatura,
        HorasTotales: item.HorasTotales,
        Boton: item.Boton,
        id: item.id
      }
    }
    )
  }

  const filteredData = aplicarFiltros(data, filtros)

  const handleShowModal = (Solicitud, Cambioshoras) => {
    setModalContent(`${Solicitud}`)
    setModalContent2(`${Cambioshoras}`)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalContent('')
    setModalContent2('')
  }

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row mb-3'>
          <FiltroModulo
            modulos={modulos}
            moduloSeleccionado={moduloSeleccionado}
            handleModuloSeleccionado={handleModuloSeleccionado}
          />
          <FiltroProfesor
            profesores={profesores}
            profesorSeleccionado={profesorSeleccionado}
            handleProfesorSeleccionado={handleProfesorSeleccionado}
          />
          <FiltroHoras
            hoursFilter={hoursFilter}
            handleHoursFilterChange={handleHoursFilterChange}
          />
          <FiltroYear
            years={['Todos', ...years]}
            yearSeleccionado={yearSeleccionado}
            handleYearSeleccionado={handleYearSeleccionado}
          />
          <FiltroSemestre
            semestres={['Todos', ...semestres]}
            semestreSeleccionado={semestreSeleccionado}
            handleSemestreSeleccionado={handleSemestreSeleccionado}
          />
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title><strong>Observaciones</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: 'bold', textDecoration: 'underline' }}> Solicitud de horas </Modal.Body>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Body style={{ fontWeight: 'bold', textDecoration: 'underline' }}> Cambios Realizados </Modal.Body>
        <Modal.Body>{modalContent2}</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant='primary' onClick={handleCloseModal}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default HorasAsignadas
