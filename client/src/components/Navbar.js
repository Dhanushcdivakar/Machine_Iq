import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4" style={styles.navbar}>
      <div className="container-fluid">
        <Link 
          className="navbar-brand" 
          to="/" 
          style={styles.neonBrand}
        >
          <span style={{ textShadow: '0 0 10px #0ff' }}>MACHINE_IQ</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={styles.toggler}
        >
          <span className="navbar-toggler-icon" style={styles.togglerIcon}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {[
              { path: "/available-jobs", label: "AVAILABLE_JOBS", color: "#0ff" },
              { path: "/open-workloads", label: "OPEN_WORKLOADS", color: "#ff0" },
              { path: "/closed-workloads", label: "CLOSED_WORKLOADS", color: "#f0f" },
              { path: "/dashboard", label: "DASHBOARD", color: "#0f0" }
            ].map((item, index) => (
              <li key={index} className="nav-item mx-2">
                <Link 
                  className="nav-link" 
                  to={item.path}
                  style={{ ...styles.navLink, color: item.color }}
                  onMouseEnter={(e) => e.currentTarget.style.textShadow = `0 0 10px ${item.color}`}
                  onMouseLeave={(e) => e.currentTarget.style.textShadow = 'none'}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Cyberpunk styling
const styles = {
  navbar: {
    background: 'rgba(10, 10, 20, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)'
  },
  neonBrand: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    transition: 'all 0.3s',
  },
  navLink: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.9rem',
    transition: 'all 0.3s',
    padding: '8px 12px',
    borderRadius: '4px',
  },
  toggler: {
    border: '1px solid rgba(0, 255, 255, 0.4)',
  },
  togglerIcon: {
    filter: 'drop-shadow(0 0 2px #0ff)',
  }
};

export default Navbar;