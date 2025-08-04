import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [completed, setCompleted] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [completedRes, allJobsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/jobs/completed'),
          axios.get('http://localhost:5001/api/jobcards')
        ]);
        setCompleted(completedRes.data);
        setAllJobs(allJobsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const openJobs = allJobs.filter(job => !completed.find(c => c.jobId === job.jobId));
  const efficiency = allJobs.length > 0 ? Math.round((completed.length / allJobs.length) * 100) : 0;

  // Format duration from "HH:MM:SS" to hours
  const formatDuration = (duration) => {
    if (!duration) return 0;
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours + (minutes / 60) + (seconds / 3600);
  };

  // Chart data
  const pieData = {
    labels: ['OPEN WORKLOADS', 'ARCHIVED JOBS'],
    datasets: [{
      data: [openJobs.length, completed.length],
      backgroundColor: ['rgba(0, 240, 255, 0.7)', 'rgba(57, 255, 20, 0.7)'],
      borderColor: ['#00f0ff', '#39ff14'],
      borderWidth: 2,
      hoverBackgroundColor: ['#00f0ff', '#39ff14'],
    }]
  };

  const barData = {
    labels: completed.slice(0, 10).map(job => `JOB_${job.jobId}`),
    datasets: [{
      label: 'DURATION (HOURS)',
      data: completed.slice(0, 10).map(job => formatDuration(job.duration)),
      backgroundColor: 'rgba(142, 68, 173, 0.7)',
      borderColor: 'rgba(142, 68, 173, 1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(192, 57, 43, 0.7)',
    }]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: {
            family: '"Courier New", monospace',
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        color: '#fff',
        font: {
          family: '"Courier New", monospace',
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#aaa'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#aaa'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>
          <span style={{ color: '#0ff' }}>SYSTEM_DASHBOARD</span>
        </h1>
        <div style={styles.tabs}>
          {['overview', 'performance', 'analytics'].map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tabButton,
                ...(activeTab === tab ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div style={styles.loading}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#0ff', marginTop: '10px' }}>INITIALIZING DATASTREAM...</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: '#0ff' }}>{allJobs.length}</div>
              <div style={styles.statLabel}>TOTAL_JOBS</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: '#ff0' }}>{openJobs.length}</div>
              <div style={styles.statLabel}>OPEN_WORKLOADS</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: '#0f0' }}>{completed.length}</div>
              <div style={styles.statLabel}>ARCHIVED_JOBS</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: '#f0f' }}>{efficiency}%</div>
              <div style={styles.statLabel}>SYSTEM_EFFICIENCY</div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={styles.chartsContainer}>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>WORKLOAD_DISTRIBUTION</h3>
              <div style={styles.chartWrapper}>
                <Pie 
                  data={pieData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: 'JOB_STATUS_BREAKDOWN'
                      }
                    }
                  }} 
                />
              </div>
            </div>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>PROCESSING_METRICS</h3>
              <div style={styles.chartWrapper}>
                <Bar 
                  data={barData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: 'TOP_10_JOB_DURATIONS'
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div style={styles.metricsContainer}>
            <div style={styles.metricCard}>
              <h4 style={styles.metricTitle}>RECENT_ACTIVITY</h4>
              <ul style={styles.activityList}>
                {completed.slice(0, 5).map((job, i) => (
                  <li key={i} style={styles.activityItem}>
                    <span style={{ color: '#0ff' }}>JOB_{job.jobId}</span> completed in{' '}
                    <span style={{ color: '#0f0' }}>{formatDuration(job.duration).toFixed(2)}h</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={styles.metricCard}>
              <h4 style={styles.metricTitle}>SYSTEM_STATUS</h4>
              <div style={styles.statusIndicator}>
                <div style={styles.statusPulse}></div>
                <span style={styles.statusText}>OPERATIONAL</span>
              </div>
              <div style={styles.uptime}>
                <span style={styles.uptimeLabel}>UPTIME:</span>
                <span style={styles.uptimeValue}>99.87%</span>
              </div>
            </div>
          </div>
        </>
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
    textShadow: '0 0 10px #0ff',
    letterSpacing: '2px',
    margin: '0',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
  },
  tabButton: {
    background: 'rgba(20, 20, 40, 0.7)',
    color: '#aaa',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontWeight: 'bold',
    ':hover': {
      color: '#0ff',
      borderColor: '#0ff',
    }
  },
  activeTab: {
    background: 'rgba(0, 255, 255, 0.1)',
    color: '#0ff',
    borderColor: '#0ff',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'rgba(20, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    textShadow: '0 0 5px currentColor',
  },
  statLabel: {
    color: '#aaa',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  chartsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  chartCard: {
    background: 'rgba(20, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)',
  },
  chartTitle: {
    color: '#0ff',
    fontSize: '1.2rem',
    marginBottom: '1rem',
    textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
  },
  chartWrapper: {
    height: '300px',
    position: 'relative',
  },
  metricsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  metricCard: {
    background: 'rgba(20, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)',
  },
  metricTitle: {
    color: '#0ff',
    fontSize: '1.1rem',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
    paddingBottom: '0.5rem',
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  activityItem: {
    marginBottom: '0.8rem',
    paddingBottom: '0.8rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '0.9rem',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  statusPulse: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#0f0',
    boxShadow: '0 0 10px #0f0',
    marginRight: '10px',
    animation: 'pulse 1.5s infinite',
  },
  statusText: {
    color: '#0f0',
    fontWeight: 'bold',
  },
  uptime: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  uptimeLabel: {
    color: '#aaa',
  },
  uptimeValue: {
    color: '#0ff',
    fontWeight: 'bold',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
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

export default Dashboard;