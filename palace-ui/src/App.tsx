import { Float, Sparkles, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// Un artefact tournant qui représente le savoir
function Artifact() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  // Animation à chaque frame (60fps)
  useFrame((_state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.2 : 1}
      >
        {/* Forme géométrique complexe (Icosaèdre) */}
        <icosahedronGeometry args={[1.5, 0]} />
        {/* Matériau "Wireframe" doré divin */}
        <meshStandardMaterial 
          color={hovered ? "#F4E4BC" : "#F59E0B"} 
          wireframe={true}
          emissive="#F59E0B"
          emissiveIntensity={hovered ? 2 : 0.5}
        />
      </mesh>
    </Float>
  );
}

function App() {
  return (
    <div className="relative w-full h-full bg-lapis-night">
      
      {/* Interface UI (Overlay) */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sacred-sand to-divine-gold drop-shadow-lg tracking-widest uppercase">
          Hourglass Palace
        </h1>
        <p className="mt-4 text-cosmic-teal text-lg tracking-[0.2em] opacity-80">
          Mastery feels sacred
        </p>
        
        {/* Bouton test (Glassmorphism) */}
        <div className="mt-12 pointer-events-auto">
          <button className="px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sacred-sand hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Enter the Temple
          </button>
        </div>
      </div>

      {/* Scène 3D (Background) */}
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* Lumières */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#F59E0B" />
        
        {/* Environnement */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#0D9488" />
        
        {/* L'objet central */}
        <Artifact />
      </Canvas>
    </div>
  );
}

export default App;