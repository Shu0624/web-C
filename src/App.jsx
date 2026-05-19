import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { ReactLenis } from 'lenis/react';
import GalaxyScene from './SpiralGalaxy';
import './App.css';

const EVENTS = [
  {
    id: 1,
    title: 'Online Coding Platform',
    category: 'TECHNICAL',
    description: 'A leaderboard-driven coding round for speed, accuracy, and calm problem solving under pressure.',
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
    description: 'Participants write, reason, and debug with limited visual feedback. Clean logic wins over trial and error.',
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
    description: 'Teams turn a campus-scale problem into a crisp business pitch, then defend it in front of the jury.',
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
    description: 'A high-energy competitive arena for squads, strategy, communication, and clutch moments.',
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
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000]"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
      style={{ pointerEvents: progress === 100 ? 'none' : 'auto' }}
    >
      <div className="relative w-64 h-1 bg-gray-900 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "circOut", duration: 0.2 }}
        />
      </div>
      <motion.p 
        className="mt-6 font-mono text-sm tracking-widest text-blue-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        INITIALIZING NEXUS_ {progress}%
      </motion.p>
    </motion.div>
  );
}

// 3D components moved to SpiralGalaxy.jsx

function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    };
  }, [activeSection]);

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
          <a href="#events">EVENTS</a>
          <a href="#register">REGISTER</a>
        </div>
      </nav>

      <main className="content-wrapper">
        <section className="viewport-section" id="home">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="hero-title">THE NEXT WAVE<br />OF INNOVATION</h1>
            <p className="hero-subtitle">The Ultimate College Fest Experience</p>
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
              <p>Four major events. Infinite possibilities. We bring together the brightest minds across technical domains and creative arts. We don't just host events. We forge experiences.</p>
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

            <div className="events-list">
              {EVENTS.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="event-card"
                  initial={{ opacity: 0, y: isMobile ? 30 : 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", stiffness: 60, damping: 15, delay: isMobile ? 0 : index * 0.1 }}
                >
                  <div className="event-card-glow"></div>
                  <div className="event-card-header">
                    <div className="event-col-number syncopate">{event.number}</div>
                    <div className="event-col-visual">
                      {event.icon}
                    </div>
                  </div>
                  
                  <div className="event-card-content">
                    <div className="event-col-title">
                      <div className="event-category" style={{ color: event.category === 'TECHNICAL' ? '#60a5fa' : '#c084fc' }}>
                        {event.category}
                      </div>
                      <h3 className="event-title">{event.title}</h3>
                    </div>
                    <div className="event-col-desc">
                      <p className="event-desc">{event.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-number syncopate">//02</div>
        </section>

        <section className="viewport-section footer-section" id="register">
          <motion.div
            className="footer-content text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="footer-title">READY TO JOIN<br />THE ECOSYSTEM?</h2>
            <button className="register-btn syncopate">REGISTER NOW</button>

            <div className="footer-links">
              <a href="#">INSTAGRAM</a>
              <a href="#">DISCORD</a>
              <a href="#">CONTACT</a>
            </div>
          </motion.div>
          <div className="section-number syncopate">//03</div>
        </section>

      </main>
      </div>
    </ReactLenis>
  );
}

export default App;
