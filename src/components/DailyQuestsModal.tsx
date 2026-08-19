import React, { useState } from 'react';
import { DailyQuest, UserProgress } from '../types';
import { getDailyQuests } from '../utils/quests';
import { playTone, playSuccessSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  X, 
  Sparkles, 
  Coins, 
  Gem, 
  CheckCircle2, 
  Trophy, 
  Flame, 
  ArrowRight,
  Gift,
  Zap,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Snowflake,
  Shirt,
  ListChecks,
  Store,
  Check
} from 'lucide-react';
import { GoldCoin, FlagNepal, PremiumTrophy, FireStreakIcon, XpBadgeIcon } from './icons/PremiumIcons';

interface DailyQuestsModalProps {
  progress: UserProgress;
  onClose: () => void;
  onClaimQuest: (questId: string, xp: number, coins: number, gems: number) => void;
  onOpenSurvival: () => void;
  onOpenCashier: () => void;
  onOpenMap: () => void;
  onOpenWardrobe: () => void;
  onBuyHeartRefill: () => void;
  onBuyStreakFreeze: () => void;
  onConvertCoinsToGem: () => void;
  lang?: 'pt' | 'en';
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  progress,
  onClose,
  onClaimQuest,
  onOpenSurvival,
  onOpenCashier,
  onOpenMap,
  onOpenWardrobe,
  onBuyHeartRefill,
  onBuyStreakFreeze,
  onConvertCoinsToGem,
  lang = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'shop'>('quests');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const quests = getDailyQuests(progress);
  const completedCount = quests.filter(q => q.current >= q.target).length;
  const allCompleted = completedCount === quests.length;

  const showNotice = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleClaim = (quest: DailyQuest) => {
    if (quest.isClaimed) return;
    if (quest.current < quest.target) {
      triggerHaptic('error');
      showNotice(lang === 'pt' ? 'Complete a missão primeiro!' : 'Complete the quest criteria first!');
      return;
    }

    playSuccessSound();
    triggerHaptic('success');
    onClaimQuest(quest.id, quest.rewardXP, quest.rewardCoins, quest.rewardGems);
    showNotice(
      lang === 'pt' 
        ? `Recompensa resgatada! +${quest.rewardCoins} Moedas, +${quest.rewardGems} Gemas!` 
        : `Claimed! +${quest.rewardCoins} Coins, +${quest.rewardGems} Gems!`
    );
  };

