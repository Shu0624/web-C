import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Environment, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as random from 'maath/random/dist/maath-random.esm';
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

function GlowingCrystal() {
  const mesh = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.2;
    mesh.current.rotation.x = t * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={3}
          wireframe
        />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.8, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          roughness={0}
          thickness={0.5}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
    </Float>
  );
}

function Starfield({ count = 5000 }) {
  const ref = useRef();
  // Using useMemo so it correctly regenerates if count changes based on mobile/desktop
  const sphere = React.useMemo(() => random.inSphere(new Float32Array(count), { radius: 10 }), [count]);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color={[2, 2, 3]} size={0.06} sizeAttenuation={true} depthWrite={false} opacity={0.8} />
      </Points>
    </group>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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
    <div className="app-container">
      {/* 3D WebGL Background replacing the video */}
      <div className="video-background">
        {/* Clamp dpr to 1.5 to save massive amounts of GPU overhead on high-density mobile screens */}
        <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <GlowingCrystal />
            
            {/* Drastically reduce particles on mobile */}
            <Starfield count={isMobile ? 1200 : 5000} />
            <Sparkles count={isMobile ? 40 : 150} scale={12} size={isMobile ? 5 : 3} speed={0.4} opacity={1} color={[1, 1.5, 3]} />
            
            <Environment preset="night" />
            
            {/* Only run expensive Bloom post-processing on Desktop */}
            {!isMobile && (
              <EffectComposer>
                <Bloom luminanceThreshold={1} intensity={1} />
              </EffectComposer>
            )}
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
                  className="event-row"
                  initial={{ opacity: 0, y: isMobile ? 30 : 0, x: isMobile ? 0 : -30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", stiffness: 60, damping: 15, delay: isMobile ? 0 : index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(25, 25, 25, 0.8)", borderColor: "rgba(255, 255, 255, 0.08)" }}
                >
                  <div className="event-col-number syncopate">{event.number}</div>
                  <div className="event-col-title">
                    <div className="event-category" style={{ color: event.category === 'TECHNICAL' ? '#34d399' : '#10b981' }}>
                      {event.category}
                    </div>
                    <h3 className="event-title">{event.title}</h3>
                  </div>
                  <div className="event-col-desc">
                    <p className="event-desc">{event.description}</p>
                  </div>
                  <div className="event-col-visual">
                    {event.icon}
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
  );
}

export default App;
