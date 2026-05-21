import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============ SPIRAL GALAXY (9,000 particles, differential rotation) ============
function SpiralParticles({ count = 9000 }) {
  const ref = useRef();
  const arms = 3;
  const armSeparation = (Math.PI * 2) / arms;
  const galaxyRadius = 300;
  const spin = 0.8;

  const colorInside = useMemo(() => new THREE.Color(0xffffff).multiplyScalar(1.2), []);
  const colorMiddle = useMemo(() => new THREE.Color(0xc084fc).multiplyScalar(2.5), []);
  const colorOutside = useMemo(() => new THREE.Color(0xf472b6).multiplyScalar(2.0), []);

  const { positions, colors, sizes, radii, angles, heights, scatterXArr, scatterZArr, directions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const rad = new Float32Array(count);
    const ang = new Float32Array(count);
    const hgt = new Float32Array(count);
    const scX = new Float32Array(count);
    const scZ = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = Math.pow(Math.random(), 1.2) * galaxyRadius;
      const branchAngle = (i % arms) * armSeparation;
      const spinAngle = radius * spin;
      const randomAngle = (Math.random() - 0.5) * 0.8;
      const angle = branchAngle + spinAngle + randomAngle;

      const scatterX = (Math.random() - 0.5) * Math.pow(Math.random(), 2) * (radius * 0.15 + 10);
      const height = (Math.random() - 0.5) * Math.pow(Math.random(), 2) * (radius * 0.08 + 5);
      const scatterZ = (Math.random() - 0.5) * Math.pow(Math.random(), 2) * (radius * 0.15 + 10);

      pos[i * 3] = Math.cos(angle) * radius + scatterX;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius + scatterZ;

      rad[i] = radius;
      ang[i] = angle;
      hgt[i] = height;
      scX[i] = scatterX;
      scZ[i] = scatterZ;

      const mixedColor = colorInside.clone();
      if (radius < galaxyRadius * 0.4) {
        mixedColor.lerp(colorMiddle, radius / (galaxyRadius * 0.4));
      } else {
        mixedColor.copy(colorMiddle);
        mixedColor.lerp(colorOutside, (radius - galaxyRadius * 0.4) / (galaxyRadius * 0.6));
      }
      mixedColor.lerp(new THREE.Color(0xffffff), Math.random() * 0.3);

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
      // Increase base size for better glow
      sz[i] = Math.random() * 3.5 + 1.5;
    }
    return {
      positions: pos, colors: col, sizes: sz,
      radii: rad, angles: ang, heights: hgt,
      scatterXArr: scX, scatterZArr: scZ
    };
  }, [count, colorInside, colorMiddle, colorOutside, galaxyRadius]);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    attribute float aRadius;
    attribute float aAngle;
    attribute float aHeight;
    attribute float aScatterX;
    attribute float aScatterZ;
    varying vec3 vColor;
    varying float vAlpha;
    varying float vTwinkle;
    uniform float time;
    uniform float pixelRatio;

    void main() {
      vColor = color;
      // Base speed very slow near center, exponentially faster farther out
      float angularSpeed = 0.05 + pow(aRadius / 300.0, 1.5) * 1.5;
      float currentAngle = aAngle + time * angularSpeed;
      float cosA = cos(time * angularSpeed);
      float sinA = sin(time * angularSpeed);
      float rotSX = aScatterX * cosA - aScatterZ * sinA;
      float rotSZ = aScatterX * sinA + aScatterZ * cosA;

      vec3 pos;
      pos.x = cos(currentAngle) * aRadius + rotSX;
      pos.y = aHeight;
      pos.z = sin(currentAngle) * aRadius + rotSZ;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      float dist = length(mvPosition.xyz);
      // Push the fade-out distance further so the center stays bright (alpha ~ 1.0)
      vAlpha = 1.0 - smoothstep(300.0, 800.0, dist);
      
      // Calculate a random-looking twinkle based on position and time
      vTwinkle = sin(time * 3.0 + aAngle * 15.0 + aRadius * 0.5) * 0.5 + 0.5;
      
      gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    varying float vTwinkle;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 1.2);
      
      // Apply twinkle to the alpha/glow
      gl_FragColor = vec4(vColor, vAlpha * glow * (0.4 + 0.8 * vTwinkle));
    }
  `;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aRadius" args={[radii, 1]} />
        <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
        <bufferAttribute attach="attributes-aHeight" args={[heights, 1]} />
        <bufferAttribute attach="attributes-aScatterX" args={[scatterXArr, 1]} />
        <bufferAttribute attach="attributes-aScatterZ" args={[scatterZArr, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============ BRIGHT NODES (90) ============
function NodeDots({ count = 90 }) {
  const ref = useRef();
  const arms = 3;
  const armSeparation = (Math.PI * 2) / arms;
  const galaxyRadius = 300;
  const spin = 0.8;

  const { positions, colors, radii, angles, heights, directions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const rad = new Float32Array(count);
    const ang = new Float32Array(count);
    const hgt = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 40 + Math.pow(Math.random(), 0.8) * (galaxyRadius - 40);
      const branchAngle = (i % arms) * armSeparation;
      const spinAngle = radius * spin;
      const angle = branchAngle + spinAngle + (Math.random() - 0.5) * 0.3;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      col[i * 3] = 1.0;
      col[i * 3 + 1] = 1.0;
      col[i * 3 + 2] = 1.0;

      rad[i] = radius;
      ang[i] = angle;
      hgt[i] = pos[i * 3 + 1];
    }
    return { positions: pos, colors: col, radii: rad, angles: ang, heights: hgt };
  }, [count, galaxyRadius]);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    attribute vec3 color;
    attribute float aRadius;
    attribute float aAngle;
    attribute float aHeight;
    varying vec3 vColor;
    uniform float time;
    uniform float pixelRatio;

    void main() {
      vColor = color;
      // Match node speed to spiral particles
      float angularSpeed = 0.05 + pow(aRadius / 300.0, 1.5) * 1.5;
      float currentAngle = aAngle + time * angularSpeed;

      vec3 pos;
      pos.x = cos(currentAngle) * aRadius;
      pos.y = aHeight;
      pos.z = sin(currentAngle) * aRadius;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 10.0 * pixelRatio * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 0.8);
      gl_FragColor = vec4(vColor, glow);
    }
  `;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aRadius" args={[radii, 1]} />
        <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
        <bufferAttribute attach="attributes-aHeight" args={[heights, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============ BACKGROUND STARS (2,500) ============
function BackgroundStars({ count = 2500 }) {
  const ref = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xc4b5fd),
      new THREE.Color(0xa78bfa),
      new THREE.Color(0x818cf8),
      new THREE.Color(0xf0abfc),
      new THREE.Color(0xe9d5ff),
    ];

    for (let i = 0; i < count; i++) {
      const r = 500 + Math.random() * 1200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() - 0.5) * 2);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      sz[i] = Math.random() * 1.5 + 0.3;
    }
    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vTwinkle;
    uniform float time;
    uniform float pixelRatio;
    void main() {
      vColor = color;
      vTwinkle = sin(time * 2.0 + position.x * 0.01 + position.y * 0.01) * 0.5 + 0.5;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vTwinkle;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 1.8);
      gl_FragColor = vec4(vColor, glow * (0.3 + 0.7 * vTwinkle));
    }
  `;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============ MOUSE PARALLAX + CAMERA DRIFT ============
function MouseParallaxCamera({ children, isMobile }) {
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Smooth mouse follow
    smooth.current.x += (mouse.current.x - smooth.current.x) * 0.05;
    smooth.current.y += (mouse.current.y - smooth.current.y) * 0.05;

    // Galaxy tilt from mouse (0.3 base tilt to raise the back side)
    if (groupRef.current) {
      groupRef.current.rotation.x = 0.3 + smooth.current.y * 0.2;
      groupRef.current.rotation.z = smooth.current.x * 0.15;
    }

    // Subtle camera drift
    camera.position.x = Math.sin(t * 0.1) * 10;
    camera.position.y = 50 + Math.cos(t * 0.15) * 15;
    camera.lookAt(0, 0, 0);
  });

  // On desktop, shift right. On mobile, move down so it doesn't block text.
  const pos = isMobile ? [20, -70, 0] : [120, -20, 0];
  
  return <group ref={groupRef} position={pos}>{children}</group>;
}

// ============ MAIN EXPORT ============
export default function GalaxyScene({ isMobile = false }) {
  const spiralCount = isMobile ? 4000 : 9000;
  const nodeCount = isMobile ? 40 : 90;
  const starCount = isMobile ? 1000 : 2500;

  return (
    <>
      <fog attach="fog" args={[0x030303, 0, 2000]} />
      <BackgroundStars count={starCount} />
      <MouseParallaxCamera isMobile={isMobile}>
        <SpiralParticles count={spiralCount} />
        <NodeDots count={nodeCount} />
      </MouseParallaxCamera>
    </>
  );
}
