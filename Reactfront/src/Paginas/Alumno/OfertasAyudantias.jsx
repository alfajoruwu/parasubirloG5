import 'bootstrap/dist/css/bootstrap.min.css'
import '../App/App.css'
import NavbarAlumno from '../../Componentes/navbar/NavbarAlumno'
import TablaAlumno from '../../Componentes/Tablaejemplo/TablaAlumno'
import React, { useState, useEffect } from 'react'
// import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance'

const titulos = {
  Asignatura: 'Asignatura',
  NombreProfesor: 'Nombre profesor',
  HorasTotales: 'Horas totales',
  Nota: 'Nota de aprobacion',
  '': 'Postular'
}

const OfertasAyudantias = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [hourFilter, setHourFilter] = useState({ value: '', operator: '' })

  useEffect(() => {
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Ofertas/')
        console.log(response.data)
        const newData = response.data.map(item => ({
          Asignatura: item.modulo,
          NombreProfesor: item.profesor,
          HorasTotales: item.horas_ayudantia,
          id: item.id
        }))
        setData(newData)
      } catch (error) {
        setError(error)
      }
    }

    ObtenerDatos()
  }, [])

  const handleFilter = (e) => {
    const value = e.target.value
    setFilter(value)
  }

  const handleHourFilterValue = (e) => {
    const value = e.target.value
    setHourFilter({ ...hourFilter, value })
  }

  const handleHourFilterOperator = (e) => {
    const value = e.target.value
    setHourFilter({ ...hourFilter, operator: value })
  }

  // Obtener opciones únicas para el dropdown de módulos
  const uniqueModules = [...new Set(data.map(item => item.Asignatura))]

  // Filtrar datos
  const filteredData = data.filter(item => {
    // Filtro de módulos
    if (filter && item.Asignatura !== filter) return false
    // Filtro de horas totales
    if (hourFilter.value !== '') {
      const hours = parseInt(hourFilter.value)
      if (hourFilter.operator === '<') {
        return item.HorasTotales < hours
      } else if (hourFilter.operator === '>') {
        return item.HorasTotales > hours
      } else if (hourFilter.operator === '=') {
        return item.HorasTotales === hours
      }
    }
    return true
  })

  return (
    <div className='principal'>
      <NavbarAlumno />
      <div className='container Componente'>
        <div className='row mb-3'>
          <div className='col-md-6'>
            <label htmlFor='filtro-modulo' className='form-label'>Filtrar por módulo:</label>
            <select
              className='form-control'
              id='filtro-modulo'
              value={filter}
              onChange={handleFilter}
            >
              <option value=''>Todos</option>
              {uniqueModules.map((module, index) => (
                <option key={index} value={module}>{module}</option>
              ))}
            </select>
          </div>
          <div className='col-md-6'>
            <label htmlFor='filtro-horas' className='form-label'>Filtrar por horas totales:</label>
            <div className='d-flex align-items-center'>
              <select
                className='form-control me-2'
                value={hourFilter.operator}
                onChange={handleHourFilterOperator}
              >
                <option value=''>Seleccionar</option>
                <option value='='>Igual a</option>
                <option value='<'>Menor que</option>
                <option value='>'>Mayor que</option>
              </select>
              <input
                type='number'
                className='form-control'
                placeholder='Cantidad de horas'
                value={hourFilter.value}
                onChange={handleHourFilterValue}
              />
            </div>
          </div>
        </div>
        {error
          ? (
            <div className='alert alert-danger' role='alert'>
              Error al cargar los datos: {error.message}
            </div>
            )
          : (
            <TablaAlumno titulos={titulos} rows={filteredData} />
            )}
      </div>
    </div>
  )
}

export default OfertasAyudantias
