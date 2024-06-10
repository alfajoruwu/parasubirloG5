import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import './Tabla.css'
import './TablaSimplev2.css'
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance'
function Row (props) {
  const { row, rowIndex, data , updateRow } = props
  const [rowdef,setrowdef] = React.useState(row)
  
  // Este estado se utiliza para controlar el Collapse de la primera fila.
  const [open, setOpen] = React.useState(false)
  // Este estado controlará el Collapse de las celdas individuales.
  const [openCells, setOpenCells] = React.useState(
    Array.from({ length: row.Nayudantes }, () => false)
  )
  // Estado para seleccionar los ayudantes
  const [ayudantes, setAyudantes] = React.useState(1)

  ///////////////////////////////////////////////////////////////////////
  const [Nota,SetNota] = React.useState(1)
  const [Comentario,SetComentario] = React.useState("Sin comentarios")
  
    const AlertaError = () => {
      alert('Comentario vacio')
    }

    const AlertaExito = (nombre_ramo) => {
      alert('se realizo correctamente la postulacion de "'+nombre_ramo+'"')
    }

    


    const LlenarDatos = async (comentario,id_oferta,asignatura) => {
      try {
        const response = await axiosInstance.patch('Ofertas/'+id_oferta+'/', {
          observaciones: comentario,
          'estado':false,
          
        });
        AlertaExito(asignatura)
        console.log(response.data);
        window.location.reload()

      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
      }
    }

    const publicar = async (id_oferta) => {
      try {
        console.log(id_oferta)
        const response = await axiosInstance.patch('Ofertas/'+id_oferta+'/', {
          'estado':true,
        });
        alert("se publico la ayudantia")
        console.log(response.data);
        window.location.reload()

      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
      }
    }


  
    const ObtenerValores = async (rowIndex, row) => {
      console.log("Botón de la fila", rowIndex, "presionado");
      console.log(row);
      
      try {
        var comentario = prompt("Ingrese una observacion para "+row.Asignatura+" del profesor: "+row.NombreProfesor+" y de la ayudantia de: "+row.HorasTotales+ " horas.", "");
        
        if (comentario === null) {
          // Usuario hizo clic en "Cancelar"
          //alert("Operación cancelada");
        } else if (comentario === "") {
          // Usuario hizo clic en "Aceptar" pero dejó el campo vacío
          //throw new Error("comentario vacio");
        } else {
          // Usuario ingresó un comentario y hizo clic en "Aceptar"
          LlenarDatos(comentario,row.id,row.Asignatura);

     
        }
      } catch (error) {
        AlertaError();
        
      }
    };


    const ObtenerValores2 = async (rowIndex, row) => {
      console.log("Botón de la fila", rowIndex, "presionado");
      console.log(row);
      
      try {
          publicar(row.id);

        
      } catch (error) {
        AlertaError();
        
      }
    };
    

  const cambiarAyudantes = (e) => {
    setAyudantes(e.target.value)
  }
  // Función para manejar el clic en una celda individual
  const toggleCell = (index) => {
    setOpenCells(openCells.map((open, cellIndex) => (index === cellIndex ? !open : open)))
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
      {/*esta linea mata el ultimo elemento para guardarlo como id*/}
      {Object.keys(row).map((key, index, array) => (
        // Comprobar si el índice actual es el último
        index !== array.length - 1 && (
          <TableCell key={index}>
            <div className={index === 0 ? 'primero container justify-content-center align-items-center d-flex' : 'demas container justify-content-center align-items-center d-flex'}>
              {row[key]}
            </div>
          </TableCell>
        )
      ))}
        


        <TableCell>
        <button className='btn color-btn' onClick={(e) => { e.stopPropagation(); ObtenerValores(rowIndex,row); }}>Observaciones</button>
        </TableCell>


        <TableCell>
        <button className='btn color-btn' onClick={(e) => { e.stopPropagation(); ObtenerValores2(rowIndex,row); }}>Publicar</button>
        </TableCell>

      </TableRow>

      <TableRow> 
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small' aria-label='purchases'>
                <TableBody>
                  <TableCell>
                  <div className='container interior'>
                    <div className='col'>
                      <div className='titulo container justify-content-center align-items-center d-flex'>Disponibilidad</div>
                      <div>{data.find(item => item.id === row.id)?.disponibilidad}</div>
                    </div>
                  </div>
                </TableCell>

                    <TableCell>
                        <div className='container interior'>
                            <div className='col'>
                                <div className='titulo container justify-content-center align-items-center d-flex'>Nota minima</div>
                                <div>{data.find(item => item.id === row.id)?.nota_minima} </div>
                            </div>
                        </div>
                    </TableCell>

                    <TableCell>
                        <div className='container interior'>
                            <div className='col'>
                                <div className='titulo container justify-content-center align-items-center d-flex'>Tareas</div>
                                <div>{data.find(item => item.id === row.id)?.tareas}</div>
                                
                            </div>
                        </div>
                    </TableCell>

                    <TableCell>
                        <div className='container'>
                            <div className='col interior'>
                                <div className='titulo container justify-content-center align-items-center d-flex'>Otros</div>
                                <div>{data.find(item => item.id === row.id)?.otros}</div>
                            </div>
                        </div>
                    </TableCell>


                    <TableCell>
                        <div className='container'>
                            <div className='col interior'>
                                <div className='titulo container justify-content-center align-items-center d-flex'>Observacion</div>
                                <div>{data.find(item => item.id === row.id)?.observaciones}</div>
                            </div>
                        </div>
                    </TableCell>


                    
                    
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function TablaAlumno ({ rows, titulos }) {
  
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState([]);


  React.useEffect(() => {
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Ofertas/');
        console.log(response.data);
        const newData = response.data.map(item => ({
          disponibilidad:item.disponibilidad,
          nota_minima:item.nota_mini,
          tareas: item.tareas,
          otros: item.otros,
          observaciones: item.observaciones === ""? "no hay observacion":item.observaciones,
          id: item.id
        }));
        setData(newData);
      } catch (error) {
        setError(error);
      }
    };

    ObtenerDatos();
  }, []);


  return (
    <TableContainer >
      <Table className="custom-table">
        <TableHead>
          <TableRow>
            {Object.keys(titulos).map((titulo, index) => (
              <TableCell key={index}>{titulos[titulo]} <div className='linea'></div></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row key={row.id} row={row} data={data} rowIndex={index} />
          ))}
        </TableBody>  
      </Table>
    </TableContainer>
  )
}
