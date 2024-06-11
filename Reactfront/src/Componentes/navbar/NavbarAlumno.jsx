import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const NavbarAlumno = () => {
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
        to='/OfertasAyudantias'
        className={({ isActive }) =>
          'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
      >
        {' '}
        Oferta ayudantias{' '}
      </NavLink>
      <NavLink
        to='/Resultados'
        className={({ isActive }) =>
          'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
      >
        {' '}
        Resultados{' '}
      </NavLink>
      <NavLink
        to='/DatosPersonales'
        className={({ isActive }) =>
          'btn color-btn' + (isActive ? ' boton-seleccionado' : '')}
      >
        {' '}
        Datos Personales{' '}
      </NavLink>
    </Navbar>
  );
}

export default NavbarAlumno;