  const handleActionClick = (type: DailyQuest['type']) => {
    onClose();
    if (type === 'survival') onOpenSurvival();
    else if (type === 'cashier') onOpenCashier();
    else if (type === 'map') onOpenMap();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#12141a] border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* Header with glowing backdrop */}
        <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white text-center overflow-hidden shrink-0">
          
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-200 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-rose-300 rounded-full blur-2xl"></div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Wallet summary in header */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-md border border-white/25 shadow-xs">
              <GoldCoin size={14} />
              <span>{progress.coins} Coins</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-md border border-white/25 shadow-xs">
              <Gem className="w-3.5 h-3.5 text-purple-200" />
              <span>{progress.gems} Gems</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-md border border-white/25 shadow-xs">
              <Heart className="w-3.5 h-3.5 text-rose-200 fill-current" />
              <span>{progress.hearts}/5 Hearts</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {lang === 'pt' ? 'Missões & Banco de Moedas' : 'Daily Quests & Gem Vault'}
          </h2>

          <p className="text-xs sm:text-sm text-orange-100 font-medium mt-1 max-w-md mx-auto">
            {lang === 'pt' 
              ? 'Complete as metas diárias para ganhar moedas e gemas para Amisha!' 
              : 'Complete daily Portuguese milestones to earn coins & rare gems!'}
          </p>

          {/* Tab Switcher: Quests vs Economy Store */}
          <div className="mt-4 flex max-w-xs mx-auto rounded-2xl bg-black/25 p-1 backdrop-blur-md border border-white/15">
            <button
              onClick={() => {
                playTone(550, 'sine', 0.03);
                setActiveTab('quests');
              }}
              className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quests'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>{lang === 'pt' ? 'Missões Diárias' : 'Daily Quests'} ({completedCount}/{quests.length})</span>
            </button>
            <button
              onClick={() => {
                playTone(550, 'sine', 0.03);
                setActiveTab('shop');
              }}
              className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{lang === 'pt' ? 'Loja de Moedas' : 'Coin & Gem Shop'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="bg-amber-500 text-white text-xs font-bold text-center py-2 px-4 fade-in">
            {feedbackMsg}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {activeTab === 'quests' ? (
            <>
              {/* Daily Progress summary card */}
              <div className="rounded-3xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#1c160c] dark:to-[#22170f] p-5 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <PremiumTrophy size={20} />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {lang === 'pt' ? 'Progresso Diário' : "Today's Quest Completion"}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {allCompleted 
                      ? (lang === 'pt' ? 'Todas as missões completas! Excelente trabalho!' : 'All daily quests completed! Sujan is proud of you!')
                      : (lang === 'pt' ? `Complete ${quests.length - completedCount} missões para bônus extra.` : `Finish ${quests.length - completedCount} more quests today.`)}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-black text-sm bg-white dark:bg-slate-900 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-amber-500">{completedCount}/{quests.length}</span>
                  {allCompleted ? <Sparkles className="w-4 h-4 text-amber-400" /> : <FireStreakIcon size={16} />}
                </div>
              </div>

              {/* Quests List */}
              <div className="space-y-3">
                {quests.map((quest) => {
                  const isFinished = quest.current >= quest.target;
                  const percent = Math.min(100, Math.floor((quest.current / quest.target) * 100));

                  return (
                    <div 
                      key={quest.id}
                      className={`rounded-3xl border p-4.5 sm:p-5 transition-all shadow-xs ${
                        quest.isClaimed
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-80'
                          : isFinished
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-white dark:bg-[#161822] border-slate-200/80 dark:border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/20">
                          {quest.type === 'xp' ? (
                            <Zap className="w-5 h-5 text-amber-500" />
                          ) : quest.type === 'quiz' ? (
                            <Flame className="w-5 h-5 text-orange-500" />
                          ) : quest.type === 'perfect' ? (
                            <PremiumTrophy size={20} />
                          ) : quest.type === 'survival' ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          ) : quest.type === 'cashier' ? (
                            <Coins className="w-5 h-5 text-amber-500" />
                          ) : (
                            <Sparkles className="w-5 h-5 text-purple-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                              {lang === 'pt' ? quest.titlePt : quest.title}
                            </h4>
                            
                            {/* Rewards preview pill */}
                            <div className="flex items-center gap-2 shrink-0 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                              <span className="text-amber-500 flex items-center gap-1">
                                <GoldCoin size={12} />
                                +{quest.rewardCoins}
                              </span>
                              {quest.rewardGems > 0 && (
                                <span className="text-purple-500 flex items-center gap-1">
                                  <Gem className="w-3 h-3 text-purple-400" />
                                  +{quest.rewardGems}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 leading-relaxed">
                            {quest.description}
                          </p>

                          <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1">
                            <FlagNepal size={12} />
                            <span>{quest.nepaliHint}</span>
                          </p>

                          {/* Progress bar and Claim / Go button */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                            <div className="flex-1 min-w-[140px]">
                              <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                                <span>Progress</span>
                                <span>{quest.current}/{quest.target}</span>
                              </div>
                              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isFinished ? 'bg-emerald-500' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {quest.isClaimed ? (
                                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>{lang === 'pt' ? 'Resgatado' : 'Claimed'}</span>
                                </div>
                              ) : isFinished ? (
                                <button
                                  onClick={() => handleClaim(quest)}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black shadow-md hover:from-emerald-600 hover:to-teal-600 active:scale-95 transition-all cursor-pointer animate-pulse"
                                >
                                  <Gift className="w-4 h-4" />
                                  <span>{lang === 'pt' ? 'Resgatar Recompensa' : 'Claim Rewards'}</span>
                                </button>
                              ) : (
                                (quest.type === 'survival' || quest.type === 'cashier' || quest.type === 'map') && (
                                  <button
                                    onClick={() => handleActionClick(quest.type)}
                                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                                  >
                                    <span>{lang === 'pt' ? 'Iniciar' : 'Start'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Coin & Gem Economy Shop */
            <div className="space-y-4">
              
              {/* Currency Balance Header */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-500/10 p-4 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">Available Coins</span>
                  <div className="text-xl font-black text-amber-500 flex items-center justify-center gap-1.5 mt-1">
                    <GoldCoin size={20} />
                    <span>{progress.coins}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-500/10 p-4 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400">Available Gems</span>
                  <div className="text-xl font-black text-purple-500 flex items-center justify-center gap-1.5 mt-1">
                    <Gem className="w-5 h-5 text-purple-400" />
                    <span>{progress.gems}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-500/10 p-4 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400">Heart Meter</span>
                  <div className="text-xl font-black text-rose-500 flex items-center justify-center gap-1.5 mt-1">
                    <Heart className="w-5 h-5 fill-current text-rose-500" />
                    <span>{progress.hearts} / 5</span>
                  </div>
                </div>
              </div>

              {/* Shop Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Item 1: Heart Refill */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161822] p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                      <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Full Hearts Refill</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Instantly restores all 5 hearts so you can practice mistakes without waiting.
                      </p>
                      <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                        <FlagNepal size={10} /> ५ वटा मुटु तुरुन्तै भर्नुहोस्
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <GoldCoin size={14} /> 100 Coins
                    </span>
                    <button
                      onClick={() => {
                        if (progress.hearts >= 5) {
                          showNotice(lang === 'pt' ? 'Seus corações já estão cheios!' : 'Your hearts are already full!');
                          return;
                        }
                        if (progress.coins < 100) {
                          showNotice(lang === 'pt' ? 'Moedas insuficientes!' : 'Not enough coins! Complete quests to earn more.');
                          return;
                        }
                        playSuccessSound();
                        triggerHaptic('success');
                        onBuyHeartRefill();
                        showNotice('Hearts refilled to 5/5!');
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      Buy Refill
                    </button>
                  </div>
                </div>

                {/* Item 2: Gem Exchange */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161822] p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0">
                      <Gem className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Convert Coins to Gem</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Exchange your hard-earned 150 coins for 1 rare Gem for custom 3D outfits.
                      </p>
                      <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                        <FlagNepal size={10} /> १५० सिक्का साटेर १ रत्न बनाउनुहोस्
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <GoldCoin size={14} /> 150 Coins ➔ 1 Gem
                    </span>
                    <button
                      onClick={() => {
                        if (progress.coins < 150) {
                          showNotice(lang === 'pt' ? 'Moedas insuficientes (precisa de 150)!' : 'Need 150 coins to forge a Gem!');
                          return;
                        }
                        playSuccessSound();
                        triggerHaptic('success');
                        onConvertCoinsToGem();
                        showNotice('Successfully forged 1 Gem!');
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      Forge Gem
                    </button>
                  </div>
                </div>

                {/* Item 3: Streak Freeze Shield */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161822] p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Streak Freeze Shield</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Protects your streak if you miss a day of practice while traveling in Lisbon.
                      </p>
                      <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 mt-1 flex items-center gap-1">
                        <FlagNepal size={10} /> स्ट्रिक सुरक्षित राख्ने बरफ ढाल
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Gem className="w-4 h-4" /> 2 Gems
                    </span>
                    <button
                      onClick={() => {
                        if (progress.gems < 2) {
                          showNotice(lang === 'pt' ? 'Precisa de 2 Gemas!' : 'Need 2 Gems to buy Streak Freeze!');
                          return;
                        }
                        playSuccessSound();
                        triggerHaptic('success');
                        onBuyStreakFreeze();
                        showNotice('Streak Freeze Shield active!');
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Snowflake className="w-3.5 h-3.5" />
                      <span>{progress.streakFrozen ? 'Active Freeze' : 'Equip Freeze'}</span>
                    </button>
                  </div>
                </div>

                {/* Item 4: 3D Outfits Studio */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161822] p-5 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">3D Style Wardrobe</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Spend coins and gems on traditional Portuguese outfits, capes, and glasses for Sujan!
                      </p>
                      <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <FlagNepal size={10} /> सुजनको लागि नयाँ पोसाकहरू अनलक गर्नुहोस्
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-400">
                      6 Styles Available
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenWardrobe();
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Shirt className="w-3.5 h-3.5" />
                      <span>Open Wardrobe</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'pt' ? 'Novas missões todos os dias à meia-noite' : 'Quests reset fresh daily at midnight!'}</span>
          </span>

          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {lang === 'pt' ? 'Fechar' : 'Close'}
          </button>
        </div>

      </div>

    </div>
  );
};
