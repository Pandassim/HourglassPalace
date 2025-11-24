import { clsx, type ClassValue } from 'clsx';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0, 0.55, 0.45, 1] }}
      className={cn(
        "relative overflow-hidden",
        "bg-lapis-night/60 backdrop-blur-2xl", // L'effet verre
        "border border-divine-gold/20", // La bordure sacrée
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]", // L'ombre profonde
        "rounded-2xl p-8",
        className
      )}
    >
      {/* Reflet subtil en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-divine-gold/50 to-transparent opacity-50" />
      
      {children}
    </motion.div>
  );
}