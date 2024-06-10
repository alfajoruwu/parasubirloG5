import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import * as XLSX from 'xlsx'
import axiosinstance from '../../../utils/axiosInstance'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CsvUploadPopup = ({ show, onClose, updateModules }) => {
  const [jsonData, setJsonData] = useState([])
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (evt) => {
      const data = evt.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      // Filtrar solo las columnas de "Curso", "Sección" y "Horas"
      jsonData = jsonData.map(row => ({
        Curso: row[1], // Columna "Curso"
        Seccion: row[2],
        Horas: row[3] // Columna "Horas"
      }))

      jsonData = jsonData.slice(1)
      // Eliminar filas donde "Curso" es undefined
      jsonData = jsonData.filter(row => row.Curso !== undefined)

      setJsonData(jsonData)
      setError(null) // Reset error state when a new file is selected
      toast.success('Archivo leido correctamente', { position: 'bottom-right' })
      console.log(jsonData)
    }

    reader.onerror = () => {
      setError('Error al leer el archivo')
      toast.error('Error al leer el archivo', { position: 'bottom-right' })
    }

    reader.readAsBinaryString(file)
  }

  const handleUpload = () => {
    axiosinstance.post('Modulos/', jsonData)
      .then(response => {
        console.log('Data uploaded successfully:', response.data)
        updateModules()
        onClose()
        toast.success('Datos subidos exitosamente', { position: 'bottom-right' })
      })
      .catch(error => {
        console.error('Error uploading data:', error)
        toast.error('Ha ocurrido un error al subir el archivo. Por favor, intenta nuevamente.', { position: 'bottom-right' })
      })
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Subir archivo CSV</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant='danger'>{error}</Alert>}
        <input type='file' accept='.xlsx' onChange={handleFileChange} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          Cerrar
        </Button>
        <Button variant='primary' onClick={handleUpload}>
          Subir
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CsvUploadPopup
