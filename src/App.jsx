import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { ReactLenis } from 'lenis/react';
import GalaxyScene from './SpiralGalaxy';
import RegistrationModal from './RegistrationModal';
import AdminPanel from './AdminPanel';
import './App.css';

const EVENTS = [
  {
    id: 1,
    title: 'Online Coding Platform',
    category: 'TECHNICAL',
    description: 'You get a problem, you solve it, you climb the leaderboard. Simple as that. Think fast, code clean, and try not to panic when the timer hits zero.',
    number: '01',
    icon: (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 30L40 20L90 35L60 45L10 30Z" stroke="#34d399" strokeWidth="2" fill="rgba(52, 211, 153, 0.1)" />
        <path d="M20 40L50 30L80 40L50 50L20 40Z" stroke="#60a5fa" strokeWidth="2" fill="rgba(96, 165, 250, 0.1)" />
        <circle cx="50" cy="50" r="3" fill="#34d399" />
        <circle cx="70" cy="60" r="2" fill="#f43f5e" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Blind Coding',
    category: 'TECHNICAL',
    description: 'Imagine coding without seeing your output. No preview, no console — just you, your brain, and pure logic. Sounds terrifying? That\'s the point.',
    number: '02',
    icon: (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="20" width="40" height="40" rx="4" stroke="#60a5fa" strokeWidth="2" fill="rgba(96, 165, 250, 0.1)" />
        <path d="M10 50Q50 20 90 60" stroke="#fb923c" strokeWidth="2" fill="none" />
        <line x1="20" y1="60" x2="80" y2="40" stroke="#f43f5e" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Startup Pitch',
    category: 'NON-TECHNICAL',
    description: 'Got a wild idea that could actually work? Build a pitch around it and convince a panel of judges why it deserves to exist. Think Shark Tank, but on campus.',
    number: '03',
    icon: (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 40L50 30L80 40L50 50L20 40Z" stroke="#fb923c" strokeWidth="2" fill="rgba(251, 146, 60, 0.1)" />
        <rect x="40" y="45" width="20" height="20" stroke="#f43f5e" strokeWidth="2" fill="rgba(244, 63, 94, 0.1)" />
        <path d="M30 20Q50 10 70 30" stroke="#34d399" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'E-Sports',
    category: 'NON-TECHNICAL',
    description: 'Grab your squad and drop in. Whether it\'s Valorant, BGMI, or whatever gets your adrenaline going — it\'s time to prove who actually runs the server.',
    number: '04',
    icon: (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 60C10 60 10 30 50 30C90 30 90 60 80 60C70 60 70 50 50 50C30 50 30 60 20 60Z" stroke="#a3e635" strokeWidth="2" fill="rgba(163, 230, 53, 0.1)" />
        <circle cx="30" cy="45" r="3" fill="#60a5fa" />
        <circle cx="70" cy="45" r="3" fill="#fb923c" />
        <line x1="45" y1="45" x2="55" y2="45" stroke="#fff" strokeWidth="2" />
        <line x1="50" y1="40" x2="50" y2="50" stroke="#fff" strokeWidth="2" />
      </svg>
    )
  }
];

function CinematicLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fixed ~2.5s duration to allow WebGL shaders to compile in the background
    const duration = 2500;
    const interval = 50; 
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min((currentStep / steps) * 100, 100));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 800); // Wait for the fade out animation
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#030303',
        pointerEvents: progress === 100 ? 'none' : 'auto'
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Spinning Tech Ring */}
        <motion.div
          style={{
            width: '96px',
            height: '96px',
            marginBottom: '32px',
            borderRadius: '50%',
            borderTop: '2px solid #a855f7',
            borderRight: '2px solid #a855f7',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            width: '96px',
            height: '96px',
            marginBottom: '32px',
            borderRadius: '50%',
            borderBottom: '2px solid #ec4899',
            borderLeft: '2px solid #ec4899',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Progress Bar */}
        <div style={{ position: 'relative', width: '256px', height: '4px', backgroundColor: '#111827', borderRadius: '9999px', overflow: 'hidden' }}>
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              background: 'linear-gradient(to right, #a855f7, #ec4899)',
              borderRadius: '9999px'
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.05 }}
          />
        </div>
        
        {/* Text */}
        <motion.p 
          style={{
            marginTop: '24px',
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: '0.3em',
            color: '#d8b4fe'
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          INITIALIZING_NEXUS {Math.round(progress)}%
        </motion.p>
      </div>
    </motion.div>
  );
}

// 3D components moved to SpiralGalaxy.jsx

