import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress } from '../types';
import { playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  Gamepad2, 
  Sparkles, 
  Flame, 
  Coins, 
  Gem, 
  Zap, 
  Volume2, 
  Layers, 
  Compass, 
  Heart, 
  Play, 
  MapPin,
  CheckCircle2,
  LucideIcon,
  Mic,
  Euro,
  Star,
  BookOpen
} from 'lucide-react';
import { FlagPortugal, FlagNepal, GoldCoin } from './icons/PremiumIcons';

interface ArcadeHubSectionProps {
  progress: UserProgress;
  lang: 'pt' | 'en';
  onStartGlobalGame: (mode: 'match' | 'speaking' | 'builder') => void;
  onOpenSurvival: () => void;
  onOpenCashier: () => void;
  onOpenMap: () => void;
  onOpenBridge: () => void;
  onOpenStory: () => void;
  onOpenLovePhrases: () => void;
  onOpenQuests: () => void;
}

type TabCategory = 'featured' | 'culture' | 'speed' | 'voice' | 'all';

interface GameItem {
  id: string;
  title: string;
  titlePt: string;
  nepaliSub: string;
  desc: string;
  descPt: string;
  rewardXP: number;
  rewardCoins: number;
  rewardGem?: boolean;
  category: 'culture' | 'speed' | 'voice';
  isFeatured?: boolean;
  tag: string;
  icon: LucideIcon;
  iconBg: string;
  accentBorder: string;
  glow: string;
  btnGradient: string;
  onClick: () => void;
}

