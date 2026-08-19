import { DailyQuest, UserProgress } from '../types';

export const DAILY_QUEST_TEMPLATES: Omit<DailyQuest, 'current' | 'isClaimed'>[] = [
  {
    id: 'quest_xp',
    title: 'Daily Portuguese Focus',
    titlePt: 'Foco Diário de Português',
    description: 'Earn 60 XP across any lessons, quizzes, or games today.',
    nepaliHint: 'आज कुनै पनि पाठ वा खेलबाट ६० XP कमाउनुहोस्',
    icon: '⚡',
    target: 60,
    rewardXP: 25,
    rewardCoins: 40,
    rewardGems: 1,
    type: 'xp',
  },
  {
    id: 'quest_quiz',
    title: 'Quiz Master',
    titlePt: 'Mestre dos Quizzes',
    description: 'Complete 2 practice quizzes or lesson challenges.',
    nepaliHint: '२ वटा क्विज पूरा गर्नुहोस्',
    icon: '🎯',
    target: 2,
    rewardXP: 30,
    rewardCoins: 50,
    rewardGems: 1,
    type: 'quiz',
  },
  {
    id: 'quest_perfect',
    title: 'Flawless Accuracy',
    titlePt: 'Perfeição 100%',
    description: 'Score 100% on at least 1 quiz or mini-game.',
    nepaliHint: '१००% सही नतिजा ल्याएर रत्न कमाउनुहोस्',
    icon: 'trophy',
    target: 1,
    rewardXP: 35,
    rewardCoins: 60,
    rewardGems: 2,
    type: 'perfect',
  },
  {
    id: 'quest_survival',
    title: 'Lisbon Arrival Prep',
    titlePt: 'Missão de Sobrevivência',
    description: 'Complete 1 Portugal Survival scenario (Airport, Café, or Metro).',
    nepaliHint: 'पोर्चुगल बाँच्ने सिमुलेटरको १ मिसन सक्नुहोस्',
    icon: '🇵🇹',
    target: 1,
    rewardXP: 30,
    rewardCoins: 45,
    rewardGems: 1,
    type: 'survival',
  },
  {
    id: 'quest_cashier',
    title: 'Euro Currency Master',
    titlePt: 'Caixa de Euros em Lisboa',
    description: 'Play 1 Euro Cashier shift or calculate correct change.',
    nepaliHint: 'युरो क्यासियर खेलमा पोर्चुगिज सिक्का गन्नुहोस्',
    icon: '💶',
    target: 1,
    rewardXP: 25,
    rewardCoins: 50,
    rewardGems: 1,
    type: 'cashier',
  },
  {
    id: 'quest_map',
    title: 'Portuguese Sightseer',
    titlePt: 'Explorador de Portugal',
    description: 'Explore at least 1 Lisbon/Porto landmark or earn a passport stamp.',
    nepaliHint: 'लिस्बन/पोर्टो नक्सामा १ ठाउँको अध्ययन सक्नुहोस्',
    icon: '🗺️',
    target: 1,
    rewardXP: 25,
    rewardCoins: 40,
    rewardGems: 1,
    type: 'map',
  },
];

/**
 * Returns today's active 3 quests for the user, calculating real current progress.
 */
export function getDailyQuests(progress: UserProgress): DailyQuest[] {
  const today = new Date().toISOString().split('T')[0];
  const userQuests = progress.quests || {};

  // Pick 3 core templates
  // 1: XP / Focus
  // 2: Quiz / Perfect
  // 3: Practical (Survival / Cashier / Map)
  const selectedTemplates = [
    DAILY_QUEST_TEMPLATES[0], // XP Focus
    DAILY_QUEST_TEMPLATES[1], // Quiz Master
    DAILY_QUEST_TEMPLATES[3], // Survival / Real-world
    DAILY_QUEST_TEMPLATES[4], // Euro Cashier
  ];

  return selectedTemplates.map(template => {
    const saved = userQuests[template.id];
    let current = 0;
    let isClaimed = false;

    if (saved && saved.date === today) {
      current = saved.current;
      isClaimed = saved.isClaimed;
    }

    // Dynamic sync for XP quest with todayXP
    if (template.type === 'xp') {
      current = Math.max(current, progress.todayXP || 0);
    }

    return {
      ...template,
      current: Math.min(current, template.target),
      isClaimed,
    };
  });
}
