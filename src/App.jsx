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
    title: 'ONLINE CODE CHALLENGE',
    category: 'CODING',
    description: 'RANKING OPENS THE DOOR PROBLEM SOLVING WINS THE CROWN',
    number: '01',
    link: 'https://forms.gle/QEdM3ysTPViCzdzP6',
    rulebook: 'https://drive.google.com/file/d/1YZE_3b8jpFVdrC6TMhcXWwcWafr7cEht/view?usp=drive_link',
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
    title: 'ZERO VISION (BLIND CODE)',
    category: 'CODING',
    description: 'CODE FROM MEMORY WIN WITH PRECISION (MONITORS OFF BTW)',
    number: '02',
    link: 'https://forms.gle/Y2xamDKEn1k83FwH7',
    icon: (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="20" width="40" height="40" rx="4" stroke="#34d399" strokeWidth="2" fill="rgba(52, 211, 153, 0.1)" />
        <path d="M10 50Q50 20 90 60" stroke="#fb923c" strokeWidth="2" fill="none" />
        <line x1="20" y1="60" x2="80" y2="40" stroke="#f43f5e" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'MIND YOUR BUSINESS (STARTUP PITCH)',
    category: 'INNOVATION',
    description: 'BRAINS, BUSINESS AND BOLDNESS AND YOUR STARTUP JOURNEY STARTS',
    number: '03',
    link: 'https://forms.gle/ep7hL7WeYRByESZK6',
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
    title: 'SDG STORIES',
    category: 'STRATEGY',
    description: 'FILM THE FUTURE YOU WANT AND STORIES THAT MATTER',
    number: '04',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSe1CoPjibSl4B8UhNMZjm4YCATtWUV0TGWgLJE9wyE7_YR62g/viewform?usp=header',
    icon: (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="40" r="20" stroke="#60a5fa" strokeWidth="2" fill="rgba(96, 165, 250, 0.1)" />
        <path d="M45 35L58 40L45 45V35Z" fill="#60a5fa" />
      </svg>
    )
  },
  {
    id: 5,
    title: 'SPEED CHESS',
    category: 'STRATEGY',
    description: 'ONE CLOCK, ZERO MERCY BLITZ THE BOARD',
    number: '05',
    link: 'https://forms.gle/85YHB4kfHhEntoH29',
    icon: (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="20" width="40" height="40" stroke="#a855f7" strokeWidth="2" fill="rgba(168, 85, 247, 0.1)" />
        <rect x="30" y="20" width="20" height="20" fill="#a855f7" />
        <rect x="50" y="40" width="20" height="20" fill="#a855f7" />
      </svg>
    )
  },
  {
    id: 6,
    title: 'BOX CRICKET',
    category: 'ENTERTAINMENT',
    description: 'TURN CLASSROOM INTO STADIUM AND COMPETE IN ACTION PACKED BOX-CRIC',
    number: '06',
    link: 'https://forms.gle/YwBZkJSwJStvxAWh6',
    icon: (
      <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="70" cy="30" r="8" stroke="#f43f5e" strokeWidth="2" fill="rgba(244, 63, 94, 0.1)" />
        <path d="M20 70L40 30L50 40L30 80Z" fill="#f43f5e" opacity="0.8"/>
      </svg>
    )
  }
];

const TIMELINE_DATA = [
  {
    time: 'MAY 22',
    title: 'REGISTRATION STARTING',
    category: 'GENERAL',
    desc: 'The gates open. Secure your spot in the ultimate tech showdown.',
  },
  {
    time: 'MAY 26',
    title: 'REGISTRATION CLOSE',
    category: 'GENERAL',
    desc: 'Final call. Registrations officially close as we prepare for the main event.',
  },
  {
    time: 'MAY 29 - 09:30 AM',
    title: 'RIBBON CUTTING & INAUGURATION',
    category: 'GENERAL',
    desc: 'Grand opening ceremony, keynotes from distinguished speakers to kick off the fest.',
  },
  {
    time: 'MAY 29 - 10:30 AM',
    title: 'EVENTS BEGIN',
    category: 'CODING & INNOVATION',
    desc: 'Simultaneous kick-off for Online Code Challenge, Zero Vision (Blind Code), and Mind Your Business (Startup Pitch).',
  },
  {
    time: 'MAY 29 - 11:00 AM',
    title: 'PARALLEL EVENTS',
    category: 'STRATEGY & ENTERTAINMENT',
    desc: 'Action continues with SDG Stories, Speed Chess, and Box Cricket starting across venues.',
  }
];

