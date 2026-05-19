import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const EVENTS = [
  'Online Coding Platform',
  'Blind Coding',
  'Startup Pitch'
];

const BRANCHES = [
  'CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'AI & ML', 'Data Science',
  'Cybersecurity', 'BCA', 'MCA', 'Other',
];

// Google Form fallback links per event
const GOOGLE_FORM_LINKS = {
  'Online Coding Platform': 'https://forms.gle/YOUR_FORM_1',
  'Blind Coding': 'https://forms.gle/YOUR_FORM_2',
  'Startup Pitch': 'https://forms.gle/YOUR_FORM_3'
};

export default function RegistrationModal({ isOpen, onClose, initialEvent = '' }) {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    branch: '',
    mobile: '',
    event: initialEvent,
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, event: initialEvent }));
    }
  }, [isOpen, initialEvent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('You\'re in! Registration successful.');
        setFormData({ fullName: '', rollNo: '', branch: '', mobile: '', event: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Server is down. Please use the Google Form below.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        style={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={styles.modal}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button style={styles.closeBtn} onClick={onClose}>✕</button>

          <h2 style={styles.title}>Register as Team Leader</h2>
          <p style={styles.subtitle}>Fill in your details to reserve your spot</p>

          {status === 'success' ? (
            <div style={styles.successBox}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#34d399' }}>{message}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '12px', fontSize: '14px' }}>
                Also fill the backup Google Form just in case:
              </p>
              {formData.event && (
                <a href={GOOGLE_FORM_LINKS[formData.event]} target="_blank" rel="noreferrer" style={styles.googleLink}>
                  Open Google Form →
                </a>
              )}
              <button style={styles.submitBtn} onClick={() => { setStatus('idle'); }}>
                Register for another event
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Event Selection */}
              <div style={styles.field}>
                <label style={styles.label}>Event *</label>
                <select
                  name="event"
                  value={formData.event}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select an event</option>
                  {EVENTS.map(ev => (
                    <option key={ev} value={ev}>{ev}</option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div style={styles.field}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  style={styles.input}
                />
              </div>

              {/* Roll Number */}
              <div style={styles.field}>
                <label style={styles.label}>Roll Number *</label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  placeholder="e.g. 22CSE1024"
                  required
                  style={styles.input}
                />
              </div>

              {/* Branch */}
              <div style={styles.field}>
                <label style={styles.label}>Branch *</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select branch</option>
                  {BRANCHES.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Mobile */}
              <div style={styles.field}>
                <label style={styles.label}>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  style={styles.input}
                />
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div style={styles.errorBox}>
                  <p>{message}</p>
                  {formData.event && (
                    <a href={GOOGLE_FORM_LINKS[formData.event]} target="_blank" rel="noreferrer" style={styles.googleLink}>
                      Use Google Form instead →
                    </a>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                style={{
                  ...styles.submitBtn,
                  opacity: status === 'loading' ? 0.6 : 1,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Registering...' : 'REGISTER'}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── STYLES ───
const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    padding: '20px',
  },
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'rgba(15, 15, 20, 0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px 32px',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '20px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 4px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.45)',
    margin: '0 0 28px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  input: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.3s',
    fontFamily: 'inherit',
  },
  select: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    appearance: 'none',
  },
  submitBtn: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.3s',
    fontFamily: 'inherit',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#ef4444',
    fontSize: '14px',
  },
  successBox: {
    textAlign: 'center',
    padding: '20px 0',
  },
  googleLink: {
    display: 'inline-block',
    marginTop: '12px',
    color: '#a855f7',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '14px',
  },
};
