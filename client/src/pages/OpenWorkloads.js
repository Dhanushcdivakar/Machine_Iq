import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OpenWorkloads = () => {
  const [jobs, setJobs] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, completedRes, activeRes] = await Promise.all([
          axios.get('https://machine-iq-backend.vercel.app/api/jobcards'),
          axios.get('https://machine-iq-backend.vercel.app/api/jobs/completed'),
          axios.get('https://machine-iq-backend.vercel.app/api/jobs/active')
        ]);

        setJobs(jobsRes.data);
        setCompleted(completedRes.data);

        if (activeRes.data) {
          setCurrentJobId(activeRes.data.jobId);
          setStatusMessage(`RESUMED ACTIVE JOB ${activeRes.data.jobId}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatusMessage('DATABASE CONNECTION FAILED');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const isCompleted = (jobId) => completed.some(c => c.jobId === jobId);
  const isActive = (jobId) => currentJobId === jobId;

  const startJob = async (job) => {
    try {
      setStatusMessage(`INITIATING JOB ${job.jobId}...`);
      await axios.post('https://machine-iq-backend.vercel.app/api/jobs/start', job);
      setCurrentJobId(job.jobId);
      setStatusMessage(`JOB ${job.jobId} ACTIVE | MACHINE: ${job.machineName}`);
    } catch (error) {
      setStatusMessage('ACTIVATION FAILED: SYSTEM ERROR');
      console.error("Error starting job:", error);
    }
  };

  const stopJob = async (jobId) => {
    try {
      setStatusMessage(`TERMINATING JOB ${jobId}...`);
      await axios.post('https://machine-iq-backend.vercel.app/api/jobs/stop', { jobId });
      setCurrentJobId(null);
      const completedRes = await axios.get('https://machine-iq-backend.vercel.app/api/jobs/completed');
      setCompleted(completedRes.data);
      setStatusMessage(`JOB ${jobId} ARCHIVED`);
    } catch (error) {
      setStatusMessage('TERMINATION FAILED: SYSTEM ERROR');
      console.error("Error stopping job:", error);
    }
  };

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
                    color: isActive(job.jobId) ? '#0f0' : '#ff0',
                    textShadow: isActive(job.jobId) ? '0 0 5px #0f0' : 'none'
                  }}>
                    {isActive(job.jobId) ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                {isActive(job.jobId) ? (
                  <button
                    style={{ ...styles.button, ...styles.stopButton }}
                    onClick={() => stopJob(job.jobId)}
                  >
                    TERMINATE PROCESS
                  </button>
                ) : currentJobId ? (
                  <button
                    style={{
                      ...styles.button,
                      opacity: 0.4,
                      cursor: 'not-allowed',
                      backgroundColor: '#333',
                      color: '#999',
                      border: '1px solid #999'
                    }}
                    disabled
                  >
                    JOB LOCKED
                  </button>
                ) : (
                  <button
                    style={{ ...styles.button, ...styles.startButton }}
                    onClick={() => startJob(job)}
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
