import { VocabWord } from '../types';

export interface WordExample {
  type: 'love' | 'lisbon' | 'grammar';
  title: string;
  pt: string;
  en: string;
  nepali?: string;
  note?: string;
}

export interface WordDetailedInfo {
  word: VocabWord;
  examples: WordExample[];
  lisbonTip: string;
  partOfSpeech?: string;
}

// Curated database of rich Sujan & Amisha love examples and Lisbon daily life usage
const SPECIFIC_EXAMPLES: Record<string, { examples: WordExample[]; lisbonTip: string; partOfSpeech?: string }> = {
  // Unit 1 - Greetings & Politeness
  "Olá": {
    partOfSpeech: "Interjection / Greeting",
    lisbonTip: "In Lisbon, 'Olá' is warmly used everywhere from cozy Alfama cafes to meeting friends at Praça do Comércio.",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Olá meu amor! O Sujan preparou o pequeno-almoço para a Amisha com todo o carinho.",
        en: "Hello my love! Sujan prepared breakfast for Amisha with all his affection.",
        nepali: "नमस्ते मेरो माया! सुजनले अमिशाको लागि मायाले बिहानीको खाजा बनाएका छन्।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Olá, bom dia! Queria duas bicas e dois pastéis de nata, por favor.",
        en: "Hello, good morning! I would like two espressos and two custard tarts, please.",
        nepali: "नमस्ते, शुभ प्रभात! मलाई कृपया दुई कप कफी र दुईवटा पास्तेल द नाता दिनुहोस्।"
      }
    ]
  },
  "Bom dia": {
    partOfSpeech: "Greeting",
    lisbonTip: "Said until lunchtime (around 12:00-13:00). In Portugal, people always greet when entering an elevator, cafe, or shop.",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Bom dia, minha linda Amisha! O Sujan acordou a sorrir a pensar em ti.",
        en: "Good morning, my beautiful Amisha! Sujan woke up smiling thinking of you.",
        nepali: "शुभ प्रभात मेरी सुन्दर अमिशा! सुजन तिम्रो सम्झनामा मुस्कुराउँदै उठेका छन्।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Bom dia! Como correu a viagem de elétrico hoje?",
        en: "Good morning! How was the tram ride today?",
        nepali: "शुभ प्रभात! आज ट्रामको यात्रा कस्तो रह्यो?"
      }
    ]
  },
  "Boa tarde": {
    partOfSpeech: "Greeting",
    lisbonTip: "Used from after lunch (approx 13:00) until the sun sets (around 19:30-20:00).",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Boa tarde, amor da minha vida! O Sujan quer levar-te a passear por Belém.",
        en: "Good afternoon, love of my life! Sujan wants to take you for a walk through Belém.",
        nepali: "शुभ दिउँसो मेरो जिन्दगीको माया! सुजन तिमीलाई बेलेम घुमाउन लैजान चाहन्छन्।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Boa tarde, uma mesa para duas pessoas junto à janela, se faz favor.",
        en: "Good afternoon, a table for two near the window, please.",
        nepali: "शुभ दिउँसो, झ्याल नजिक दुई जनाको लागि एउटा टेबल दिनुहोस्, कृपया।"
      }
    ]
  },
  "Boa noite": {
    partOfSpeech: "Greeting & Farewell",
    lisbonTip: "Used both as a greeting in the evening and when saying good night before going to bed.",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Boa noite, minha querida Amisha. Sonha com o Sujan e com a nossa vida em Lisboa.",
        en: "Good night, my dearest Amisha. Dream of Sujan and our life in Lisbon.",
        nepali: "शुभ रात्री मेरी प्यारी अमिशा। सुजन र लिस्बनको हाम्रो सुन्दर जीवनको सपना देख्नू।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Boa noite a todos! O concerto de Fado no Bairro Alto foi inesquecível.",
        en: "Good night everyone! The Fado concert in Bairro Alto was unforgettable.",
        nepali: "सबैलाई शुभ रात्री! बाइरो आल्तोको फादो कन्सर्ट अविस्मरणीय थियो।"
      }
    ]
  },
  "Obrigado": {
    partOfSpeech: "Interjection (Politeness)",
    lisbonTip: "Used by men (Sujan says Obrigado). Women say Obrigada (Amisha says Obrigada).",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Obrigado por fazeres os meus dias tão felizes, Amisha!",
        en: "Thank you for making my days so happy, Amisha! (Said by Sujan)",
        nepali: "मेरो हरेक दिनलाई यति खुसी बनाइदिएकोमा धन्यवाद, अमिशा! (सुजनले भनेको)"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Muito obrigado pelo excelente serviço e pela simpatia!",
        en: "Thank you very much for the excellent service and friendliness!",
        nepali: "उत्कृष्ट सेवा र आत्मीयताको लागि धेरै धेरै धन्यवाद!"
      }
    ]
  },
  "Obrigada": {
    partOfSpeech: "Interjection (Politeness)",
    lisbonTip: "Used by women. Amisha always says 'Obrigada' when expressing gratitude!",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Obrigada, meu amor Sujan, pelas flores e pelo carinho!",
        en: "Thank you, my love Sujan, for the flowers and affection! (Said by Amisha)",
        nepali: "धन्यवाद मेरो माया सुजन, यी फूलहरू र मायाको लागि! (अमिशाले भनेको)"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Obrigada! O pastel de nata estava quente e crocante.",
        en: "Thank you! The custard tart was warm and crispy.",
        nepali: "धन्यवाद! पास्तेल द नाता तातो र क्रिस्पी थियो।"
      }
    ]
  },
  "Por favor": {
    partOfSpeech: "Adverbial Phrase",
    lisbonTip: "Can be placed at the beginning or end of any request to make it polite.",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Dá-me um abraço bem apertado, por favor, meu Sujan.",
        en: "Give me a tight hug, please, my Sujan.",
        nepali: "मलाई मायाले अङ्गालो हाल्नुहोस् न, कृपया, मेरो सुजन।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Um bilhete de metro para a estação do Oriente, por favor.",
        en: "A metro ticket to Oriente station, please.",
        nepali: "ओरियन्ते स्टेशनको लागि एउटा मेट्रो टिकट दिनुहोस्, कृपया।"
      }
    ]
  },
  "Amo-te": {
    partOfSpeech: "Verb Phrase (Amor)",
    lisbonTip: "In European Portuguese, pronoun comes after the verb with a hyphen: 'Amo-te' (I love you).",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Amo-te mais do que todas as estrelas do céu de Lisboa, Amisha!",
        en: "I love you more than all the stars in the Lisbon sky, Amisha!",
        nepali: "लिस्बनको आकाशका सबै ताराहरूभन्दा पनि धेरै म तिमीलाई माया गर्छु, अमिशा!"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Romantic Portugal Expression",
        pt: "Amo-te com todo o meu coração e com toda a minha alma.",
        en: "I love you with all my heart and with all my soul.",
        nepali: "म तिमीलाई मेरो पूरा मन र आत्माले माया गर्छु।"
      }
    ]
  },
  "Chamo-me Amisha": {
    partOfSpeech: "Expression / Introduction",
    lisbonTip: "'Chamar-se' is reflexive. 'Chamo-me...' literally means 'I call myself...'.",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Chamo-me Amisha e o meu coração pertence ao Sujan para sempre.",
        en: "My name is Amisha and my heart belongs to Sujan forever.",
        nepali: "मेरो नाम अमिशा हो र मेरो मुटु सधैंको लागि सुजनको हो।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Olá a todos! Chamo-me Amisha e estou a adorar viver em Portugal.",
        en: "Hello everyone! My name is Amisha and I am loving living in Portugal.",
        nepali: "सबैलाई नमस्ते! मेरो नाम अमिशा हो र मलाई पोर्चुगलमा बस्न असाध्यै मन परिरहेको छ।"
      }
    ]
  },
  "Uma bica": {
    partOfSpeech: "Noun Phrase (Culinary)",
    lisbonTip: "Only in Lisbon! 'Bica' is Lisbon slang for a strong espresso. (Acronym for: 'Beba Isto Com Açúcar' - Drink this with sugar!).",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "O Sujan e a Amisha foram ao miradouro beber uma bica ao pôr do sol.",
        en: "Sujan and Amisha went to the viewpoint to drink an espresso at sunset.",
        nepali: "सुजन र अमिशा सूर्यास्तको समयमा भ्युपोइन्टमा कफी पिउन गए।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Queria uma bica bem tirada e um copo de água fresca, por favor.",
        en: "I would like a well-pulled espresso and a glass of fresh water, please.",
        nepali: "मलाई राम्रोसँग बनाएको एक कप कफी र एक गिलास चिसो पानी दिनुहोस्, कृपया।"
      }
    ]
  },
  "Um pastel de nata": {
    partOfSpeech: "Noun Phrase (Pastry)",
    lisbonTip: "Portugal's most famous egg tart pastry, best served warm with cinnamon (canela) and powdered sugar (açúcar em pó).",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "O Sujan comprou um pastel de nata quentinho em Belém para adoçar o dia da Amisha.",
        en: "Sujan bought a warm custard tart in Belém to sweeten Amisha's day.",
        nepali: "सुजनले अमिशाको दिन गुलियो बनाउन बेलेमबाट तातो पास्तेल द नाता किने।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Pode pôr canela por cima do pastel de nata, se faz favor?",
        en: "Can you put cinnamon on top of the custard tart, please?",
        nepali: "पास्तेल द नाता माथि अलिकति दालचिनी धुलो राखिदिन सक्नुहुन्छ?"
      }
    ]
  },
  "A conta, por favor": {
    partOfSpeech: "Dining Phrase",
    lisbonTip: "Use this to ask for the bill at any restaurant, tasca, or pastelaria in Lisbon.",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Depois de um jantar romântico à luz das velas, o Sujan pediu a conta com um sorriso.",
        en: "After a romantic candlelit dinner, Sujan asked for the bill with a smile.",
        nepali: "रोमान्टिक डिनर पछि, सुजनले मुस्कुराउँदै बिल मागे।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "A conta, por favor. Aceitam cartão multibanco?",
        en: "The bill, please. Do you accept debit card?",
        nepali: "बिल दिनुहोस्, कृपया। के यहाँ कार्ड चल्छ?"
      }
    ]
  },
  "Onde fica...?": {
    partOfSpeech: "Question Phrase (Directions)",
    lisbonTip: "In European Portuguese, 'fica' (from verb ficar) is preferred over 'é' when asking for physical locations.",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "Onde fica o lugar mais bonito de Lisboa? Onde o Sujan e a Amisha estiverem juntos!",
        en: "Where is the most beautiful place in Lisbon? Wherever Sujan and Amisha are together!",
        nepali: "लिस्बनको सबैभन्दा सुन्दर ठाउँ कहाँ छ? जहाँ सुजन र अमिशा सँगै हुन्छन्!"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Com licença, onde fica a paragem do elétrico 28?",
        en: "Excuse me, where is the stop for tram 28?",
        nepali: "माफ गर्नुहोस्, ट्राम २८ को बस बिसौनी कहाँ छ?"
      }
    ]
  },
  "Casa": {
    partOfSpeech: "Noun (Feminine)",
    lisbonTip: "'Em casa' means 'at home'. 'Vou para casa' means 'I am going home'.",
    examples: [
      {
        type: 'love',
        title: "❤️ Sujan & Amisha Love Moment",
        pt: "A nossa casa em Lisboa está cheia de amor, carinho e paz para o Sujan e a Amisha.",
        en: "Our home in Lisbon is filled with love, affection, and peace for Sujan and Amisha.",
        nepali: "लिस्बनको हाम्रो घर सुजन र अमिशाको लागि माया, आत्मीयता र शान्तिले भरिएको छ।"
      },
      {
        type: 'lisbon',
        title: "🇵🇹 Lisbon Daily Usage",
        pt: "Alugámos uma casa com varanda e vista sobre o rio Tejo.",
        en: "We rented a house with a balcony and a view over the Tagus river.",
        nepali: "हामीले तेझो नदी देखिने बार्दलीसहितको एउटा घर भाडामा लियौँ।"
      }
    ]
  }
};

