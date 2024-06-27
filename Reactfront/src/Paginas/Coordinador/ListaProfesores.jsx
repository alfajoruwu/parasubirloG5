import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Modal, Button, Form } from 'react-bootstrap'
import TablaSimplev2 from '../../Componentes/Tablaejemplo/TablaSimplev2'
import '../App/App.css'
import Navbar from '../../Componentes/navbar/NavbarMarcela'
import axiosInstance from '../../utils/axiosInstance'

const ProfesorList = () => {
  const [profesores, setProfesores] = useState([])
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newProfesor, setNewProfesor] = useState({ run: '', email: '', password: '', nombre_completo: '' })
  const [deleteModal, setDeleteModal] = useState({ show: false, profesorId: null })

  const Tablatitulos = ['Nombre del profesor', 'Email', 'Acciones']

  const ObtenerProfesores = async () => {
    try {
      const response = await axiosInstance.get('NombresProfesor/')
      setProfesores(response.data)
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }

  useEffect(() => {
    ObtenerProfesores()
  }, [])

  const handleDelete = async (profesorId) => {
    try {
      const response = await axiosInstance.delete(`delete/${profesorId}/`)
      if (response.status === 200) {
        setProfesores(profesores.filter(profesor => profesor.id !== profesorId))
        toast.success('Profesor eliminado exitosamente', { position: 'bottom-right' })
      } else {
        console.error('Error al eliminar el profesor:', response)
        toast.error('Error al eliminar el profesor', { position: 'bottom-right' })
      }
    } catch (error) {
      console.error('Error al eliminar el profesor:', error)
      toast.error('Error al eliminar el profesor', { position: 'bottom-right' })
    }
    setDeleteModal({ show: false, profesorId: null })
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    const data = {
      run: newProfesor.run,
      nombre_completo: newProfesor.nombre_completo,
      email: newProfesor.email,
      password: newProfesor.password
    }

    try {
      const response = await axiosInstance.post('create_profesor/', data)
      if (response.status === 201) {
        setProfesores([...profesores, response.data])
        toast.success('Profesor creado exitosamente', { position: 'bottom-right' })
        setShowModal(false)
        ObtenerProfesores()
      } else {
        console.error('Error al crear el profesor:', response)
        toast.error('Error al crear el profesor', { position: 'bottom-right' })
      }
    } catch (error) {
      console.error('Error al crear el profesor:', error)
      toast.error('Error al crear el profesor', { position: 'bottom-right' })
    }
  }

  const handleChange = (e) => {
    setNewProfesor({ ...newProfesor, [e.target.name]: e.target.value })
  }

  const rows = profesores.map(profesor => ({
    Nombre: profesor.nombre_completo,
    Email: profesor.email,
    Acciones: (
      <Button variant='danger' onClick={() => setDeleteModal({ show: true, profesorId: profesor.id })}>
        Eliminar
      </Button>
    ),
    id: profesor.id
  }))

  return (
    <div className='principal'>
      <Navbar />
      <div className='container Componente'>
        <div className='row mb-3'>
          <div className='col-md-12 text-end'>
            <Button className='btn color-btn' onClick={() => setShowModal(true)}>Crear Profesor</Button>
          </div>
        </div>
        <div className='row'>
          <TablaSimplev2
            titulos={Tablatitulos}
            rows={rows}
          />
        </div>
      </div>
      <ToastContainer />

      {/* Modal para crear profesor */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Profesor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group controlId='formRun'>
              <Form.Label>RUN</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ingrese RUN'
                name='run'
                value={newProfesor.run}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId='formNombreCompleto'>
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ingrese nombre completo'
                name='nombre_completo'
                value={newProfesor.nombre_completo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId='formEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Ingrese email'
                name='email'
                value={newProfesor.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId='formPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Ingrese password'
                name='password'
                value={newProfesor.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant='secondary' onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
              <Button variant='primary' type='submit'>
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal show={deleteModal.show} onHide={() => setDeleteModal({ show: false, profesorId: null })}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este profesor? se eliminaran todas las ofertas de ayudantia asociadas con este profesor</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setDeleteModal({ show: false, profesorId: null })}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={() => handleDelete(deleteModal.profesorId)}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ProfesorList
