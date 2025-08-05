import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OpenWorkloads = () => {
  // State for the list of available jobs, the currently active job's ID,
  // the list of completed jobs, and UI feedback.
  const [jobs, setJobs] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // The main effect to fetch data from the backend on component mount.
  // This now includes a call to get the active job to ensure persistence.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Promise.all to make all API calls concurrently for efficiency.
        const [jobsRes, completedRes, activeJobRes] = await Promise.all([
          axios.get('https://machine-iq-backend.vercel.app/api/jobcards'),
          axios.get('https://machine-iq-backend.vercel.app/api/jobs/completed'),
          axios.get('https://machine-iq-backend.vercel.app/api/jobs/active')
        ]);
        
        // Update state with fetched data.
        setJobs(jobsRes.data);
        setCompleted(completedRes.data);

        // Check if an active job was returned from the backend.
        const activeJob = activeJobRes.data;
        if (activeJob) {
          // If a job is active, set the state to reflect it.
          setCurrentJobId(activeJob.jobId);
          setStatusMessage(`JOB ${activeJob.jobId} ACTIVE | MACHINE: ${activeJob.machineName}`);
        } else {
          // If no job is active, reset the state and show a default message.
          setCurrentJobId(null);
          setStatusMessage('SYSTEM READY: AWAITING JOB INITIATION');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatusMessage('DATABASE CONNECTION FAILED');
      } finally {
        // Set loading to false once all data is fetched.
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // Helper function to check if a job has been completed.
  const isCompleted = (jobId) => completed.some(c => c.jobId === jobId);

  // Handler to start a new job.
  const startJob = async (job) => {
    try {
      setStatusMessage(`INITIATING JOB ${job.jobId}...`);
      await axios.post('https://machine-iq-backend.vercel.app/api/jobs/start', job);
      // Update the currentJobId state to the newly started job's ID.
      setCurrentJobId(job.jobId);
      setStatusMessage(`JOB ${job.jobId} ACTIVE | MACHINE: ${job.machineName}`);
    } catch (error) {
      setStatusMessage('ACTIVATION FAILED: SYSTEM ERROR');
      console.error("Error starting job:", error);
    }
  };

  // Handler to stop the currently active job.
  const stopJob = async (jobId) => {
    try {
      setStatusMessage(`TERMINATING JOB ${jobId}...`);
      await axios.post('https://machine-iq-backend.vercel.app/api/jobs/stop', { jobId });
      // Clear the currentJobId state, as no job is now active.
      setCurrentJobId(null);
      // Re-fetch the list of completed jobs to update the UI.
      const completedRes = await axios.get('https://machine-iq-backend.vercel.app/api/jobs/completed');
      setCompleted(completedRes.data);
      setStatusMessage(`JOB ${jobId} ARCHIVED`);
    } catch (error) {
      setStatusMessage('TERMINATION FAILED: SYSTEM ERROR');
      console.error("Error stopping job:", error);
    }
  };

  // Filter the jobs to only show those that haven't been completed.
  const activeJobs = jobs.filter(job => !isCompleted(job.jobId));

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        <span style={{ color: '#ff0' }}>OPEN_WORKLOADS</span>
      </h2>

      {statusMessage && (
        <div style={styles.statusBar}>
          <div style={styles.statusText}>{statusMessage}</div>
          <div style={styles.statusPulse}></div>
        </div>
      )}

      {isLoading ? (
        <div style={styles.loading}>
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#ff0', marginTop: '10px' }}>ACCESSING JOB DATABASE...</p>
        </div>
      ) : (
        <div style={styles.jobsGrid}>
          {activeJobs.map((job, index) => (
            <div key={index} style={styles.jobCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.jobTitle}>{job.partName}</h3>
                <div style={styles.jobId}>JOB_ID: <span style={{ color: '#0ff' }}>{job.jobId}</span></div>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>MACHINE:</span>
                  <span style={{ color: '#f0f' }}>{job.machineName}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>STATUS:</span>
                  <span style={{ 
                    color: currentJobId === job.jobId ? '#0f0' : '#ff0',
                    textShadow: currentJobId === job.jobId ? '0 0 5px #0f0' : 'none'
                  }}>
                    {currentJobId === job.jobId ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                {/* Conditionally render the button based on whether this is the active job */}
                {currentJobId === job.jobId ? (
                  <button 
                    style={{ ...styles.button, ...styles.stopButton }}
                    onClick={() => stopJob(job.jobId)}
                  >
                    TERMINATE PROCESS
                  </button>
                ) : (
                  <button 
                    style={{ ...styles.button, ...styles.startButton }}
                    onClick={() => startJob(job)}
                    // This is the key change: disable the button if any job is active.
                    disabled={currentJobId !== null} 
                  >
                    INITIATE PROCESS
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Cyberpunk styling (remains unchanged)
const styles = {
  container: {
    background: 'linear-gradient(135deg, #111 0%, #1a1a2e 100%)',
    minHeight: '100vh',
    padding: '2rem',
    color: '#fff',
    fontFamily: '"Courier New", monospace',
  },
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '0 0 10px #ff0',
    marginBottom: '1.5rem',
    letterSpacing: '2px',
  },
  statusBar: {
    background: 'rgba(20, 20, 40, 0.8)',
    border: '1px solid rgba(255, 255, 0, 0.3)',
    borderRadius: '4px',
    padding: '0.8rem',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  statusText: {
    color: '#ff0',
    fontWeight: 'bold',
    zIndex: 1,
  },
  statusPulse: {
    position: 'absolute',
    right: '10px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#ff0',
    boxShadow: '0 0 10px #ff0',
    animation: 'pulse 1.5s infinite',
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  jobCard: {
    background: 'rgba(30, 30, 60, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 0, 0.3)',
    boxShadow: '0 0 15px rgba(255, 255, 0, 0.1)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    ':hover': {
      boxShadow: '0 0 25px rgba(255, 255, 0, 0.3)',
      transform: 'translateY(-5px)',
    }
  },
  cardHeader: {
    padding: '1.2rem',
    borderBottom: '1px solid rgba(255, 255, 0, 0.2)',
  },
  jobTitle: {
    color: '#ff0',
    fontSize: '1.4rem',
    margin: '0 0 0.5rem 0',
  },
  jobId: {
    color: '#aaa',
    fontSize: '0.8rem',
  },
  cardBody: {
    padding: '1.2rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.8rem',
    fontSize: '0.9rem',
  },
  infoLabel: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  cardFooter: {
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  button: {
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.3s',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  startButton: {
    background: 'rgba(0, 255, 0, 0.1)',
    color: '#0f0',
    border: '1px solid #0f0',
    ':hover': {
      background: 'rgba(0, 255, 0, 0.3)',
      boxShadow: '0 0 15px #0f0',
    }
  },
  stopButton: {
    background: 'rgba(255, 0, 0, 0.1)',
    color: '#f00',
    border: '1px solid #f00',
    ':hover': {
      background: 'rgba(255, 0, 0, 0.3)',
      boxShadow: '0 0 15px #f00',
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

// Add to your global CSS
const globalStyles = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }
`;

export default OpenWorkloads;