function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check hash route for admin panel
    const checkHash = () => setIsAdmin(window.location.hash === '#/admin');
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Check if device is mobile for performance optimization
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentSection = Math.round(scrollPosition / windowHeight);
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('hashchange', checkHash);
    };
  }, [activeSection]);

  // ─── ADMIN PANEL ROUTE ───
  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <div className="app-container">
        {loading && <CinematicLoader onComplete={() => setLoading(false)} />}
        
        {/* 3D WebGL Background replacing the video */}
        <div className="video-background">
          <Canvas
            camera={{ position: [0, 50, 250], fov: 60 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, clearColor: 0x030303 }}
          >
            <Suspense fallback={null}>
              <GalaxyScene isMobile={isMobile} />
            </Suspense>
          </Canvas>
        </div>
      <div className="video-overlay"></div>

      <nav className="fixed-nav">
        <div className="logo syncopate">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 22 22 22"></polygon>
          </svg>
          NEXUS '26
        </div>
        <div className="nav-links syncopate">
          <a href="#home">HOME</a>
          <a href="#about">ABOUT</a>
          <a href="#events">EVENTS</a>
          <a href="#register" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>REGISTER</a>
        </div>
      </nav>

      {/* Registration Modal */}
      <RegistrationModal isOpen={showRegister} onClose={() => setShowRegister(false)} />

      <main className="content-wrapper">
        <section className="viewport-section" id="home">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="hero-title">THE NEXT WAVE<br />OF INNOVATION</h1>
            <p className="hero-subtitle">Where code meets chaos and ideas turn real</p>
          </motion.div>
          <div className="scroll-indicator">
            <span className="syncopate">SCROLL TO EXPLORE</span>
            <div className="line"></div>
          </div>
        </section>

        <section className="viewport-section" id="about">
          <div className="grid-container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              EXPERIENCE<br />YOU CAN BUILD ON
            </motion.h2>
            <motion.div
              className="section-text"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p>We're not throwing another boring college fest. This is four events designed to push you — whether you're a builder, a gamer, a thinker, or just someone who shows up and surprises everyone. Come build something worth talking about.</p>
            </motion.div>
          </div>
          <div className="section-number syncopate">//01</div>
        </section>

        <section className="viewport-section" id="events">
          <div className="events-container">
            <motion.h2
              className="events-header text-center"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              OUR MANIFESTO
            </motion.h2>

            <div className="events-list-rows">
              {EVENTS.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="event-row"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", stiffness: 60, damping: 15, delay: isMobile ? 0 : index * 0.08 }}
                >
                  <div className="event-row-left">
                    <div className="event-row-category" style={{ color: event.category === 'TECHNICAL' ? '#34d399' : '#c084fc' }}>
                      {event.category}
                    </div>
                    <h3 className="event-row-title">{event.title}</h3>
                  </div>
                  <div className="event-row-center">
                    <p className="event-row-desc">{event.description}</p>
                  </div>
                  <div className="event-row-icon">
                    {event.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-number syncopate">//02</div>
        </section>

        <section className="footer-section" id="register">
          <div className="footer-inner">
            {/* CTA Block */}
            <motion.div
              className="footer-cta"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="footer-title-gold syncopate">WANT IN?<br />LET'S GO.</h2>
              <p className="footer-tagline">Join 300+ students competing across 4 flagship events</p>
              <button className="register-btn-gold syncopate" onClick={() => setShowRegister(true)}>REGISTER NOW</button>
            </motion.div>

            {/* Footer Grid */}
            <div className="footer-grid">
              <div className="footer-col">
                <h4 className="footer-col-title">NEXUS '26</h4>
                <p className="footer-col-text">The flagship tech fest bringing together coders, gamers, and innovators under one roof.</p>
              </div>
              <div className="footer-col">
                <h4 className="footer-col-title">EVENTS</h4>
                <a href="#events" className="footer-link">Online Coding</a>
                <a href="#events" className="footer-link">Blind Coding</a>
                <a href="#events" className="footer-link">Startup Pitch</a>
                <a href="#events" className="footer-link">E-Sports</a>
              </div>
              <div className="footer-col">
                <h4 className="footer-col-title">QUICK LINKS</h4>
                <a href="#home" className="footer-link">Home</a>
                <a href="#about" className="footer-link">About</a>
                <a href="#register" className="footer-link" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>Register</a>
                <a href="#/admin" className="footer-link">Admin</a>
              </div>
              <div className="footer-col">
                <h4 className="footer-col-title">CONNECT</h4>
                <a href="#" className="footer-link">Instagram</a>
                <a href="#" className="footer-link">Discord</a>
                <a href="#" className="footer-link">Email Us</a>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
              <span>© 2026 NEXUS. All rights reserved.</span>
              <span className="footer-credit">Crafted with 💜 for the next wave</span>
            </div>
          </div>
        </section>

      </main>
      </div>
    </ReactLenis>
  );
}

export default App;
