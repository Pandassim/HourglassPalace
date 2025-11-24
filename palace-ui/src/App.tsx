import { Float, Sparkles, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ActionBar } from './components/ActionBar';
import { GlassCard } from './components/GlassCard';
import { HUD } from './components/HUD';
import { StarMap } from './components/StarMap';

// --- TYPES ---
type ViewState = 'MAP' | 'REVIEW';
type ReviewState = 'IDLE' | 'QUESTION' | 'ANSWER';

interface CardData {
  id: number;
  content: string;
  state: 'question' | 'answer';
  deckName: string;
  retention: number;
  stability: number;
  next_times: string[];
}

declare global {
  interface Window {
    hourglass: { 
        loadCard: (json: string) => void;
        loadDecks: (json: string) => void;
    };
    pycmd: (command: string) => void;
    showAnswer: () => void;
    _showAnswer: () => void;
    getTypedAnswer: () => string;
  }
}

// --- COMPOSANT 3D: L'ARTEFACT & L'EXPLOSION ---
function Artifact({ active, shattering }: { active: boolean; shattering: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  
  useFrame((state, delta) => {
    // 1. Animation de l'objet solide
    if (meshRef.current) {
        // Rotation de base
        meshRef.current.rotation.x += delta * (active ? 0.5 : 0.2);
        meshRef.current.rotation.y += delta * (active ? 0.8 : 0.3);
        
        // Effet de "Glitch" violent si ça explose
        if (shattering) {
            const shake = 0.2;
            meshRef.current.position.x = (Math.random() - 0.5) * shake;
            meshRef.current.position.y = (Math.random() - 0.5) * shake;
            meshRef.current.position.z = (Math.random() - 0.5) * shake;
            // Il rétrécit avant de disparaître
            meshRef.current.scale.multiplyScalar(0.9);
        } else {
            // Retour à la normale
            meshRef.current.position.set(0,0,0);
            // Interpolation douce vers la taille normale
            meshRef.current.scale.lerp(new THREE.Vector3(active ? 1.5 : 1, active ? 1.5 : 1, active ? 1.5 : 1), 0.1);
        }
    }
    
    // 2. Animation des particules (Eclats de verre)
    if (particlesRef.current) {
        particlesRef.current.visible = shattering;
        if (shattering) {
            // Explosion vers l'extérieur
            particlesRef.current.scale.multiplyScalar(1.1);
            particlesRef.current.rotation.y += delta * 2;
        } else {
            // Reset
            particlesRef.current.scale.setScalar(1);
        }
    }
  });

  return (
    <Float speed={active ? 5 : 2} rotationIntensity={active ? 2 : 1} floatIntensity={2}>
      {/* L'Objet Principal (Icosaèdre) */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          color={active ? "#0D9488" : "#F59E0B"} 
          wireframe={true}
          emissive={active ? "#0D9488" : "#F59E0B"}
          emissiveIntensity={active ? 3 : 0.5}
          transparent
          opacity={shattering ? 0.5 : 1}
        />
      </mesh>

      {/* Les Particules d'Explosion (Cachées sauf si shattering) */}
      <points ref={particlesRef} visible={false}>
          {/* On crée un nuage de points autour */}
          <icosahedronGeometry args={[2, 2]} />
          <pointsMaterial color="#EF4444" size={0.15} transparent opacity={0.8} sizeAttenuation={true} />
      </points>
    </Float>
  );
}

// --- MAIN APP ---
function App() {
  const [view, setView] = useState<ViewState>('MAP'); 
  const [reviewState, setReviewState] = useState<ReviewState>('IDLE');
  const [card, setCard] = useState<CardData | null>(null);
  const [decks, setDecks] = useState<any[]>([]);
  const [isShattering, setIsShattering] = useState(false); // Nouvel état pour l'animation

  useEffect(() => {
    window.hourglass = {
      loadCard: (json: string) => {
        try {
          const data = JSON.parse(json);
          setCard(data);
          setView('REVIEW');
          setReviewState('QUESTION');
          setIsShattering(false); // Reset état explosion
        } catch (e) { console.error(e); }
      },
      loadDecks: (json: string) => {
        try {
          const data = JSON.parse(json);
          console.log("Decks reçus:", data);
          setDecks(data);
          setView('MAP');
        } catch (e) { console.error(e); }
      }
    };

    window.showAnswer = () => setReviewState('ANSWER');
    window._showAnswer = () => {};
    window.getTypedAnswer = () => "";
    
    setTimeout(() => window.pycmd("palace:init"), 1000);
  }, []);

  const handleAnswer = (ease: number) => {
    if (ease === 1) {
      // --- CAS ECHEC (SHATTER) ---
      setIsShattering(true); // Déclenche l'animation 3D
      
      // On attend 800ms que l'animation joue avant de dire à Anki de passer à la suite
      setTimeout(() => {
        window.pycmd(`ease:${ease}`);
        setCard(null);
        setReviewState('IDLE');
        setIsShattering(false);
      }, 800);
    } else {
      // --- CAS SUCCES ---
      window.pycmd(`ease:${ease}`);
      setCard(null);
      setReviewState('IDLE');
    }
  };

  const handleDeckSelect = (deckId: number) => {
    window.pycmd(`open:${deckId}`);
  };

  return (
    <div className="relative w-full h-full bg-lapis-night overflow-hidden text-sacred-sand select-none font-sans">
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
        
        {/* VUE 1: LA CARTE */}
        {view === 'MAP' && (
            <StarMap decks={decks} onSelect={handleDeckSelect} />
        )}

        {/* VUE 2: LE TEMPLE */}
        {view === 'REVIEW' && (
          <>
            {card && <HUD deckName={card.deckName} retention={card.retention} stability={card.stability} />}
            
            {/* On cache la carte pendant l'explosion pour que l'utilisateur regarde la 3D */}
            {!isShattering && card && (reviewState === 'QUESTION' || reviewState === 'ANSWER') && (
              <GlassCard className="max-w-3xl w-full max-h-[70vh] overflow-y-auto no-scrollbar mt-12">
                <div 
                  className="prose prose-invert prose-lg max-w-none text-center font-serif leading-relaxed text-sacred-sand"
                  dangerouslySetInnerHTML={{ __html: card.content }} 
                />
                
                {reviewState === 'QUESTION' && (
                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={() => { window.pycmd('ans'); setReviewState('ANSWER'); }}
                      className="px-10 py-3 bg-divine-gold/10 hover:bg-divine-gold/20 border border-divine-gold text-divine-gold rounded-full transition-all hover:tracking-widest duration-300 uppercase font-bold text-sm"
                    >
                      Reveal Truth
                    </button>
                  </div>
                )}
              </GlassCard>
            )}

            {/* On cache les boutons pendant l'explosion */}
            {!isShattering && reviewState === 'ANSWER' && card && (
              <ActionBar onAnswer={handleAnswer} nextTimes={card.next_times} />
            )}
            
            <button 
                onClick={() => { window.pycmd("deckBrowser"); setView('MAP'); }}
                className="absolute top-6 left-6 opacity-50 hover:opacity-100 text-xs uppercase tracking-widest cursor-pointer z-50"
            >
                ← Return to Void
            </button>
          </>
        )}
      </div>

      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#F59E0B" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={view === 'REVIEW' ? 0.2 : 1} />
        <Sparkles count={view === 'MAP' ? 200 : 50} scale={view === 'MAP' ? 12 : 8} size={3} speed={0.2} opacity={0.3} color="#0D9488" />
        
        {/* L'Artefact est maintenant connecté à l'état de la carte et de l'explosion */}
        {view === 'REVIEW' && (
            <Artifact active={!!card} shattering={isShattering} />
        )}
      </Canvas>
    </div>
  );
}

export default App;