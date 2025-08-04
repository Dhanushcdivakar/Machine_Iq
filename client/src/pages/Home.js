import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [completed, setCompleted] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [completedRes, jobsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/jobs/completed'),
          axios.get('http://localhost:5001/api/jobcards')
        ]);
        setCompleted(completedRes.data);
        setJobs(jobsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const ongoing = jobs.length - completed.length;
  const efficiency = jobs.length > 0 ? Math.round((completed.length / jobs.length) * 100) : 0;

  return (
    <div className="cyberpunk-bg" style={styles.background}>
      <div className="container text-center p-5">
        {/* **Futuristic Header with Glow** */}
        <h1 className="neon-text flicker" style={styles.neonHeader}>
          WELCOME TO <span style={{ color: '#0ff' }}>MACHINE_IQ</span>
        </h1>
        <p className="lead mb-4" style={{ color: '#aaa', textShadow: '0 0 5px rgba(0,255,255,0.3)' }}>
          REAL-TIME FACTORY ANALYTICS | CYBERNETIC OPERATIONS MONITOR
        </p>

        {/* **Navigation Buttons (Hover Glow)** */}
        <div className="row justify-content-center mb-5">
          {[
            { label: "AVAILABLE JOBS", path: "/available-jobs", color: "#0ff" },
            { label: "OPEN WORKLOADS", path: "/open-workloads", color: "#ff0" },
            { label: "DASHBOARD", path: "/dashboard", color: "#0f0" },
            { label: "SYSTEM LOGS", path: "/logs", color: "#f0f" }
          ].map((btn, index) => (
            <div key={index} className="col-md-3 mb-3">
              <a 
                href={btn.path} 
                className="btn btn-outline-dark w-100"
                style={{ 
                  ...styles.glassButton,
                  borderColor: btn.color,
                  boxShadow: `0 0 10px ${btn.color}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${btn.color}`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 10px ${btn.color}`}
              >
                <span style={{ color: btn.color }}>{btn.label}</span>
              </a>
            </div>
          ))}
        </div>

        {/* **Main Stats Panel (Glowing Border + Animated Numbers)** */}
        <div className="glass-panel" style={styles.glassPanel}>
          <h4 className="neon-text" style={{ ...styles.neonText, color: '#0ff' }}>SYSTEM SNAPSHOT</h4>
          
          <div className="row justify-content-center mt-4">
            <div className="col-md-3 mb-4">
              <div className="stat-card" style={styles.statCard}>
                <div className="stat-value" style={{ ...styles.statValue, color: '#0ff' }}>
                  {isLoading ? '...' : jobs.length}
                </div>
                <div className="stat-label" style={styles.statLabel}>TOTAL JOBS</div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-card" style={styles.statCard}>
                <div className="stat-value" style={{ ...styles.statValue, color: '#ff0' }}>
                  {isLoading ? '...' : ongoing}
                </div>
                <div className="stat-label" style={styles.statLabel}>ONGOING</div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-card" style={styles.statCard}>
                <div className="stat-value" style={{ ...styles.statValue, color: '#0f0' }}>
                  {isLoading ? '...' : completed.length}
                </div>
                <div className="stat-label" style={styles.statLabel}>COMPLETED</div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-card" style={styles.statCard}>
                <div className="stat-value" style={{ ...styles.statValue, color: '#f0f' }}>
                  {isLoading ? '...' : `${efficiency}%`}
                </div>
                <div className="stat-label" style={styles.statLabel}>EFFICIENCY</div>
              </div>
            </div>
          </div>
        </div>

        {/* **Optional: Real-Time Activity Feed (Cyberpunk Terminal Style)** */}
        <div className="mt-5 terminal-box" style={styles.terminal}>
          <div className="terminal-header" style={styles.terminalHeader}>
            <span style={{ color: '#0f0' }}>LIVE_ACTIVITY_FEED</span>
          </div>
          <div className="terminal-content" style={styles.terminalContent}>
            {isLoading ? (
              <p style={{ color: '#0ff' }}>INITIALIZING SYSTEMS...</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {completed.slice(0, 5).map((job, i) => (
                  <li key={i} style={{ color: '#aaa', marginBottom: '5px' }}>
                    JOB_{job.id} <span style={{ color: '#0f0' }}>COMPLETED</span> AT {new Date().toLocaleTimeString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// **Cyberpunk-Inspired CSS-in-JS Styles**
const styles = {
  background: {
    background: 'linear-gradient(135deg, #111 0%, #1a1a2e 100%)',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: '"Courier New", monospace',
  },
  neonHeader: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    textShadow: '0 0 10px #0ff, 0 0 20px #0ff',
    marginBottom: '20px',
    letterSpacing: '2px',
  },
  neonText: {
    textShadow: '0 0 5px currentColor',
    fontWeight: 'bold',
  },
  glassButton: {
    background: 'rgba(20, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '5px',
    padding: '12px',
    transition: 'all 0.3s',
    border: '1px solid',
    fontWeight: 'bold',
  },
  glassPanel: {
    background: 'rgba(10, 10, 30, 0.5)',
    backdropFilter: 'blur(8px)',
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid #0ff',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
    marginBottom: '30px',
  },
  statCard: {
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '15px',
    border: '1px solid rgba(0, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  statLabel: {
    color: '#aaa',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
  },
  terminal: {
    background: 'rgba(0, 10, 20, 0.8)',
    border: '1px solid #0f0',
    borderRadius: '5px',
    color: '#0f0',
    padding: '0',
    overflow: 'hidden',
  },
  terminalHeader: {
    background: 'rgba(0, 20, 10, 0.5)',
    padding: '10px',
    borderBottom: '1px solid #0f0',
    fontWeight: 'bold',
  },
  terminalContent: {
    padding: '15px',
    minHeight: '100px',
    fontFamily: '"Courier New", monospace',
  },
};

export default Home;