export const ArcadeHubSection: React.FC<ArcadeHubSectionProps> = ({
  progress,
  lang,
  onStartGlobalGame,
  onOpenSurvival,
  onOpenCashier,
  onOpenMap,
  onOpenBridge,
  onOpenLovePhrases,
  onOpenQuests,
}) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('featured');

  const allGames: GameItem[] = [
    {
      id: 'euro_cashier',
      title: 'Euro Cashier Drill',
      titlePt: 'Caixa de Euros em Lisboa',
      nepaliSub: 'युरो मुद्रा र तीव्र हिसाब',
      desc: 'Rapid Lisbon market price listening & exact change counter.',
      descPt: 'Ouça preços rápidos e conte notas e moedas de euro.',
      rewardXP: 25,
      rewardCoins: 50,
      rewardGem: true,
      category: 'speed',
      isFeatured: true,
      tag: 'HOT',
      icon: Coins,
      iconBg: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400',
      accentBorder: 'hover:border-emerald-500/60 dark:hover:border-emerald-500/60',
      glow: 'from-emerald-500/10',
      btnGradient: 'bg-emerald-500 hover:bg-emerald-600',
      onClick: () => {
        playTone(550, 'sine', 0.04);
        triggerHaptic('light');
        onOpenCashier();
      },
    },
    {
      id: 'survival_simulator',
      title: 'Portugal Survival Sim',
      titlePt: 'Simulador de Sobrevivência',
      nepaliSub: 'विमानस्थल र क्याफे सिमुलेटर',
      desc: 'Lisbon Airport, Pastelaria, Metro & Pharmacy real missions.',
      descPt: 'Missões reais no Aeroporto de Lisboa, Pastelaria e Metro.',
      rewardXP: 30,
      rewardCoins: 45,
      rewardGem: true,
      category: 'culture',
      isFeatured: true,
      tag: 'AMISHA SPECIAL',
      icon: Compass,
      iconBg: 'bg-amber-500/15 text-amber-500 dark:text-amber-400',
      accentBorder: 'hover:border-amber-500/60 dark:hover:border-amber-500/60',
      glow: 'from-amber-500/10',
      btnGradient: 'bg-amber-500 hover:bg-amber-600',
      onClick: () => {
        playTone(550, 'sine', 0.04);
        triggerHaptic('light');
        onOpenSurvival();
      },
    },
    {
      id: 'portugal_map',
      title: 'Lisbon & Porto Journey',
      titlePt: 'Roteiro de Portugal',
      nepaliSub: 'दृश्य यात्रा र पासपोर्ट छाप',
      desc: '10 iconic landmarks with audio quizzes and travel tips.',
      descPt: '10 pontos turísticos com quizzes de áudio e carimbos.',
      rewardXP: 25,
      rewardCoins: 40,
      category: 'culture',
      isFeatured: true,
      tag: 'MAP JOURNEY',
      icon: MapPin,
      iconBg: 'bg-sky-500/15 text-sky-500 dark:text-sky-400',
      accentBorder: 'hover:border-sky-500/60 dark:hover:border-sky-500/60',
      glow: 'from-sky-500/10',
      btnGradient: 'bg-sky-500 hover:bg-sky-600',
      onClick: () => {
        playTone(550, 'sine', 0.04);
        triggerHaptic('light');
        onOpenMap();
      },
    },
    {
      id: 'nepali_bridge',
      title: 'Nepali ➔ PT Bridge',
      titlePt: 'Ponte Nepalês ➔ PT',
      nepaliSub: 'ध्वनि र संस्कृति सेतू',
      desc: 'Nasal sounds (-ão = ँ), Lisbon street slang & etiquette.',
      descPt: 'Sons nasais, gírias e etiqueta com apoio em Nepalês.',
      rewardXP: 20,
      rewardCoins: 35,
      category: 'culture',
      isFeatured: true,
      tag: 'PHONETICS',
      icon: Sparkles,
      iconBg: 'bg-purple-500/15 text-purple-500 dark:text-purple-400',
      accentBorder: 'hover:border-purple-500/60 dark:hover:border-purple-500/60',
      glow: 'from-purple-500/10',
      btnGradient: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => {
        playTone(550, 'sine', 0.04);
        triggerHaptic('light');
        onOpenBridge();
      },
    },
    {
      id: 'memory_match',
      title: 'Speed Match Pairs',
      titlePt: 'Combinação Rápida',
      nepaliSub: 'द्रुत शब्द जोडी',
      desc: 'Fast-paced word-meaning matching blitz under 45 seconds.',
      descPt: 'Combine pares de palavras antes do tempo acabar.',
      rewardXP: 20,
      rewardCoins: 30,
      category: 'speed',
      tag: 'SPEED BLITZ',
      icon: Layers,
      iconBg: 'bg-blue-500/15 text-blue-500 dark:text-blue-400',
      accentBorder: 'hover:border-blue-500/60 dark:hover:border-blue-500/60',
      glow: 'from-blue-500/10',
      btnGradient: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => {
        playTone(550, 'sine', 0.04);
        triggerHaptic('light');
        onStartGlobalGame('match');
      },
    },
    {
      id: 'voice_drill',
      title: 'Speak It (Voice Lab)',
      titlePt: 'Laboratório de Voz & IA',
      nepaliSub: 'आवाज रेकर्डिङ र AI उच्चारण',
      desc: 'Record your voice with MediaRecorder & receive instant AI pronunciation coaching.',
      descPt: 'Grave a sua voz e receba avaliação de pronúncia com IA.',
      rewardXP: 25,
      rewardCoins: 35,
      category: 'voice',
      tag: 'AI VOICE',
      icon: Volume2,
      iconBg: 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400',
      accentBorder: 'hover:border-indigo-500/60 dark:hover:border-indigo-500/60',
      glow: 'from-indigo-500/10',
      btnGradient: 'bg-indigo-600 hover:bg-indigo-700',
      onClick: () => {
        playTone(550, 'sine', 0.04);
        triggerHaptic('light');
        onStartGlobalGame('speaking');
      },
    },
    {
      id: 'sentence_builder',
      title: 'Sentence Builder',
      titlePt: 'Construtor de Frases',
      nepaliSub: 'वाक्य निर्माण अभ्यास',
      desc: 'Assemble scrambled words with European grammar rules.',
      descPt: 'Construa frases em ordem correta.',
      rewardXP: 20,
      rewardCoins: 30,
      category: 'speed',
      tag: 'GRAMMAR',
      icon: Zap,
      iconBg: 'bg-orange-500/15 text-orange-500 dark:text-orange-400',
      accentBorder: 'hover:border-orange-500/60 dark:hover:border-orange-500/60',
      glow: 'from-orange-500/10',
      btnGradient: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => {
        playTone(550, 'sine', 0.04);
        triggerHaptic('light');
        onStartGlobalGame('builder');
      },
    },
    {
      id: 'love_romance',
      title: 'Sujan & Amisha Love',
      titlePt: 'Amor & Diálogos',
      nepaliSub: 'मायालु संवाद',
      desc: 'Pet names ("Puntey", "Meu Amor") & sweet Lisbon dialogues.',
      descPt: 'Frases carinhosas e histórias em Lisboa.',
      rewardXP: 25,
      rewardCoins: 40,
      rewardGem: true,
      category: 'voice',
      tag: 'ROMANCE',
      icon: Heart,
      iconBg: 'bg-rose-500/15 text-rose-500 dark:text-rose-400',
      accentBorder: 'hover:border-rose-500/60 dark:hover:border-rose-500/60',
      glow: 'from-rose-500/10',
      btnGradient: 'bg-rose-500 hover:bg-rose-600',
      onClick: () => {
        playTone(550, 'sine', 0.04);
        triggerHaptic('light');
        onOpenLovePhrases();
      },
    },
  ];

  // Filter games based on selected tab
  const displayedGames = allGames.filter(g => {
    if (activeTab === 'featured') return g.isFeatured;
    if (activeTab === 'culture') return g.category === 'culture';
    if (activeTab === 'speed') return g.category === 'speed';
    if (activeTab === 'voice') return g.category === 'voice';
    return true;
  });

  return (
    <section className="ios-card ios-glass relative overflow-hidden p-5 sm:p-6 mb-8 transition-all">
      
      {/* Subtle backdrop ambient glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-500/8 via-purple-500/4 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-500/8 via-rose-500/4 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white shadow-md shadow-amber-500/10">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {lang === 'pt' ? 'Arcade & Prática Interativa' : 'Practice Arena & Mini-Games'}
              </h2>
              <span className="hidden sm:inline-block rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-600 dark:text-amber-400">
                8 MODES
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'pt' ? 'Jogos rápidos para ganhar XP, moedas e gemas' : 'Quick exercises, real Lisbon simulations & speed drills'}
            </p>
          </div>
        </div>

        {/* Quest shortcut button */}
        <button
          onClick={onOpenQuests}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-200 transition-all cursor-pointer group"
          title="Daily Quests"
        >
          <span className="text-amber-500 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" /> {progress.coins}
          </span>
          <span className="text-purple-500 flex items-center gap-1">
            <Gem className="w-3.5 h-3.5" /> {progress.gems}
          </span>
          <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
            Quests ➔
          </span>
        </button>

      </div>

      {/* Sleek Segmented Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {[
          { id: 'featured', label: lang === 'pt' ? 'Em Destaque' : 'Top Picks', icon: Flame },
          { id: 'culture', label: lang === 'pt' ? 'Portugal Real' : 'Real Portugal', icon: Compass },
          { id: 'speed', label: lang === 'pt' ? 'Rapidez & Moedas' : 'Speed & Cash', icon: Zap },
          { id: 'voice', label: lang === 'pt' ? 'Voz & Amor' : 'Voice & Love', icon: Volume2 },
          { id: 'all', label: `${lang === 'pt' ? 'Todos' : 'All'} (${allGames.length})`, icon: Layers },
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playTone(550, 'sine', 0.02);
                setActiveTab(tab.id as TabCategory);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs scale-[1.02]'
                  : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Compact Aesthetic Game Cards Grid */}
      <motion.div 
        key={activeTab}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {displayedGames.map((game) => {
          const IconComponent = game.icon;

          return (
            <motion.div
              key={game.id}
              variants={{
                hidden: { opacity: 0, scale: 0.94, y: 12 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: 'spring', damping: 20, stiffness: 280 }
                }
              }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={game.onClick}
              className={`ios-card ios-glass group relative flex flex-col justify-between overflow-hidden p-4 ${game.accentBorder} transition-all duration-200 cursor-pointer`}
            >
              {/* Subtle top ambient glow */}
              <div className={`absolute top-0 inset-x-0 h-16 bg-gradient-to-b ${game.glow} to-transparent opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity`} />

              {/* Card Header: Icon + Title + Nepali Subtitle */}
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${game.iconBg} group-hover:scale-105 transition-transform`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span className="rounded-md bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {game.tag}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                  {lang === 'pt' ? game.titlePt : game.title}
                </h3>

                <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 truncate mt-0.5">
                  {game.nepaliSub}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                  {lang === 'pt' ? game.descPt : game.desc}
                </p>
              </div>

              {/* Card Footer: Rewards + Play Action */}
              <div className="relative z-10 pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    +{game.rewardXP}XP
                  </span>
                  <span>•</span>
                  <span className="text-amber-500 flex items-center gap-0.5">
                    <GoldCoin size={12} />
                    +{game.rewardCoins}
                  </span>
                  {game.rewardGem && (
                    <span className="text-purple-500 flex items-center gap-0.5">
                      <Gem className="w-3 h-3 text-purple-400" />
                      +1
                    </span>
                  )}
                </div>

                <button
                  className={`flex h-7 items-center gap-1 px-2.5 rounded-lg ${game.btnGradient} text-white font-black text-[11px] shadow-2xs group-hover:shadow-xs transition-all active:scale-95 cursor-pointer shrink-0`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>{lang === 'pt' ? 'Jogar' : 'Play'}</span>
                </button>
              </div>

            </motion.div>
          );
        })}
      </motion.div>

    </section>
  );
};