/**
 * Returns rich examples and details for any vocabulary word
 */
export const getWordDetailedInfo = (word: VocabWord): WordDetailedInfo => {
  const match = SPECIFIC_EXAMPLES[word.pt.trim()];
  if (match) {
    return {
      word,
      examples: match.examples,
      lisbonTip: match.lisbonTip,
      partOfSpeech: match.partOfSpeech || word.category || "Vocabulary Word"
    };
  }

  // Dynamic contextual generator for all other words
  const isLoveContext = word.category === 'love' || word.pt.toLowerCase().includes('amor') || word.pt.toLowerCase().includes('amo');
  const isFoodContext = word.category === 'food' || word.category === 'dining' || word.pt.toLowerCase().includes('café') || word.pt.toLowerCase().includes('pão');
  const isTravelContext = word.category === 'travel' || word.category === 'city' || word.pt.toLowerCase().includes('rua') || word.pt.toLowerCase().includes('metro');

  let loveSentencePt = `O Sujan e a Amisha adoram usar a palavra "${word.pt}" no seu dia a dia em Lisboa.`;
  let loveSentenceEn = `Sujan and Amisha love using the phrase "${word.pt}" in their daily life in Lisbon.`;
  let loveSentenceNepali = `सुजन र अमिशा लिस्बनको आफ्नो दैनिक जीवनमा "${word.pt}" प्रयोग गर्न धेरै रुचाउँछन्।`;

  if (isLoveContext) {
    loveSentencePt = `Com todo o amor no coração, o Sujan diz "${word.pt}" à sua querida Amisha.`;
    loveSentenceEn = `With all the love in his heart, Sujan says "${word.pt}" to his dearest Amisha.`;
    loveSentenceNepali = `मुटुभरीको मायाले, सुजनले आफ्नी प्यारी अमिशालाई "${word.pt}" भन्छन्।`;
  } else if (isFoodContext) {
    loveSentencePt = `O Sujan preparou "${word.pt}" especialmente para a Amisha saborear hoje.`;
    loveSentenceEn = `Sujan prepared "${word.pt}" especially for Amisha to enjoy today.`;
    loveSentenceNepali = `सुजनले आज अमिशाको लागि विशेष मायाले "${word.pt}" तयार गरेका छन्।`;
  } else if (isTravelContext) {
    loveSentencePt = `De mãos dadas por Lisboa, o Sujan e a Amisha procuram "${word.pt}".`;
    loveSentenceEn = `Holding hands through Lisbon, Sujan and Amisha look for "${word.pt}".`;
    loveSentenceNepali = `लिस्बनमा हात समातेर हिँड्दै, सुजन र अमिशा "${word.pt}" खोज्दैछन्।`;
  }

  const lisbonSentencePt = `Em Lisboa, ouve-se muito "${word.pt}" nas conversas locais e nas ruas históricas.`;
  const lisbonSentenceEn = `In Lisbon, "${word.pt}" is widely heard in local conversations and historic streets.`;
  const lisbonSentenceNepali = `लिस्बनका स्थानीय कुराकानी र ऐतिहासिक गल्लीहरूमा "${word.pt}" धेरै सुनिन्छ।`;

  const dynamicExamples: WordExample[] = [
    {
      type: 'love',
      title: "❤️ Sujan & Amisha Love Example",
      pt: loveSentencePt,
      en: loveSentenceEn,
      nepali: loveSentenceNepali
    },
    {
      type: 'lisbon',
      title: "🇵🇹 Lisbon Daily Usage Example",
      pt: lisbonSentencePt,
      en: lisbonSentenceEn,
      nepali: lisbonSentenceNepali
    }
  ];

  return {
    word,
    examples: dynamicExamples,
    lisbonTip: word.note || `Pronounce with European Portuguese closed vowels and gentle Lisbon cadence. Remember that final 's' sounds like 'sh' in Lisbon!`,
    partOfSpeech: word.category || "European Portuguese Expression"
  };
};
