import { Navbar } from './Navbar'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
const NavbarProfesor = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [nombre,setnombre] = useState("por defecto");
  useEffect(() => {
    // Código que se ejecuta una vez después de que el componente se monta
    const ObtenerDatos = async () => {
      try {
        const response = await axiosInstance.get('Datos/');
        console.log(response.data);
        setnombre(response.data.nombre_completo)
        
        console.log(response.data.nombre_completo)
      } catch (error) {
        setError(error);
        console.log(error)
      }
    };

    ObtenerDatos();
  }, []);


  return (
    <Navbar nombreUsuario={nombre}>
      
      <NavLink
        to='/PublicarAyudantias'
        className={({ isActive }) =>
          'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
      >
        {' '}
        Publicar{' '}
      </NavLink>
      <NavLink
        to='/VerPostulantes'
        className={({ isActive }) =>
          'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
      >
        {' '}
        Postulantes{' '}
      </NavLink>
      <NavLink
        to='/DatosProfesor'
        className={({ isActive }) =>
          'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
      >
        {' '}
        Datos Personales{' '}
      </NavLink>

    </Navbar>
  )
}

export default NavbarProfesor
