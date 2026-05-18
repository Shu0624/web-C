import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Environment, Sparkles } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import './App.css';

const EVENTS = [
  {
    id: 1,
    title: 'ONLINE CODING PLATFORM',
    category: 'Technical',
    description: 'Battle algorithms and data structures in real-time. A rigorous test of logic, optimization, and speed against top coders.',
    number: '01'
  },
  {
    id: 2,
    title: 'BLIND CODING',
    category: 'Technical',
    description: 'Code with your monitors turned off. Rely entirely on your mental compiler, syntax mastery, and absolute focus.',
    number: '02'
  },
  {
    id: 3,
    title: 'STARTUP PITCH',
    category: 'Non-Technical',
    description: 'Present your disruptive ideas to industry veterans. Sell your vision, demonstrate market fit, and secure the mock funding.',
    number: '03'
  },
  {
    id: 4,
    title: 'E-SPORTS',
    category: 'Non-Technical',
    description: 'Enter the arena. Compete in high-stakes matches requiring split-second reflexes, strategic teamwork, and pure skill.',
    number: '04'
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
          emissiveIntensity={2}
          wireframe
        />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#60a5fa"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function Starfield() {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 10 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#fff" size={0.05} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentSection = Math.round(scrollPosition / windowHeight);
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div className="app-container">
      {/* 3D WebGL Background replacing the video */}
      <div className="video-background">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <GlowingCrystal />
            <Starfield />
            <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.5} color="#60a5fa" />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>
      <div className="video-overlay"></div>

      <nav className="fixed-nav">
        <div className="logo syncopate">
          <img src="/cse-logo.png" alt="CSE Logo" className="nav-logo" />
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
            <h1 className="hero-title">THE NEXT WAVE<br/>OF INNOVATION</h1>
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
              EXPERIENCE<br/>YOU CAN BUILD ON
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
            
            <div className="events-grid">
              {EVENTS.map((event, index) => (
                <motion.div 
                  key={event.id}
                  className="event-card glass-panel"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                >
                  <div className="event-number syncopate">{event.number}</div>
                  <div className="event-category">{event.category}</div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-desc">{event.description}</p>
                  <button className="explore-btn syncopate">EXPLORE &rarr;</button>
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
            <h2 className="footer-title">READY TO JOIN<br/>THE ECOSYSTEM?</h2>
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
