import React from 'react'

const NavbarLogin = ({ children, nombreUsuario = 'Anonimo' }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <nav className='navbar navbar-expand-lg custom-navbar-color'>
        <div className='container-fluid'>
          <button
            className='navbar-toggler'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNavAltMarkup'
            aria-controls='navbarNavAltMarkup'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon' />
          </button>

          <div
            className='collapse navbar-collapse'
            id='navbarNavAltMarkup'
          >
            <div className='navbar-nav'>{children}</div>
            <h1>Ingresar</h1>
          </div>

          <div className=''>
            
          </div>
          
        </div>
      </nav>

      <div className='lineaCeleste' />
    </div>
  )
}

export default NavbarLogin