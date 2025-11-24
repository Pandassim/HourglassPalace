import { motion } from 'framer-motion';

interface ActionBarProps {
  onAnswer: (ease: number) => void;
  nextTimes?: string[]; // ["10m", "2d", "4d", "8d"]
}

export function ActionBar({ onAnswer, nextTimes = ["-", "-", "-", "-"] }: ActionBarProps) {
  const buttons = [
    { ease: 1, label: "SHATTER", sub: "Again", color: "border-red-500/30 hover:bg-red-500/10 text-red-400" },
    { ease: 2, label: "REFINE", sub: "Hard", color: "border-orange-500/30 hover:bg-orange-500/10 text-orange-400" },
    { ease: 3, label: "SOLIDIFY", sub: "Good", color: "border-cosmic-teal/30 hover:bg-cosmic-teal/10 text-cosmic-teal" },
    { ease: 4, label: "TRANSCEND", sub: "Easy", color: "border-blue-500/30 hover:bg-blue-500/10 text-blue-400" },
  ];

  return (
    <div className="absolute bottom-8 left-0 w-full flex justify-center gap-4 z-50 px-8">
      {buttons.map((btn, index) => (
        <motion.button
          key={btn.ease}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onAnswer(btn.ease)}
          className={`
            flex flex-col items-center justify-center
            w-32 h-16 rounded-lg backdrop-blur-md
            border ${btn.color} transition-all duration-200
            hover:scale-105 active:scale-95 group
          `}
        >
          <span className="font-serif text-sm tracking-widest font-bold">{btn.label}</span>
          <span className="text-[10px] font-mono opacity-50 group-hover:opacity-100">
            {nextTimes[index]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}