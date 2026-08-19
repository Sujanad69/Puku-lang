import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Volume2, Sparkles, ShoppingBag, Coins, 
  RotateCcw, Check, ArrowRight, Zap, Trophy, HelpCircle, 
  Flame, Coffee, Award, AlertCircle, Droplets, Sandwich,
  Fish, Ticket, Cake, Citrus, UtensilsCrossed, ShoppingCart,
  Lightbulb, Calculator, DollarSign, Euro, Star
} from 'lucide-react';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { FlagNepal, GoldCoin, XpBadgeIcon, EuroCurrencyIcon, PremiumTrophy } from './icons/PremiumIcons';

interface PriceOrder {
  id: string;
  itemPt: string;
  itemEn: string;
  itemNepali: string;
  icon: React.ComponentType<{ className?: string }>;
  euros: number;
  cents: number;
  spokenPt: string;
  writtenPt: string;
  nepaliPhonetic: string;
  customerName: string;
}

const CASHIER_ORDERS: PriceOrder[] = [
  {
    id: 'ord-1',
    itemPt: 'Um café expresso (bica)',
    itemEn: 'One espresso coffee',
    itemNepali: 'एक कप कफी (बिका)',
    icon: Coffee,
    euros: 0,
    cents: 80,
    spokenPt: 'Oitenta cêntimos, por favor.',
    writtenPt: 'Oitenta cêntimos (0,80 €)',
    nepaliPhonetic: 'ओइतेन्ता सेन्तिमुश, पोर फाभोर (०.८० €)',
    customerName: 'Sr. António'
  },
  {
    id: 'ord-2',
    itemPt: 'Um pastel de nata e galão',
    itemEn: 'One custard tart and milky coffee',
    itemNepali: 'पेस्ट्री र दुध-कफी',
    icon: Cake,
    euros: 2,
    cents: 50,
    spokenPt: 'São dois euros e cinquenta cêntimos.',
    writtenPt: 'Dois euros e cinquenta (2,50 €)',
    nepaliPhonetic: 'दोइश एउरुश इ सिङ्कुएन्ता (२.५० €)',
    customerName: 'Dona Maria'
  },
  {
    id: 'ord-3',
    itemPt: 'Uma garrafa de água sem gás',
    itemEn: 'One still water bottle',
    itemNepali: 'सादा पानीको बोतल',
    icon: Droplets,
    euros: 1,
    cents: 20,
    spokenPt: 'Um euro e vinte cêntimos.',
    writtenPt: 'Um euro e vinte (1,20 €)',
    nepaliPhonetic: 'उँ एउरु इ भिन्ते (१.२० €)',
    customerName: 'João'
  },
  {
    id: 'ord-4',
    itemPt: 'Uma tosta mista prensada',
    itemEn: 'Ham and cheese toastie',
    itemNepali: 'चीज र ह्याम टोस्ट',
    icon: Sandwich,
    euros: 3,
    cents: 80,
    spokenPt: 'Três euros e oitenta cêntimos.',
    writtenPt: 'Três euros e oitenta (3,80 €)',
    nepaliPhonetic: 'त्रेश एउरुश इ ओइतेन्ता (३.८० €)',
    customerName: 'Beatriz'
  },
  {
    id: 'ord-5',
    itemPt: 'Prato do dia: Bacalhau à Brás',
    itemEn: 'Daily special: Codfish dish',
    itemNepali: 'आजको विशेष खाना (माछा)',
    icon: Fish,
    euros: 9,
    cents: 50,
    spokenPt: 'São nove euros e cinquenta.',
    writtenPt: 'Nove euros e cinquenta (9,50 €)',
    nepaliPhonetic: 'नोभ एउरुश इ सिङ्कुएन्ता (९.५० €)',
    customerName: 'Carlos'
  },
  {
    id: 'ord-6',
    itemPt: 'Um bilhete de metro Navegante',
    itemEn: 'One metro transit ticket',
    itemNepali: 'मेट्रो टिकट',
    icon: Ticket,
    euros: 1,
    cents: 80,
    spokenPt: 'Um euro e oitenta cêntimos.',
    writtenPt: 'Um euro e oitenta (1,80 €)',
    nepaliPhonetic: 'उँ एउरु इ ओइतेन्ता (१.८० €)',
    customerName: 'Inês'
  },
  {
    id: 'ord-7',
    itemPt: 'Caixa de seis pastéis de Belém',
    itemEn: 'Box of 6 Belém pastries',
    itemNepali: '६ वटा पेस्ट्रीको बक्स',
    icon: Cake,
    euros: 8,
    cents: 40,
    spokenPt: 'Oito euros e quarenta cêntimos.',
    writtenPt: 'Oito euros e quarenta (8,40 €)',
    nepaliPhonetic: 'ओइतु एउरुश इ क्वारेन्ता (८.४० €)',
    customerName: 'Amisha & Sujan'
  },
  {
    id: 'ord-8',
    itemPt: 'Sumo de laranja natural',
    itemEn: 'Fresh orange juice',
    itemNepali: 'ताजा सुन्तलाको जुस',
    icon: Citrus,
    euros: 2,
    cents: 75,
    spokenPt: 'Dois euros e setenta e cinco.',
    writtenPt: 'Dois euros e setenta e cinco (2,75 €)',
    nepaliPhonetic: 'दोइश एउरुश इ सेतेन्ता इ सिङ्कु (२.७५ €)',
    customerName: 'Tiago'
  },
  {
    id: 'ord-9',
    itemPt: 'Duas francesinhas especiais',
    itemEn: 'Two Porto Francesinha specials',
    itemNepali: '२ वटा फ्रान्सेजिन्हा विशेष',
    icon: UtensilsCrossed,
    euros: 24,
    cents: 0,
    spokenPt: 'São vinte e quatro euros certos.',
    writtenPt: 'Vinte e quatro euros (24,00 €)',
    nepaliPhonetic: 'भिन्ते इ क्वात्रु एउरुश (२४.०० €)',
    customerName: 'Rodrigo'
  },
  {
    id: 'ord-10',
    itemPt: 'Conta de compras no Pingo Doce',
    itemEn: 'Supermarket grocery bill',
    itemNepali: 'सुपरमार्केट सामानको बिल',
    icon: ShoppingCart,
    euros: 15,
    cents: 65,
    spokenPt: 'Quinze euros e sessenta e cinco cêntimos.',
    writtenPt: 'Quinze euros e sessenta e cinco (15,65 €)',
    nepaliPhonetic: 'किन्ज एउरुश इ सेसेन्ता इ सिङ्कु (१५.६५ €)',
    customerName: 'Margarida'
  }
];

