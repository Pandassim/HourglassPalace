import { motion } from 'framer-motion';
import { useState } from 'react';
import { GlassCard } from './GlassCard';

interface Deck {
    id: number;
    name: string;
    count: number; 
}

interface StarMapProps {
    decks: Deck[];
    onSelect: (id: number) => void;
}

export function StarMap({ decks, onSelect }: StarMapProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrage des constellations
    const filteredDecks = decks.filter(deck => 
        deck.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-5xl h-[80vh] flex flex-col p-4">
            {/* En-tête */}
            <div className="text-center mb-8 shrink-0">
                <h1 className="font-serif text-4xl text-divine-gold tracking-[0.3em] uppercase drop-shadow-lg">
                    The Constellations
                </h1>
                
                {/* LE PRISME DE RECHERCHE */}
                <div className="mt-6 relative max-w-md mx-auto group">
                    <input 
                        type="text" 
                        placeholder="Search the void..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-lapis-night/50 border-b-2 border-divine-gold/30 text-sacred-sand placeholder-white/20 py-2 px-4 text-center focus:outline-none focus:border-divine-gold transition-all duration-300 font-serif tracking-widest uppercase text-sm"
                    />
                    {/* Lueur au focus */}
                    <div className="absolute inset-0 bg-divine-gold/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
            </div>

            {/* Grille défilante */}
            <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {filteredDecks.map((deck, i) => (
                        <motion.div
                            key={deck.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => onSelect(deck.id)}
                            className="cursor-pointer group"
                        >
                            <GlassCard className="h-40 flex flex-col justify-between hover:bg-lapis-night/80 hover:border-divine-gold/50 transition-all duration-300 relative overflow-hidden">
                                {/* Effet de survol (Lumière) */}
                                <div className="absolute inset-0 bg-gradient-to-br from-divine-gold/0 via-divine-gold/0 to-divine-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <h3 className="font-serif text-xl text-sacred-sand group-hover:text-divine-gold transition-colors z-10">
                                    {deck.name.split('::').pop()}
                                </h3>
                                
                                <div className="flex justify-between items-end z-10">
                                    <span className="text-xs font-mono text-white/30">
                                        ID: {deck.id}
                                    </span>
                                    {deck.count > 0 && (
                                        <span className="px-3 py-1 rounded-full bg-cosmic-teal/20 text-cosmic-teal text-xs font-bold border border-cosmic-teal/30 shadow-[0_0_10px_rgba(13,148,136,0.3)]">
                                            {deck.count} New
                                        </span>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                    
                    {filteredDecks.length === 0 && (
                        <div className="col-span-full text-center py-20 opacity-50 italic font-serif text-sacred-sand">
                            The void remains silent...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}