const FACULTY_COORDINATORS = [
  {
    name: 'DR. S. P. ABHANG',
    role: 'HOD CSE',
    phone: '',
    link: '',
  },
  {
    name: 'PROF. N. Z. PATEL',
    role: 'FACULTY COORDINATOR',
    phone: '7709 822 232',
    link: 'tel:+917709822232',
  },
  {
    name: 'DR. S. V. KHIDSE',
    role: 'FACULTY COORDINATOR',
    phone: '78754 36556',
    link: 'tel:+917875436556',
  }
];

const STUDENT_COORDINATORS = [
  {
    event: 'ONLINE CODE CHALLENGE',
    category: 'CODING',
    leads: [
      { name: 'Sarthak Dayma', phone: '7391991701', link: 'tel:+917391991701' },
      { name: 'Mayur Vitekar', phone: '8080090032', link: 'tel:+918080090032' }
    ]
  },
  {
    event: 'ZERO VISION (BLIND CODE)',
    category: 'CODING',
    leads: [
      { name: 'Prathamesh Shirsath', phone: '9322470325', link: 'tel:+919322470325' },
      { name: 'Rushikesh Nirpal', phone: '9370090561', link: 'tel:+919370090561' }
    ]
  },
  {
    event: 'MIND YOUR BUSINESS (STARTUP PITCH)',
    category: 'INNOVATION',
    leads: [
      { name: 'Prajwal Awhale', phone: '9373522350', link: 'tel:+919373522350' },
      { name: 'Soham Bhale', phone: '9405696248', link: 'tel:+919405696248' }
    ]
  },
  {
    event: 'SDG STORIES',
    category: 'STRATEGY',
    leads: [
      { name: 'Sumeet Dhangare', phone: '8421408304', link: 'tel:+918421408304' },
      { name: 'Pawan Phuke', phone: '9011147962', link: 'tel:+919011147962' },
      { name: 'Aditya Desale', phone: '9175516301', link: 'tel:+919175516301' }
    ]
  },
  {
    event: 'SPEED CHESS',
    category: 'STRATEGY',
    leads: [
      { name: 'Shubham Mhaske', phone: '8767637586', link: 'tel:+918767637586' },
      { name: 'Pratiksha Sonawane', phone: '7796016149', link: 'tel:+917796016149' }
    ]
  },
  {
    event: 'BOX CRICKET',
    category: 'ENTERTAINMENT',
    leads: [
      { name: 'Ajay Gaware', phone: '9699545701', link: 'tel:+919699545701' },
      { name: 'Prashik Dehere', phone: '8956821148', link: 'tel:+918956821148' }
    ]
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
          INITIALIZING_CODECRAFT {Math.round(progress)}%
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
  const [selectedEvent, setSelectedEvent] = useState('');
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
          CODECRAFT 2026
        </div>
        <div className="nav-links syncopate">
          <a href="#home">HOME</a>
          <a href="#about">ABOUT</a>
          <a href="#events">EVENTS</a>
          <a href="#timeline">SCHEDULE</a>
          <a href="#crew">CONTACT</a>
        </div>
      </nav>

      {/* Registration Modal */}
      <RegistrationModal isOpen={showRegister} onClose={() => setShowRegister(false)} initialEvent={selectedEvent} />

      <main className="content-wrapper">
        <section className="viewport-section" id="home">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="college-badge syncopate">
              CSMSS CHH. SHAHU COLLEGE OF ENGINEERING
            </div>
            <h1 className="hero-title">THE NEXT<br />WAVE OF<br />INNOVATION</h1>
            <p className="hero-subtitle">Where code meets chaos and ideas turn real</p>
            <div className="organizer-badge">
              Organized by the Department of Computer Science & Engineering.<br />
              <strong>29th May 2026</strong>
            </div>
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
                    <div className="event-row-category" style={{ 
                      color: event.category === 'CODING' ? '#34d399' : 
                             event.category === 'INNOVATION' ? '#fb923c' :
                             event.category === 'STRATEGY' ? '#60a5fa' : 
                             event.category === 'ENTERTAINMENT' ? '#f43f5e' : '#c084fc' 
                    }}>
                      {event.category}
                    </div>
                    <h3 className="event-row-title">{event.title}</h3>
                  </div>
                  <div className="event-row-center">
                    <p className="event-row-desc">{event.description}</p>
                    {event.rulebook && (
                      <button 
                        className="event-rulebook-btn syncopate" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          window.open(event.rulebook, '_blank');
                        }}
                      >
                        📋 RULE BOOK
                      </button>
                    )}
                    <button 
                      className="event-register-btn syncopate" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        window.open(event.link, '_blank');
                      }}
                    >
                      REGISTER NOW
                    </button>
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

        {/* Timeline Section */}
        <section className="viewport-section" id="timeline">
          <div className="timeline-container">
            <motion.h2
              className="section-title text-center"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              CHRONOLOGY OF EVENTS
            </motion.h2>
            <p className="timeline-subtitle text-center">Plan your attack strategy. The grand tech stage awaits.</p>
            
            <div className="timeline-track-wrapper">
              <div className="timeline-line"></div>
              
              {TIMELINE_DATA.map((item, index) => (
                <motion.div
                  key={index}
                  className={`timeline-node ${index % 2 === 0 ? 'left' : 'right'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: isMobile ? 0 : index * 0.05 }}
                >
                  <div className="timeline-node-dot" style={{
                    borderColor: item.category.includes('CODING') ? '#34d399' :
                                 item.category.includes('INNOVATION') ? '#fb923c' :
                                 item.category.includes('STRATEGY') ? '#60a5fa' :
                                 item.category.includes('ENTERTAINMENT') ? '#f43f5e' : '#a855f7'
                  }}></div>
                  <div className="timeline-node-content">
                    <span className="timeline-time syncopate">{item.time}</span>
                    <h3 className="timeline-title syncopate" style={{
                      color: item.category.includes('CODING') ? '#34d399' :
                             item.category.includes('INNOVATION') ? '#fb923c' :
                             item.category.includes('STRATEGY') ? '#60a5fa' :
                             item.category.includes('ENTERTAINMENT') ? '#f43f5e' : '#fff'
                    }}>{item.title}</h3>
                    <p className="timeline-desc">{item.desc}</p>
                    <span className="timeline-badge" style={{
                      backgroundColor: item.category.includes('CODING') ? 'rgba(52, 211, 153, 0.1)' :
                                       item.category.includes('INNOVATION') ? 'rgba(251, 146, 60, 0.1)' :
                                       item.category.includes('STRATEGY') ? 'rgba(96, 165, 250, 0.1)' :
                                       item.category.includes('ENTERTAINMENT') ? 'rgba(244, 63, 94, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                      color: item.category.includes('CODING') ? '#34d399' :
                             item.category.includes('INNOVATION') ? '#fb923c' :
                             item.category.includes('STRATEGY') ? '#60a5fa' :
                             item.category.includes('ENTERTAINMENT') ? '#f43f5e' : '#a855f7'
                    }}>{item.category}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="section-number syncopate">//03</div>
        </section>

        {/* Crew / Contact Section */}
        <section className="viewport-section" id="crew">
          <div className="crew-container">
            <motion.h2
              className="section-title text-center"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              STEERING COMMITTEE & CRUISE CREW
            </motion.h2>
            <p className="crew-subtitle text-center">Get in touch with our event marshals for queries and configurations.</p>
            
            {/* Faculty Section */}
            <div className="faculty-grid">
              {FACULTY_COORDINATORS.map((fac, idx) => (
                <motion.div
                  key={idx}
                  className={`faculty-card ${idx === 0 ? 'hod-card' : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, delay: idx * 0.1 }}
                >
                  <div className="faculty-card-glow"></div>
                  <div className="faculty-info">
                    <span className="faculty-role syncopate">{fac.role}</span>
                    <h3 className="faculty-name syncopate">{fac.name}</h3>
                    {fac.phone && (
                      <a href={fac.link} className="faculty-phone syncopate">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {fac.phone}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <h3 className="student-crew-title syncopate text-center">STUDENT EVENT CONVENERS</h3>

            {/* Student Grid */}
            <div className="student-grid">
              {STUDENT_COORDINATORS.map((std, idx) => (
                <motion.div
                  key={idx}
                  className="student-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: isMobile ? 0 : idx * 0.05 }}
                >
                  <div className="student-card-header">
                    <span className="student-event-category" style={{
                      color: std.category === 'CODING' ? '#34d399' :
                             std.category === 'INNOVATION' ? '#fb923c' :
                             std.category === 'STRATEGY' ? '#60a5fa' :
                             std.category === 'ENTERTAINMENT' ? '#f43f5e' : '#fff'
                    }}>{std.category}</span>
                    <h4 className="student-event-title syncopate">{std.event}</h4>
                  </div>
                  <div className="student-leads">
                    {std.leads.map((lead, lIdx) => (
                      <div className="lead-row" key={lIdx}>
                        <span className="lead-name">{lead.name}</span>
                        <a href={lead.link} className="lead-phone-btn" title={`Call ${lead.name}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          <span>{lead.phone}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
          <div className="section-number syncopate">//04</div>
        </section>

        <section className="footer-section-modern" id="footer">
          <div className="footer-inner-modern">
            <div className="footer-top-modern">
              <div className="footer-brand">
                <div className="logo syncopate footer-logo">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 22 22 22"></polygon>
                  </svg>
                  CODECRAFT 2026
                </div>
                <p className="footer-tagline text-gradient">Where code meets chaos.</p>
                <p className="footer-desc">
                  We forge experiences that push boundaries, ignite innovation, and redefine what's possible in the tech ecosystem.
                </p>
                <div className="footer-socials">
                  <a href="#" className="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href="#" className="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                </div>
              </div>

              <div className="footer-links-group">
                <h4 className="syncopate footer-heading">Navigation</h4>
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#events">Events</a>
                <a href="#timeline">Schedule</a>
                <a href="#crew">Contact</a>
              </div>

              <div className="footer-links-group">
                <h4 className="syncopate footer-heading">Events</h4>
                <a href="#events">Online Code Challenge</a>
                <a href="#events">Zero Vision</a>
                <a href="#events">Startup Pitch</a>
                <a href="#events">SDG Stories</a>
                <a href="#events">Speed Chess</a>
                <a href="#events">Box Cricket</a>
              </div>

            </div>

            <div className="footer-bottom-modern">
              <div className="footer-bottom-left">
                <p>© 2026 CODECRAFT. All rights reserved.</p>
              </div>
              <div className="footer-bottom-center">
                <span className="designed-by">
                  Website designed by <a href="https://www.linkedin.com/in/shubham-mhaske-96b585291/" target="_blank" rel="noopener noreferrer" className="sparkle-text">Shubham Mhaske</a>
                </span>
              </div>
              <div className="footer-bottom-right">
              </div>
            </div>
          </div>
        </section>

      </main>
      </div>
    </ReactLenis>
  );
}

export default App;