const EURO_DENOMINATIONS = [
  { label: '50 €', value: 50.00, type: 'note', color: 'from-amber-600 to-orange-600' },
  { label: '20 €', value: 20.00, type: 'note', color: 'from-blue-600 to-indigo-600' },
  { label: '10 €', value: 10.00, type: 'note', color: 'from-rose-600 to-red-600' },
  { label: '5 €', value: 5.00, type: 'note', color: 'from-emerald-600 to-teal-600' },
  { label: '2 €', value: 2.00, type: 'coin', color: 'from-amber-200 via-slate-300 to-amber-300 text-slate-900' },
  { label: '1 €', value: 1.00, type: 'coin', color: 'from-amber-300 via-amber-400 to-amber-500 text-slate-900' },
  { label: '50 c', value: 0.50, type: 'coin', color: 'from-amber-400 to-yellow-500 text-slate-900' },
  { label: '20 c', value: 0.20, type: 'coin', color: 'from-amber-400 to-yellow-500 text-slate-900' },
  { label: '10 c', value: 0.10, type: 'coin', color: 'from-amber-400 to-yellow-500 text-slate-900' },
  { label: '5 c', value: 0.05, type: 'coin', color: 'from-amber-700 to-amber-800 text-white' },
];

interface EuroCashierModalProps {
  onClose: () => void;
  onReward?: (xp: number, coins: number) => void;
}

