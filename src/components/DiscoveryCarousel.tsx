import React from 'react';
import { motion } from 'motion/react';
import { playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  Coins, 
  Compass, 
  MapPin, 
  Sparkles, 
  Volume2, 
  Heart, 
  LucideIcon
} from 'lucide-react';

interface DiscoveryItem {
  id: string;
  title: string;
  titlePt: string;
  subtitle: string;
  badge: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  onClick: () => void;
}

interface DiscoveryCarouselProps {
  lang: 'pt' | 'en';
  onOpenCashier: () => void;
  onOpenSurvival: () => void;
  onOpenMap: () => void;
  onOpenBridge: () => void;
  onOpenSpeaking: () => void;
  onOpenLove: () => void;
}

export const DiscoveryCarousel: React.FC<DiscoveryCarouselProps> = ({
  lang,
  onOpenCashier,
  onOpenSurvival,
  onOpenMap,
  onOpenBridge,
  onOpenSpeaking,
  onOpenLove,
}) => {
  const items: DiscoveryItem[] = [
    {
      id: 'cashier',
      title: 'Euro Cashier',
      titlePt: 'Caixa de Euros',
      subtitle: 'युरो मुद्रा हिसाब',
      badge: 'SPEED',
      icon: Coins,
      color: 'text-[#30d158]',
      gradient: 'from-[#30d158]/15 via-[#30d158]/5 to-transparent',
      onClick: () => {
        playTone(550, 'sine', 0.03);
        triggerHaptic('light');
        onOpenCashier();
      },
    },
    {
      id: 'survival',
      title: 'Lisbon Survival',
      titlePt: 'Sobrevivência',
      subtitle: 'विमानस्थल र क्याफे',
      badge: 'SCENARIOS',
      icon: Compass,
      color: 'text-[#ffd60a]',
      gradient: 'from-[#ffd60a]/15 via-[#ffd60a]/5 to-transparent',
      onClick: () => {
        playTone(550, 'sine', 0.03);
        triggerHaptic('light');
        onOpenSurvival();
      },
    },
    {
      id: 'map',
      title: 'Bridging Our Worlds',
      titlePt: 'Roteiro de Viagem',
      subtitle: 'दृश्य यात्रा',
      badge: 'MAP',
      icon: MapPin,
      color: 'text-[#0a84ff]',
      gradient: 'from-[#0a84ff]/20 via-[#0a84ff]/5 to-transparent',
      onClick: () => {
        playTone(550, 'sine', 0.03);
        triggerHaptic('light');
        onOpenMap();
      },
    },
    {
      id: 'bridge',
      title: 'Nepali ➔ PT Bridge',
      titlePt: 'Ponte Nepalês ➔ PT',
      subtitle: 'ध्वनि र स्ल्याङ',
      badge: 'PHONETICS',
      icon: Sparkles,
      color: 'text-[#bf5af2]',
      gradient: 'from-[#bf5af2]/20 via-[#bf5af2]/5 to-transparent',
      onClick: () => {
        playTone(550, 'sine', 0.03);
        triggerHaptic('light');
        onOpenBridge();
      },
    },
    {
      id: 'love',
      title: 'Romance & Love',
      titlePt: 'Diálogos de Amor',
      subtitle: 'सुजन र अमिषा',
      badge: 'SPECIAL',
      icon: Heart,
      color: 'text-[#ff375f]',
      gradient: 'from-[#ff375f]/20 via-[#ff375f]/5 to-transparent',
      onClick: () => {
        playTone(550, 'sine', 0.03);
        triggerHaptic('light');
        onOpenLove();
      },
    },
    {
      id: 'speaking',
      title: 'Speak It (AI Lab)',
      titlePt: 'Laboratório de Voz IA',
      subtitle: 'आवाज रेकर्ड र AI फिडब्याक',
      badge: 'LAB',
      icon: Volume2,
      color: 'text-[#5e5ce6]',
      gradient: 'from-[#5e5ce6]/20 via-[#5e5ce6]/5 to-transparent',
      onClick: () => {
        playTone(550, 'sine', 0.03);
        triggerHaptic('light');
        onOpenSpeaking();
      },
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === 'pt' ? 'Explorar Práticas Rápidas' : 'Quick Discovery & Labs'}
          </h3>
        </div>
        <span className="text-[10px] font-bold text-zinc-500">
          Swipe ➔
        </span>
      </div>

      {/* Horizontal Snap Scrolling Strip with Staggered Motion */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.05 }
          }
        }}
        className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x"
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, scale: 0.94, y: 10 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: 'spring', damping: 22, stiffness: 300 }
                }
              }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={item.onClick}
              className={`ios-card ios-glass snap-start shrink-0 w-44 sm:w-48 group relative overflow-hidden p-4 cursor-pointer space-y-2.5 active:scale-[0.98] transition-all`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-60 pointer-events-none group-hover:opacity-90 transition-opacity`} />

              <div className="relative z-10 flex items-center justify-between">
                <div className={`flex h-8 w-8 items-center justify-center rounded-[12px] bg-white/10 ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  {item.badge}
                </span>
              </div>

              <div className="relative z-10 min-w-0">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-[#0a84ff] transition-colors">
                  {lang === 'pt' ? item.titlePt : item.title}
                </h4>
                <p className="text-[10px] font-semibold text-[#ffd60a] truncate">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
