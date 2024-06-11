import 'bootstrap/dist/css/bootstrap.min.css'
import '../App/App.css'
import NavbarAlumno from '../../Componentes/navbar/NavbarAlumno'
import { NavLink } from 'react-router-dom'
import TablaAlumno from '../../Componentes/Tablaejemplo/TablaAlumno'
import TablaSimplev2 from '../../Componentes/Tablaejemplo/TablaSimplev2'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'


const Resultados = () => {


  const Tablatitulos = ['Asignatura', 'Docente', 'Estado', 'Horas','']

  const [datosResultadospostula2 , setdatosResultadospostula2] = useState([])

  const [horas,sethoras] = useState(0)

  const datosResultadospostula = [
    {
      id:1,
      Asignatura:'Introduccion a la programacion - seccion B',
      Docente:'Daniel moreno',
      Estado:'seleccionado',
      Horas:'12',
      BotonPostulantes: {
        titulo: 'Comunicarse',
        funcion: () => {
          console.log("correo docente ")
        }
      }
    },

    {
      id:2,
      Asignatura:'Pensamiento computacional - seccion B',
      Docente:'Daniel moreno',
      Estado:'No seleccionado',
      Horas:'8',
      BotonPostulantes: {
        titulo: 'Comunicarse',
        funcion: () => {
          console.log("correo docente ")
        }
      }
    },
    {
      id:3,
      Asignatura:'Interfaz humano computador - seccion B',
      Docente:'Luis silvestre',
      Estado:'No seleccionado',
      Horas:'8',
      BotonPostulantes: {
        titulo: 'Comunicarse',
        funcion: () => {
          console.log("correo docente ")
        }
      }
    },

  ]

  useEffect(() => {
    
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('/Postulaciones/');
        console.log(response.data);
        const newData = response.data.map(item => ({
          
          id:item.id_postulacion,
          Asignatura:item.modulo,
          Docente:item.profesor,
          Estado:item.estado? 'seleccionado': 'No seleccionado',
          Horas:item.horas,
          BotonPostulantes: {
            titulo: 'Comunicarse',
            funcion: () => {
              alert('correo profesor: '+item.correo_profesor)
            }
          },


          
        }));
        setdatosResultadospostula2(newData);
      } catch (error) {
        setError(error);
      }
    };

    const ObtenerDatosHoras = async () => {
      try {
        const response = await axiosInstance.get('HorasAceptadas/');
        console.log(response.data);
        
        sethoras(response.data.suma_horas_aceptadas !== null ? response.data.suma_horas_aceptadas : 0 );
      } catch (error) {
        setError(error);
      }
    };

    ObtenerDatosHoras();
    ObtenerDatos();
  }, []);


  return (
    <>
   
    <div className='principal'>
      <NavbarAlumno/>

      <div className='container Componente '>
        <TablaSimplev2 rows={datosResultadospostula2} titulos={Tablatitulos}/>
      </div>

      <div className='container Componente '>
        <div className='row'>
          <div className='col-2' >
            <h6 className='letra'>Horas aceptadas</h6>
            <div className='linea'></div>
          </div>
        
          <div className='col'>
            <div className='muestradatos d-flex justify-content-center align-items-center'>{horas}</div>
          </div>

        </div>
      </div>
    </div>

    </>
  )
}

export default Resultados