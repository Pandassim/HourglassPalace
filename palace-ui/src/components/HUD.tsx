interface HUDProps {
  deckName: string;
  retention: number | undefined | null;
  stability: number | undefined | null;
}

export function HUD({ deckName, retention, stability }: HUDProps) {
  // Sécurité : Valeurs par défaut si undefined
  const safeRetention = retention ?? 0;
  const safeStability = stability ?? 0;

  // Code couleur
  const retentionColor = safeRetention >= 0.9 ? "text-emerald-400" : safeRetention >= 0.8 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-50">
      {/* Nom du Deck */}
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-sacred-sand/50 font-sans">Current Domain</span>
        <h2 className="font-serif text-xl text-divine-gold tracking-widest uppercase drop-shadow-md">
          {deckName || "Unknown Realm"}
        </h2>
      </div>

      {/* Stats FSRS (Look Terminal) */}
      <div className="flex flex-col items-end font-mono text-xs bg-black/40 backdrop-blur-md p-3 rounded border border-white/10">
        <div className="flex gap-4">
          <span>RET: <span className={retentionColor}>{(safeRetention * 100).toFixed(0)}%</span></span>
          <span className="text-blue-400">STAB: {safeStability.toFixed(1)}d</span>
        </div>
      </div>
    </div>
  );
}