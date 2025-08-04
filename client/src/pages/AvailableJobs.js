import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, completedRes] = await Promise.all([
          axios.get('https://machine-iq-backend.vercel.app/api/jobcards'),
          axios.get('https://machine-iq-backend.vercel.app/api/jobs/completed')
        ]);
        setJobs(jobsRes.data);
        setCompleted(completedRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const isCompleted = (jobId) => completed.some(c => c.jobId === jobId);
  const filteredJobs = jobs.filter(job => !isCompleted(job.jobId));

  return (
    <div className="cyberpunk-container" style={styles.container}>
      <h2 className="neon-text" style={styles.header}>
        <span style={{ color: '#0ff' }}>AVAILABLE_JOBS</span>
      </h2>
      
      <p style={styles.subtext}>
        TO INITIATE JOB PROCESSING, ACCESS <Link to="/open-workloads" style={styles.link}>OPEN_WORKLOADS</Link>
      </p>

      {isLoading ? (
        <div style={styles.loading}>
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#0ff', marginTop: '10px' }}>LOADING JOB DATABASE...</p>
        </div>
      ) : (
        <div className="row" style={styles.jobsGrid}>
          {filteredJobs.map((job, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="job-card" style={styles.jobCard}>
                <div className="card-body">
                  <h5 style={styles.jobTitle}>{job.partName}</h5>
                  <div style={styles.jobInfo}>
                    <p style={styles.infoLine}>
                      <span style={styles.infoLabel}>MACHINE:</span> 
                      <span style={{ color: '#ff0' }}> {job.machineName}</span>
                    </p>
                    <p style={styles.infoLine}>
                      <span style={styles.infoLabel}>JOB_ID:</span> 
                      <span style={{ color: '#0f0' }}> {job.jobId}</span>
                    </p>
                    <p style={styles.infoLine}>
                      <span style={styles.infoLabel}>STATUS:</span> 
                      <span style={{ color: '#0ff' }}> READY</span>
                    </p>
                  </div>
                  <div style={styles.cardFooter}>
                    <Link 
                      to={`/open-workloads?jobId=${job.jobId}`} 
                      style={styles.actionButton}
                    >
                      INITIATE PROCESS
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Cyberpunk styling
const styles = {
  container: {
    background: 'linear-gradient(135deg, #111 0%, #1a1a2e 100%)',
    minHeight: '100vh',
    padding: '2rem',
    color: '#fff',
  },
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '0 0 10px #0ff',
    marginBottom: '1.5rem',
    letterSpacing: '2px',
  },
  subtext: {
    color: '#aaa',
    marginBottom: '2rem',
    fontSize: '1.1rem',
  },
  link: {
    color: '#ff0',
    textDecoration: 'none',
    fontWeight: 'bold',
    textShadow: '0 0 5px rgba(255, 255, 0, 0.5)',
    ':hover': {
      textShadow: '0 0 10px #ff0',
    }
  },
  jobsGrid: {
    marginTop: '1rem',
  },
  jobCard: {
    background: 'rgba(20, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    height: '100%',
    ':hover': {
      boxShadow: '0 0 25px rgba(0, 255, 255, 0.4)',
      transform: 'translateY(-5px)',
    }
  },
  jobTitle: {
    color: '#0ff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
    paddingBottom: '0.5rem',
  },
  jobInfo: {
    marginBottom: '1.5rem',
  },
  infoLine: {
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  infoLabel: {
    color: '#aaa',
    fontWeight: 'bold',
    marginRight: '0.5rem',
  },
  cardFooter: {
    marginTop: '1rem',
  },
  actionButton: {
    display: 'block',
    background: 'rgba(0, 255, 255, 0.1)',
    color: '#0ff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    textDecoration: 'none',
    border: '1px solid #0ff',
    transition: 'all 0.3s',
    ':hover': {
      background: 'rgba(0, 255, 255, 0.3)',
      boxShadow: '0 0 10px #0ff',
    }
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
  }
};

export default AvailableJobs;
