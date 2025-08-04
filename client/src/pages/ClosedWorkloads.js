import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClosedWorkloads = () => {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'endTime', direction: 'desc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/jobs/completed');
        setCompletedJobs(response.data);
      } catch (error) {
        console.error("Error fetching completed jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const sortedJobs = [...completedJobs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.header}>
          <span style={{ color: '#f0f' }}>CLOSED_WORKLOADS</span>
        </h2>
        <div style={styles.sortControls}>
          <span style={styles.sortLabel}>SORT_BY:</span>
          <button 
            style={styles.sortButton}
            onClick={() => requestSort('endTime')}
          >
            TIME {sortConfig.key === 'endTime' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button 
            style={styles.sortButton}
            onClick={() => requestSort('duration')}
          >
            DURATION {sortConfig.key === 'duration' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={styles.loading}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#f0f', marginTop: '10px' }}>ACCESSING ARCHIVES...</p>
        </div>
      ) : (
        <div style={styles.jobsGrid}>
          {sortedJobs.map((job, index) => (
            <div key={index} style={styles.jobCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.jobTitle}>{job.partName}</h3>
                <div style={styles.jobId}>JOB_ID: <span style={{ color: '#0ff' }}>{job.jobId}</span></div>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>MACHINE:</span>
                  <span style={{ color: '#ff0' }}>{job.machineName}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>DURATION:</span>
                  <span style={{ color: '#0f0' }}>{formatDuration(job.duration)}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>COMPLETED:</span>
                  <span style={{ color: '#f0f' }}>
                    {new Date(job.endTime).toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <div style={styles.statusBadge}>
                  ARCHIVED
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
    fontFamily: '"Courier New", monospace',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '0 0 10px #f0f',
    letterSpacing: '2px',
    margin: '0',
  },
  sortControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  sortLabel: {
    color: '#aaa',
    fontSize: '0.9rem',
  },
  sortButton: {
    background: 'rgba(120, 0, 120, 0.2)',
    color: '#f0f',
    border: '1px solid #f0f',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      background: 'rgba(120, 0, 120, 0.4)',
      boxShadow: '0 0 10px #f0f',
    }
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  jobCard: {
    background: 'rgba(40, 0, 40, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 0, 255, 0.3)',
    boxShadow: '0 0 15px rgba(255, 0, 255, 0.1)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    ':hover': {
      boxShadow: '0 0 25px rgba(255, 0, 255, 0.3)',
      transform: 'translateY(-5px)',
    }
  },
  cardHeader: {
    padding: '1.2rem',
    borderBottom: '1px solid rgba(255, 0, 255, 0.2)',
  },
  jobTitle: {
    color: '#f0f',
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
  statusBadge: {
    display: 'inline-block',
    background: 'rgba(255, 0, 255, 0.1)',
    color: '#f0f',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    border: '1px solid #f0f',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
  }
};

export default ClosedWorkloads;