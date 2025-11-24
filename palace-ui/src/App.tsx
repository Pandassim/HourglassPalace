import { Float, Sparkles, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CardData {
  id: number;
  content: string;
  state: 'question' | 'answer';
}

declare global {
  interface Window {
    hourglass: {
      loadCard: (json: string) => void;
    };
    pycmd: (command: string) => void;
    // --- LES LEURRES POUR LES VIEILLES CARTES ---
    showAnswer: () => void;
    _showAnswer: () => void;
    getTypedAnswer: () => string;
  }
}

function Artifact({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_state, delta) => {
    meshRef.current.rotation.x += delta * (active ? 0.5 : 0.2);
    meshRef.current.rotation.y += delta * (active ? 0.8 : 0.3);
  });

  return (
    <Float speed={active ? 5 : 2} rotationIntensity={active ? 2 : 1} floatIntensity={2}>
      <mesh ref={meshRef} scale={active ? 1.5 : 1}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          color={active ? "#0D9488" : "#F59E0B"} 
          wireframe={true}
          emissive={active ? "#0D9488" : "#F59E0B"}
          emissiveIntensity={active ? 3 : 0.5}
        />
      </mesh>
    </Float>
  );
}

function App() {
  const [card, setCard] = useState<CardData | null>(null);

  useEffect(() => {
    // 1. Définition du Pont Hourglass
    window.hourglass = {
      loadCard: (json: string) => {
        try {
          const data = JSON.parse(json);
          console.log("React a reçu :", data);
          setCard(data);
        } catch (e) {
          console.error("Erreur de lecture de la carte", e);
        }
      }
    };

    // 2. Définition des Leurres (Pour éviter les erreurs JS des cartes)
    window.showAnswer = () => window.pycmd('ans'); // Si la carte a son propre bouton
    window._showAnswer = () => {};
    window.getTypedAnswer = () => ""; // Pour les champs de saisie

  }, []);

  return (
    <div className="relative w-full h-full bg-lapis-night overflow-hidden font-sans">
      
      {/* UI Calque */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col items-center justify-center pointer-events-none p-10">
        
        {!card ? (
          <div className="text-center animate-pulse">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sacred-sand to-divine-gold uppercase tracking-widest">
              En attente du savoir...
            </h1>
          </div>
        ) : (
          <div className="bg-lapis-night/80 backdrop-blur-xl border border-divine-gold/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(13,148,136,0.2)] max-w-3xl w-full pointer-events-auto transition-all duration-500">
            
            {/* Contenu de la carte */}
            <div 
              className="prose prose-invert prose-lg text-center text-sacred-sand mx-auto"
              dangerouslySetInnerHTML={{ __html: card.content }} 
            />

            {/* Bouton Révéler */}
            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => window.pycmd('ans')}
                className="px-8 py-3 bg-cosmic-teal/20 hover:bg-cosmic-teal/40 border border-cosmic-teal text-cosmic-teal rounded-full transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] cursor-pointer font-bold uppercase tracking-wider"
              >
                Révéler
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Scène 3D */}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#F59E0B" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#0D9488" />
        <Artifact active={!!card} />
      </Canvas>
    </div>
  );
}

export default App;