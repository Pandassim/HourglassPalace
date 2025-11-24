import { Sparkles, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
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

function App() {
  const [view, setView] = useState<ViewState>('MAP'); 
  const [reviewState, setReviewState] = useState<ReviewState>('IDLE');
  const [card, setCard] = useState<CardData | null>(null);
  const [decks, setDecks] = useState<any[]>([
    { id: 1, name: "Default::Test Deck", count: 5 },
    { id: 2, name: "Science::Physics", count: 12 },
    { id: 3, name: "Philosophy::Stoicism", count: 0 }
]);

  useEffect(() => {
    // --- LE PONT ---
    window.hourglass = {
      loadCard: (json: string) => {
        try {
          const data = JSON.parse(json);
          setCard(data);
          setView('REVIEW');
          setReviewState('QUESTION');
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

    // Leurres
    window.showAnswer = () => setReviewState('ANSWER');
    window._showAnswer = () => {};
    window.getTypedAnswer = () => "";
    
    // Signal de démarrage envoyé à Python
    setTimeout(() => window.pycmd("palace:init"), 1000);

  }, []);

  const handleAnswer = (ease: number) => {
    window.pycmd(`ease:${ease}`);
    setCard(null);
    setReviewState('IDLE');
  };

  const handleDeckSelect = (deckId: number) => {
    window.pycmd(`open:${deckId}`);
  };

  return (
    <div className="relative w-full h-full bg-lapis-night overflow-hidden text-sacred-sand select-none font-sans">
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
        
        {/* VUE 1: LA CARTE (Choix du deck) */}
        {view === 'MAP' && (
            <StarMap decks={decks} onSelect={handleDeckSelect} />
        )}

        {/* VUE 2: LE TEMPLE (Révision) */}
        {view === 'REVIEW' && (
          <>
            {card && <HUD deckName={card.deckName} retention={card.retention} stability={card.stability} />}
            
            {card && (reviewState === 'QUESTION' || reviewState === 'ANSWER') && (
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

            {reviewState === 'ANSWER' && card && (
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
      </Canvas>
    </div>
  );
}

export default App;