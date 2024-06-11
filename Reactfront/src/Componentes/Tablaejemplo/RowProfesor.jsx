import React, { useEffect, useState } from 'react'
import { TableCell, TableRow } from '@mui/material'

import '../../Paginas/App/App.css'

import TextField from '@mui/material/TextField'
import './Tabla.css'
import './TablaSimplev2.css'
import axiosInstance from '../../utils/axiosInstance'
import TextareaAutosize from '@mui/material/TextareaAutosize'
export default function Row ({ modulo }) {
  const [Nayudantes, setNayudantes] = useState(modulo.ofertas.length)
  const [ofertas, setOfertas] = useState(
    Array.from({ length: Nayudantes }, (_, index) => ({
      disponibilidad: '',
      nota_mini: 5,
      tareas: '',
      otros: '',
      id: null
    }))
  )

  const guardarOfertas = (newOfertas) => {
    setOfertas(newOfertas)
    modulo.ofertas = newOfertas
  }

  const mandarAlBack = (oferta) => {
    if (oferta.id === null) {
      if (oferta.horas_ayudantia === null || oferta.disponibilidad === '' || oferta.nota_mini === null || oferta.tareas === '') {
        return
      }
      oferta.id = undefined
      axiosInstance.post('Ofertas/', {
        modulo: modulo.id,
        horas_ayudantia: oferta.horas_ayudantia,
        disponibilidad: oferta.disponibilidad,
        nota_mini: oferta.nota_mini,
        tareas: oferta.tareas,
        otros: oferta.otros
      }).then(response => {
        oferta.id = response.data.id
      })
    } else {
      axiosInstance.put('Ofertas/' + oferta.id + '/', {
        modulo: modulo.id,
        horas_ayudantia: oferta.horas_ayudantia,
        disponibilidad: oferta.disponibilidad,
        nota_mini: oferta.nota_mini,
        tareas: oferta.tareas,
        otros: oferta.otros
      })
    }
  }

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
        axiosInstance.delete('Ofertas/' + oferta.id)
        oferta.id = null
      }
    }
    )
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

  const [desplegarOferta, setDesplegarOferta] = useState(Array.from({ length: modulo.ofertas.length }, () => false)) // desplegar celdas de cada oferta
  const [desplegarModulo, setDesplegarModulo] = useState(false) // desplegar celdas del modulo

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

  return (
    <>

      <TableRow className=' module-header table-row-margin' onClick={toggleModulo}>
        <TableCell className='primero container justify-content-center align-items-center d-flex'>{modulo.Asignatura}</TableCell>
        <TableCell className='selector '>
          <TextField

            type='number'
            value={Nayudantes}
            onChange={(e) => setNayudantes(e.target.value)}
            onClick={(e) => { e.stopPropagation() }}
            variant='outlined'
            size='small'
            inputProps={{ min: 0 }}
          />

        </TableCell>

        <TableCell className='demas container justify-content-center align-items-center d-flex'> {modulo.HorasTotales}</TableCell>

        <TableCell className=' '>
          <button className=' final btn color-btn'> Mas horas </button>
        </TableCell>

      </TableRow>

      {desplegarModulo && (
        <>
          {ofertas.map((oferta, index) => (

            <React.Fragment key={index}>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className='offer-header' onClick={() => toggleOferta(index)}>
                <TableCell style={{ backgroundColor: '#018d8d' }} className='medio primero container justify-content-center align-items-center d-flex'>Oferta para el ayudante {index + 1}</TableCell>
                <TableCell />
                <TableCell className='selector container'>
                  <TextField
                    type='number' value={oferta.horas_ayudantia} onChange={(e) => cambiarHoras(e.target.value, index)} onClick={(e) => { e.stopPropagation() }} variant='outlined' size='small' inputProps={{ min: 0 }}
                  />
                </TableCell>
              </TableRow>
              {desplegarOferta[index] && (
                <>
                  <TableRow>
                    <TableCell className=''>
                      <div className='container '>
                        <div className='col interior interno' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Disponibilidad </div>

                          <div className='titulo container justify-content-center align-items-center'>
                            <textarea className='textoarea' type='text' value={ofertas[index].disponibilidad} onChange={(e) => cambiarDisponibilidad(e, index)} />
                          </div>

                        </div>
                      </div>

                    </TableCell>
                    <TableCell>
                      <div className='container '>
                        <div className='col interior ' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Nota minima</div>
                          <div className='titulo container justify-content-center align-items-center d-flex'>
                            <TextField style={{ backgroundColor: 'white' }} type='number' value={ofertas[index].nota_mini} onChange={(e) => cambiarNota(e, index)} onClick={(e) => { e.stopPropagation() }} variant='outlined' size='small' inputProps={{ min: 0 }} />

                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className='container '>
                        <div className='col interior' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Tareas</div>
                          <div className='titulo container justify-content-center align-items-center d-flex'>
                            <textarea className='textoarea' type='text' value={ofertas[index].tareas} onChange={(e) => cambiarTareas(e, index)} />
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>

                      <div className='container '>
                        <div className='col interior' style={{ height: '6rem' }}>
                          <div className='titulo container justify-content-center align-items-center d-flex'>Otros</div>
                          <div className='titulo container justify-content-center align-items-center d-flex'>
                            <textarea className='textoarea' type='text' value={ofertas[index].otros} onChange={(e) => cambiarOtros(e, index)} />
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
    </>
  )
}
