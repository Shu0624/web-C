import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function AdminPanel() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const headers = { 'x-admin-id': adminId, 'x-admin-password': password };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { headers });
      if (res.status === 401) { setAuthed(false); setError('Wrong password'); return; }
      const data = await res.json();
      setStats(data);
    } catch { setError('Failed to connect to server'); }
  };

  const fetchRegistrations = async (eventFilter) => {
    setLoading(true);
    try {
      const url = eventFilter && eventFilter !== 'all'
        ? `${API_URL}/admin/registrations?event=${encodeURIComponent(eventFilter)}`
        : `${API_URL}/admin/registrations`;
      const res = await fetch(url, { headers });
      if (res.status === 401) { setAuthed(false); return; }
      const data = await res.json();
      setRegistrations(data);
    } catch { setError('Failed to fetch registrations'); }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { headers: { 'x-admin-id': adminId, 'x-admin-password': password } });
      if (res.ok) {
        setAuthed(true);
      } else {
        setError('Incorrect password');
      }
    } catch {
      setError('Cannot connect to server');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this registration?')) return;
    try {
      await fetch(`${API_URL}/admin/registrations/${id}`, { method: 'DELETE', headers });
      fetchRegistrations(activeFilter);
      fetchStats();
    } catch { alert('Failed to delete'); }
  };

  useEffect(() => {
    if (authed) {
      fetchStats();
      fetchRegistrations('all');
    }
  }, [authed]);

  useEffect(() => {
    if (authed) fetchRegistrations(activeFilter);
  }, [activeFilter]);

  // ─── LOGIN SCREEN ───
  if (!authed) {
    return (
      <div style={styles.page}>
        <div style={styles.loginBox}>
          <h1 style={styles.loginTitle}>🔐 NEXUS Admin</h1>
          <p style={styles.loginSub}>Enter admin credentials to continue</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="email"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Admin email"
              style={styles.input}
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              style={styles.input}
            />
            {error && <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{error}</p>}
            <button type="submit" style={styles.loginBtn}>ENTER</button>
          </form>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ───
  const events = ['Online Coding Platform', 'Blind Coding', 'Startup Pitch', 'E-Sports'];
  const getEventCount = (eventName) => {
    if (!stats) return 0;
    const found = stats.perEvent.find(e => e.event === eventName);
    return found ? found.count : 0;
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.dashTitle}>NEXUS '26 Admin</h1>
            <p style={styles.dashSub}>Registration Dashboard</p>
          </div>
          <button onClick={() => { setAuthed(false); setPassword(''); setAdminId(''); }} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderColor: 'rgba(168, 85, 247, 0.4)' }}>
            <p style={styles.statLabel}>TOTAL REGISTRATIONS</p>
            <p style={styles.statNumber}>{stats?.total || 0}</p>
          </div>
          {events.map(ev => (
            <div key={ev} style={styles.statCard}>
              <p style={styles.statLabel}>{ev.toUpperCase()}</p>
              <p style={styles.statNumber}>{getEventCount(ev)}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterRow}>
          {['all', ...events].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                ...styles.filterBtn,
                ...(activeFilter === f ? styles.filterBtnActive : {}),
              }}
            >
              {f === 'all' ? 'All Events' : f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={styles.tableWrap}>
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.5)', padding: '40px', textAlign: 'center' }}>Loading...</p>
          ) : registrations.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', padding: '40px', textAlign: 'center' }}>No registrations yet</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Roll No</th>
                  <th style={styles.th}>Branch</th>
                  <th style={styles.th}>Mobile</th>
                  <th style={styles.th}>Event</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, i) => (
                  <tr key={reg._id} style={i % 2 === 0 ? {} : { background: 'rgba(255,255,255,0.02)' }}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>{reg.fullName}</td>
                    <td style={styles.td}>{reg.rollNo}</td>
                    <td style={styles.td}>{reg.branch}</td>
                    <td style={styles.td}>{reg.mobile}</td>
                    <td style={styles.td}>
                      <span style={styles.eventBadge}>{reg.event}</span>
                    </td>
                    <td style={styles.td}>{new Date(reg.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(reg._id)} style={styles.deleteBtn}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Activity */}
        {stats?.recent && stats.recent.length > 0 && (
          <div style={styles.recentSection}>
            <h3 style={styles.recentTitle}>Recent Registrations</h3>
            {stats.recent.slice(0, 5).map(r => (
              <div key={r._id} style={styles.recentItem}>
                <span style={{ color: '#fff', fontWeight: 500 }}>{r.fullName}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>registered for</span>
                <span style={{ color: '#a855f7', fontWeight: 500 }}>{r.event}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                  {new Date(r.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STYLES ───
const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#fff',
    fontFamily: "'Inter', -apple-system, sans-serif",
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '1200px',
    padding: '40px 0',
  },
  // Login
  loginBox: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: '380px',
    background: 'rgba(15,15,20,0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px 32px',
    textAlign: 'center',
  },
  loginTitle: {
    fontSize: '24px',
    fontWeight: 700,
    margin: '0 0 8px',
  },
  loginSub: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.45)',
    margin: '0 0 24px',
  },
  input: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  loginBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '0.15em',
    cursor: 'pointer',
  },
  logoutBtn: {
    padding: '8px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit',
  },
  // Dashboard
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  dashTitle: {
    fontSize: '28px',
    fontWeight: 700,
    margin: '0 0 4px',
  },
  dashSub: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
  },
  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'rgba(15,15,20,0.6)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '20px 24px',
  },
  statLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.4)',
    margin: '0 0 8px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  // Filters
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  filterBtnActive: {
    background: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    color: '#c084fc',
  },
  // Table
  tableWrap: {
    background: 'rgba(15,15,20,0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  td: {
    padding: '12px 16px',
    color: 'rgba(255,255,255,0.65)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    whiteSpace: 'nowrap',
  },
  eventBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    background: 'rgba(168, 85, 247, 0.12)',
    borderRadius: '6px',
    color: '#c084fc',
    fontSize: '12px',
    fontWeight: 500,
  },
  deleteBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '6px',
    color: '#ef4444',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  // Recent
  recentSection: {
    marginTop: '32px',
  },
  recentTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '16px',
  },
  recentItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: '14px',
    flexWrap: 'wrap',
  },
};