export const EuroCashierModal: React.FC<EuroCashierModalProps> = ({
  onClose,
  onReward
}) => {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [inputMode, setInputMode] = useState<'till' | 'numpad'>('till');
  const [numpadValue, setNumpadValue] = useState<string>('');
  const [tillTotal, setTillTotal] = useState<number>(0);
  const [tillItems, setTillItems] = useState<{ label: string; value: number }[]>([]);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [slowAudio, setSlowAudio] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const order = CASHIER_ORDERS[currentOrderIndex] || CASHIER_ORDERS[0];
  const targetTotal = useMemo(() => {
    return +(order.euros + order.cents / 100).toFixed(2);
  }, [order]);

  // Play audio when new order arrives
  useEffect(() => {
    if (!isGameOver) {
      const timer = setTimeout(() => {
        speakPt(order.spokenPt, slowAudio);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentOrderIndex, isGameOver, slowAudio]);

  const handleSpeakPrice = () => {
    playTone(550, 'sine', 0.04);
    triggerHaptic('light');
    speakPt(order.spokenPt, slowAudio);
  };

  const handleAddDenomination = (denom: { label: string; value: number }) => {
    playTone(680, 'sine', 0.03);
    triggerHaptic('light');
    setTillItems(prev => [...prev, denom]);
    setTillTotal(prev => +(prev + denom.value).toFixed(2));
  };

  const handleRemoveLastTillItem = () => {
    if (tillItems.length === 0) return;
    playTone(400, 'sine', 0.04);
    triggerHaptic('light');
    const lastItem = tillItems[tillItems.length - 1];
    setTillItems(prev => prev.slice(0, -1));
    setTillTotal(prev => Math.max(0, +(prev - lastItem.value).toFixed(2)));
  };

  const handleClearTill = () => {
    playTone(350, 'sine', 0.05);
    triggerHaptic('light');
    setTillItems([]);
    setTillTotal(0);
  };

  const handleNumpadPress = (digit: string) => {
    playTone(550, 'sine', 0.02);
    triggerHaptic('light');
    if (digit === 'C') {
      setNumpadValue('');
      return;
    }
    if (digit === '.') {
      if (!numpadValue.includes('.')) {
        setNumpadValue(prev => (prev === '' ? '0.' : prev + '.'));
      }
      return;
    }
    if (numpadValue.length < 6) {
      setNumpadValue(prev => prev + digit);
    }
  };

  const currentEnteredValue = inputMode === 'till' ? tillTotal : +(parseFloat(numpadValue) || 0).toFixed(2);

  const handleSubmitPayment = () => {
    const isCorrect = Math.abs(currentEnteredValue - targetTotal) < 0.009;

    if (isCorrect) {
      playTone(880, 'sine', 0.15);
      triggerHaptic('success');
      setFeedback('correct');
      const bonusXP = 15 + streak * 5;
      const bonusCoins = 3;
      setScore(prev => prev + bonusXP);
      setCoinsEarned(prev => prev + bonusCoins);
      setStreak(prev => prev + 1);

      setTimeout(() => {
        setFeedback(null);
        handleClearTill();
        setNumpadValue('');
        setShowHint(false);

        if (currentOrderIndex + 1 < CASHIER_ORDERS.length) {
          setCurrentOrderIndex(prev => prev + 1);
        } else {
          setIsGameOver(true);
          if (onReward) {
            onReward(score + bonusXP, coinsEarned + bonusCoins);
          }
        }
      }, 1200);

    } else {
      playTone(260, 'sawtooth', 0.25);
      triggerHaptic('error');
      setFeedback('wrong');
      setStreak(0);
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  const handleRestart = () => {
    setCurrentOrderIndex(0);
    setScore(0);
    setCoinsEarned(0);
    setStreak(0);
    setTillItems([]);
    setTillTotal(0);
    setNumpadValue('');
    setShowHint(false);
    setIsGameOver(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xl p-3 sm:p-5 overflow-y-auto ios-fade-in">
      
      {/* CARD CONTAINER */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-[36px] bg-slate-900 border border-white/15 text-white shadow-2xl overflow-hidden my-auto">
        
        {/* ================= TOP HEADER BANNER (Euro Cashier) ================= */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-600 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 shadow-md">
                <Coins className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-200 bg-black/25 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-white/15 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-300" /> Speed Drill
                  </span>
                  {streak > 1 && (
                    <span className="text-[11px] font-extrabold text-amber-300 bg-amber-500/25 px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce">
                      <Flame className="w-3 h-3 fill-amber-300 text-amber-300" /> {streak}x Streak!
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  Lisbon Euro Cashier
                </h2>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                playTone(400, 'sine', 0.04);
                onClose();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 active:scale-90 transition-all border border-white/20 cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress & Shift Status */}
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/15 text-xs font-bold text-emerald-100">
            <span>Customer {currentOrderIndex + 1} of {CASHIER_ORDERS.length}</span>
            <div className="flex items-center gap-3">
              <span className="text-amber-300 flex items-center gap-1">
                <XpBadgeIcon size={14} /> {score} XP
              </span>
              <span className="text-amber-300 flex items-center gap-1">
                <GoldCoin size={14} /> {coinsEarned} Coins
              </span>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        {!isGameOver ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            
            {/* Customer & Order Speech Bubble Card */}
            <div className="p-5 rounded-3xl bg-slate-800/90 border border-white/10 shadow-lg space-y-4">
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs shrink-0">
                    <order.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {order.customerName} ordered:
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {order.itemPt}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>{order.itemEn}</span>
                      <span className="inline-flex items-center gap-1 bg-slate-700/60 px-1.5 py-0.5 rounded text-[11px]">
                        <FlagNepal size={10} /> {order.itemNepali}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setSlowAudio(prev => !prev)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      slowAudio ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {slowAudio ? '0.7x Slow' : '1.0x Normal'}
                  </button>

                  <button
                    onClick={handleSpeakPrice}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
                    title="Replay Audio"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Natural Lisbon Audio Callout Banner */}
              <div 
                onClick={handleSpeakPrice}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-400/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-sm sm:text-base font-black text-emerald-300 group-hover:text-emerald-200 transition-colors">
                      "{order.spokenPt}"
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Tap to listen again to European Portuguese price
                    </p>
                  </div>
                </div>

                <Volume2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              </div>

              {/* Hint Accordion */}
              {showHint ? (
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-1 fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      Portuguese Breakdown:
                    </span>
                    <span>{order.writtenPt}</span>
                  </div>
                  <p className="text-xs text-amber-200 font-mono flex items-center gap-1">
                    <FlagNepal size={12} /> {order.nepaliPhonetic}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    playTone(450, 'sine', 0.03);
                    setShowHint(true);
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Need a written hint / phonetic breakdown?
                </button>
              )}

            </div>

            {/* ================= REGISTER POS SCREEN (Amount Tendered Display) ================= */}
            <div className={`p-4 rounded-3xl border transition-all ${
              feedback === 'correct'
                ? 'bg-emerald-900/60 border-emerald-400 ring-4 ring-emerald-400/30'
                : feedback === 'wrong'
                ? 'bg-rose-900/60 border-rose-400 ring-4 ring-rose-400/30'
                : 'bg-black/50 border-white/10 shadow-inner'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    Tendered Amount:
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
                    <span>{currentEnteredValue.toFixed(2)}</span>
                    <span className="text-xl text-emerald-400">€</span>
                  </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-2xl border border-white/10">
                  <button
                    onClick={() => {
                      playTone(500, 'sine', 0.03);
                      setInputMode('till');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      inputMode === 'till' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Coins & Notes</span>
                  </button>
                  <button
                    onClick={() => {
                      playTone(500, 'sine', 0.03);
                      setInputMode('numpad');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      inputMode === 'numpad' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Keypad</span>
                  </button>
                </div>
              </div>

              {/* Feedback toast overlay */}
              {feedback === 'correct' && (
                <div className="mt-2 text-xs font-black text-emerald-300 flex items-center gap-1.5 fade-in">
                  <Check className="w-4 h-4 text-emerald-400" /> Exact payment received! Muito bem! (+{15 + streak * 5} XP)
                </div>
              )}
              {feedback === 'wrong' && (
                <div className="mt-2 text-xs font-black text-rose-300 flex items-center gap-1.5 fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400" /> Expected {targetTotal.toFixed(2)} €. Replay audio and try again!
                </div>
              )}
            </div>

            {/* ================= INPUT MODE: TILL OR NUMPAD ================= */}
            {inputMode === 'till' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Tap Euro Currency to Count Tender:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRemoveLastTillItem}
                      disabled={tillItems.length === 0}
                      className="text-[11px] text-slate-400 hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                    >
                      Undo Last
                    </button>
                    <button
                      onClick={handleClearTill}
                      disabled={tillItems.length === 0}
                      className="text-[11px] text-slate-400 hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Coins and Notes Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {EURO_DENOMINATIONS.map((denom, dIdx) => (
                    <button
                      key={dIdx}
                      onClick={() => handleAddDenomination(denom)}
                      className={`p-3 rounded-2xl font-black text-xs sm:text-sm border border-white/15 bg-gradient-to-b ${denom.color} shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[58px]`}
                    >
                      <span>{denom.label}</span>
                      <span className="text-[9px] opacity-75 uppercase font-medium">{denom.type}</span>
                    </button>
                  ))}
                </div>

                {/* Visual Till Stack Tray */}
                {tillItems.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {tillItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="shrink-0 px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-300"
                      >
                        +{item.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C'].map((btn) => (
                    <button
                      key={btn}
                      onClick={() => handleNumpadPress(btn)}
                      className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-lg border border-white/10 transition-all cursor-pointer text-center"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SUBMIT ACTION BUTTON ================= */}
            <button
              onClick={handleSubmitPayment}
              disabled={currentEnteredValue <= 0}
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                currentEnteredValue > 0
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl hover:scale-[1.01] active:scale-98'
                  : 'bg-slate-800 text-slate-500 opacity-60 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>Confirm & Charge {currentEnteredValue.toFixed(2)} €</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        ) : (
          /* ================= SHIFT SUMMARY & REWARD SCREEN ================= */
          <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5 zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/20 animate-bounce">
              <PremiumTrophy size={40} />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Shift Complete!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Lisbon Cashier Master
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-sm">
                You served all 10 customers and mastered fast European Portuguese numbers and Euro change!
              </p>
            </div>

            {/* Rewards Summary Box */}
            <div className="w-full max-w-sm p-5 rounded-3xl bg-slate-800/90 border border-white/10 shadow-lg grid grid-cols-2 gap-4 text-center">
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-amber-300 flex items-center gap-1.5">
                  <XpBadgeIcon size={22} /> +{score}
                </span>
                <span className="text-xs font-bold text-amber-200 mt-0.5">Experience Points</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-amber-300 flex items-center gap-1.5">
                  <GoldCoin size={22} /> +{coinsEarned}
                </span>
                <span className="text-xs font-bold text-amber-200 mt-0.5">Lisbon Shop Tips</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full max-w-sm">
              <button
                onClick={handleRestart}
                className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Play Another Shift
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Claim Rewards & Finish
              </button>
            </div>

          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            European Portuguese Numbers & Cents (cêntimos)
          </span>

          <span className="text-[11px] font-mono text-emerald-300">
            €1 = 100 cêntimos
          </span>
        </div>

      </div>

    </div>
  );
};
