import React, { useCallback, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { TableCell, TableRow } from '@mui/material'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import TextField from '@mui/material/TextField'

import '../../Paginas/App/App.css'
import './Tabla.css'
import './TablaSimplev2.css'
import axiosInstance from '../../utils/axiosInstance'

export default function Row ({ modulo }) {
  const [Nayudantes, setNayudantes] = useState(modulo.ofertas.length)
  const [ofertas, setOfertas] = useState(
    Array.from({ length: Nayudantes }, (_, index) => ({
      disponibilidad: '',
      nota_mini: 5,
      tareas: '',
      otros: '',
      id: null,
      isLoading: false
    }))
  )

  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')

  const [showSolicitudModal, setShowSolicitudModal] = useState(false)
  const [solicitudComentario, setSolicitudComentario] = useState('')
  const [solicitudModuloId, setSolicitudModuloId] = useState(null)
  const [solicitudModuloNombre, setSolicitudModuloNombre] = useState('')

  const handleShowModal = (mensaje) => {
    setModalContent(mensaje)
    setShowModal(true)
  }

  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const handleCloseModal = () => {
    setModalContent('')
    setShowModal(false)
  }

  const guardarOfertas = (newOfertas) => {
    setOfertas(newOfertas)
    modulo.ofertas = newOfertas
  }

  const mandarAlBack = (oferta) => {
    if (oferta.isLoading) {
      return
    }
    if (oferta.id === null) {
      if (oferta.horas_ayudantia === null || oferta.disponibilidad === '' || oferta.nota_mini === null || oferta.tareas === '') {
        return
      }
      toast.warning('Creando oferta, no se guardarán cambios hasta que se haya creado la oferta')
      oferta.isLoading = true
      axiosInstance.post('Ofertas/', {
        modulo: modulo.id,
        horas_ayudantia: oferta.horas_ayudantia,
        disponibilidad: oferta.disponibilidad,
        nota_mini: oferta.nota_mini,
        tareas: oferta.tareas,
        otros: oferta.otros
      }).then(response => {
        oferta.id = response.data.id
        oferta.isLoading = false
        toast.success('Oferta creada', { position: 'bottom-right' })
      }).catch(error => {
        console.log(error)
        oferta.isLoading = false
      })
    } else {
      debuncedActualizarOferta(oferta)
    }
  }

  const actualizarOferta = (oferta) => {
    axiosInstance.put('Ofertas/' + oferta.id + '/', {
      modulo: modulo.id,
      horas_ayudantia: oferta.horas_ayudantia,
      disponibilidad: oferta.disponibilidad,
      nota_mini: oferta.nota_mini,
      tareas: oferta.tareas,
      otros: oferta.otros
    }).then(response => {
      toast.success('Oferta actualizada', { position: 'bottom-right' })
    }).catch(error => {
      console.log(error)
      if (error.response.status === 400) {
        if (error.response.data?.detail) {
          if (error.response.data.detail.startsWith('{\'')) {
            // ejemplo de error: "{'disponibilidad': [ErrorDetail(string='Asegúrese de que este campo no tenga más de 100 caracteres.', code='max_length')]}"
            // sacamos lo que este entre las primeras y segundas comillas simples, ignorando el resto y colocando en mayusculas la primera letra
            // para que quede algo como: "Disponibilidad: Asegúrese de que este campo no tenga más de 100 caracteres."
            const cleanedError = error.response.data.detail.split('\'')[1].charAt(0).toUpperCase() + error.response.data.detail.split('\'')[1].slice(1) + ': ' + error.response.data.detail.split('\'')[3]
            toast.error(cleanedError, { position: 'bottom-right' })
          } else {
            const cleanedError = error.response.data.detail.replace(/[[\]']/g, '')
            toast.error(cleanedError, { position: 'bottom-right' })
          }
        } else {
          toast.error('Error al actualizar la oferta', { position: 'bottom-right' })
        }
      } else {
        toast.error('Error desconocido', { position: 'bottom-right' })
      }
    })
  }
  const debuncedActualizarOferta = useCallback(debounce(actualizarOferta, 1000), [])

  const crearOferta = () => {
    setOfertas([
      ...modulo.ofertas,
      ...Array.from({ length: Nayudantes - modulo.ofertas.length }, () => ({
        disponibilidad: '',
        nota_mini: 4,
        tareas: '',
        otros: '',
        id: null
      }))
    ])
  }

  const borrarOfertas = () => {
    modulo.ofertas.slice(Nayudantes).forEach(oferta => {
      if (oferta.id !== null) {
        axiosInstance.delete('Ofertas/' + oferta.id).then(response => {
          toast.success('Oferta eliminada', { position: 'bottom-right' })
        }).catch(error => {
          console.log(error)
          toast.error('Error al eliminar la oferta', { position: 'bottom-right' })
        })
        oferta.id = null
      }
    })
    setOfertas(modulo.ofertas.slice(0, Nayudantes))
  }

  useEffect(() => {
    if (Nayudantes > modulo.ofertas.length) {
      crearOferta()
    } else {
      borrarOfertas()
    }
    setDesplegarOferta(Array.from({ length: Nayudantes }, (_, index) => desplegarOferta[index] || false))
  }, [Nayudantes, modulo.ofertas])

  const [desplegarOferta, setDesplegarOferta] = useState(Array.from({ length: modulo.ofertas.length }, () => false))
  const [desplegarModulo, setDesplegarModulo] = useState(false)

  const toggleModulo = () => {
    setDesplegarModulo(!desplegarModulo)
  }
  const toggleOferta = (index) => {
    setDesplegarOferta(desplegarOferta.map((open, cellIndex) => (index === cellIndex ? !open : open)))
  }
  const cambiarDisponibilidad = (e, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].disponibilidad = e.target.value
    guardarOfertas(newAyudantes)
    mandarAlBack(newAyudantes[index])
  }
  const cambiarNota = (e, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].nota_mini = e.target.value
    guardarOfertas(newAyudantes)
    mandarAlBack(newAyudantes[index])
  }
  const cambiarTareas = (e, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].tareas = e.target.value
    guardarOfertas(newAyudantes)
    mandarAlBack(newAyudantes[index])
  }
  const cambiarOtros = (e, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].otros = e.target.value
    guardarOfertas(newAyudantes)
    mandarAlBack(newAyudantes[index])
  }

  const cambiarHoras = (horas, index) => {
    const newAyudantes = [...ofertas]
    newAyudantes[index].horas_ayudantia = parseInt(horas)
    guardarOfertas(newAyudantes)
    mandarAlBack(newAyudantes[index])
  }

  const enviarSolicitud = () => {
    if (solicitudComentario) {
      axiosInstance.patch(`Modulos/${solicitudModuloId}/`, {
        solicitud_horas: solicitudComentario
      }).then(response => {
        toast.success('Solicitud enviada', { position: 'bottom-right' })
        handleCloseSolicitudModal()
      }).catch(error => {
        console.error('Error al enviar la solicitud:', error)
        toast.error('Error al enviar la solicitud', { position: 'bottom-right' })
      })
    } else {
      toast.error('Debes ingresar un comentario', { position: 'bottom-right' })
    }
  }

  const handleShowSolicitudModal = (id, nombre) => {
    setSolicitudModuloId(id)
    setSolicitudModuloNombre(nombre)
    setShowSolicitudModal(true)
  }

  const handleCloseSolicitudModal = () => {
    setSolicitudComentario('')
    setSolicitudModuloId(null)
    setSolicitudModuloNombre('')
    setShowSolicitudModal(false)
  }

  const SolicitarHoras = (id, nombre) => {
    handleShowSolicitudModal(id, nombre)
  }
  return (
    <>
      <TableRow className='module-header table-row-margin seleccionable' onClick={toggleModulo}>

        <TableCell>
          <div className='primero container justify-content-center align-items-center d-flex'> {modulo.Asignatura} </div>
        </TableCell>
        <TableCell className='selector '>
          <label htmlFor={`Nayudantes_${modulo.id}`} />
          <TextField
            id={`Nayudantes_${modulo.id}`}
            name={`Nayudantes_${modulo.id}`}
            type='number'
            value={Nayudantes}
            onChange={(e) => setNayudantes(e.target.value)}
            onClick={(e) => { e.stopPropagation() }}
            variant='outlined'
            size='small'
            inputProps={{ min: 0 }}
          />
        </TableCell>
        <TableCell>
          <div className='demas container justify-content-center align-items-center d-flex'>
            {modulo.HorasTotales}
          </div>
        </TableCell>
        <TableCell className=' '>
          <button
            onClick={(e) => {
              e.stopPropagation() // Detiene la propagación del evento
              SolicitarHoras(modulo.id, modulo.Asignatura)
            }}
            className='final btn color-btn'
          >
            Más horas
          </button>
        </TableCell>

      </TableRow>

      {desplegarModulo && (
        <>
          {ofertas.map((oferta, index) => (
            <React.Fragment key={index}>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className='offer-header seleccionable' onClick={() => toggleOferta(index)}>

                <TableCell>
                  <div style={{ backgroundColor: '#018d8d' }} className=' primero container justify-content-center align-items-center d-flex'>

                    Oferta para el ayudante {index + 1}
                  </div>

                </TableCell>

                <TableCell>
                  <div className='container d-flex'>
                    <label htmlFor={`Estado_${index}`}>Estado:</label>

                    <div
                      className='demas container d-flex justify-content-center align-items-center'

                    >
                      {oferta.estado ? 'Publicada' : 'Pendiente'}
                    </div>
                  </div>
                </TableCell>

                <TableCell className='selector container'>
                  <label htmlFor={`horas_ayudantia_${index}`}>Horas Ayudantía:</label>
                  <TextField
                    id={`horas_ayudantia_${index}`}
                    name={`horas_ayudantia_${index}`}
                    type='number'
                    value={oferta.horas_ayudantia || ''}
                    onChange={(e) => cambiarHoras(e.target.value, index)}
                    onClick={(e) => { e.stopPropagation() }}
                    variant='outlined'
                    size='small'
                    inputProps={{ min: 0 }}
                  />
                </TableCell>

                <TableCell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation() // Detiene la propagación del evento
                      handleShowModal(oferta.observaciones ? oferta.observaciones : 'no hay observaciones')
                    }}
                    className={oferta.observaciones ? 'btn btn-amarillo' : 'final btn color-btn'}
                  >
                    Observaciones
                  </button>
                </TableCell>

              </TableRow>
              {desplegarOferta[index] && (
                <>
                  <TableRow>

                    <TableCell className=''>

                      <div className='col interior interno' style={{ height: '6rem' }}>
                        <div className='titulo container justify-content-center align-items-center d-flex'>Disponibilidad </div>
                        <div className='titulo container justify-content-center align-items-center'>
                          <label htmlFor={`disponibilidad_${index}`} className='sr-only' />
                          <textarea
                            id={`disponibilidad_${index}`}
                            name={`disponibilidad_${index}`}
                            className='textoarea'
                            value={oferta.disponibilidad}
                            onChange={(e) => cambiarDisponibilidad(e, index)}
                          />
                        </div>
                      </div>

                    </TableCell>
                    <TableCell>
                      <div className='container ' style={{ width: '10rem' }}>
                        <div className='col interior ' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Nota mínima</div>
                          <div className='titulo container justify-content-center align-items-center d-flex'>
                            <label htmlFor={`nota_mini_${index}`} className='sr-only' />
                            <TextField
                              id={`nota_mini_${index}`}
                              name={`nota_mini_${index}`}
                              style={{ backgroundColor: 'white' }}
                              type='number'
                              value={oferta.nota_mini}
                              onChange={(e) => cambiarNota(e, index)}
                              onClick={(e) => { e.stopPropagation() }}
                              variant='outlined'
                              size='small'
                              inputProps={{ min: 0 }}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='container '>
                        <div className='col interior' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Tareas</div>
                          <div className='titulo container justify-content-center align-items-center d-flex'>
                            <label htmlFor={`tareas_${index}`} className='sr-only' />
                            <textarea
                              id={`tareas_${index}`}
                              name={`tareas_${index}`}
                              className='textoarea'
                              value={oferta.tareas}
                              onChange={(e) => cambiarTareas(e, index)}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='container '>
                        <div className='col interior' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Otros</div>
                          <div className='titulo container justify-content-center align-items-center d-flex'>
                            <label htmlFor={`otros_${index}`} className='sr-only' />
                            <textarea
                              id={`otros_${index}`}
                              name={`otros_${index}`}
                              className='textoarea'
                              value={oferta.otros}
                              onChange={(e) => cambiarOtros(e, index)}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </React.Fragment>
          ))}
        </>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title><strong>Observaciones</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: 'bold', textDecoration: 'underline' }}> Cambios solicitados por cordinador </Modal.Body>
        <Modal.Body>{modalContent}</Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Cerrar
          </Button>

        </Modal.Footer>
      </Modal>

      <Modal show={showSolicitudModal} onHide={handleCloseSolicitudModal}>
        <Modal.Header closeButton>
          <Modal.Title>Solicitar Más Horas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>¿Deseas solicitar más horas para el módulo <strong>{solicitudModuloNombre}</strong>?</p>
            <TextField
              fullWidth
              variant='outlined'
              label='Comentario'
              value={solicitudComentario}
              onChange={(e) => setSolicitudComentario(e.target.value)}
              multiline
              rows={4}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseSolicitudModal}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={enviarSolicitud}>
            Enviar Solicitud
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer closeOnClick />
    </>
  )
}
