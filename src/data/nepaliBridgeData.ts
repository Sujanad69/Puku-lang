export interface PhonationComparison {
  id: string;
  ptPattern: string;
  category: 'nasal' | 'swallowed_vowels' | 'sibilants' | 'r_sounds';
  title: string;
  titleNepali: string;
  nepaliBridgeRule: string;
  devanagariExample: string;
  explanation: string;
  examples: {
    pt: string;
    en: string;
    nepaliPhonetic: string;
    nepaliMeaning: string;
    audioTip: string;
  }[];
}

export interface LisbonSlangItem {
  pt: string;
  nepaliDevanagari: string;
  en: string;
  nepaliMeaning: string;
  usageContext: string;
  examplePt: string;
  exampleEn: string;
  exampleNepali: string;
}

export interface CulturalEtiquetteGuide {
  id: string;
  title: string;
  titleNepali: string;
  icon: string;
  summary: string;
  summaryNepali: string;
  dos: { text: string; nepali: string }[];
  donts: { text: string; nepali: string }[];
  loveNoteFromSujan: string;
}

export const PHONATION_COMPARISONS: PhonationComparison[] = [
  {
    id: 'nasal_ao',
    ptPattern: '-ÃO / -ÕES',
    category: 'nasal',
    title: 'The Great Nasal Sound (-ÃO / -ÕES)',
    titleNepali: 'नाके स्वर (नेपाली चन्द्रबिन्दु ँ जस्तै -ÃO)',
    nepaliBridgeRule: 'नेपालीमा "पाउँ", "गाउँ", वा "आँ" बोल्दा नाकबाट हावा निकाले जस्तै, पोर्चुगिजमा -ÃO को उच्चारण ठ्याक्कै त्यस्तै हुन्छ।',
    devanagariExample: 'Pão ➔ पाउँ (पाओँ) | Não ➔ नाउँ (नाओँ)',
    explanation: 'European Portuguese has strong nasal resonance. Do not pronounce it with a hard "N" or "M". Instead, let the vowel vibrate through your nasal cavity, exactly like the Nepali Chandrabindu (ँ).',
    examples: [
      {
        pt: 'Pão',
        en: 'Bread',
        nepaliPhonetic: 'पाउँ / पाउँऽ',
        nepaliMeaning: 'पाउरोटी',
        audioTip: 'Say "Pah" and glide through your nose into "un"'
      },
      {
        pt: 'Não',
        en: 'No',
        nepaliPhonetic: 'नाउँ / नाओँ',
        nepaliMeaning: 'नाइँ / होइन',
        audioTip: 'Crisp nasal denial'
      },
      {
        pt: 'Coração',
        en: 'Heart',
        nepaliPhonetic: 'कुरासाउँ',
        nepaliMeaning: 'मुटु / हृदय',
        audioTip: 'Sujan always says this to Amisha!'
      },
      {
        pt: 'Lições',
        en: 'Lessons',
        nepaliPhonetic: 'लिस्योइँश',
        nepaliMeaning: 'पाठहरू',
        audioTip: 'Plural of -ão often becomes -ões (oi-sh)'
      }
    ]
  },
  {
    id: 'swallowed_vowels',
    ptPattern: 'Unstressed Vowels (E & O)',
    category: 'swallowed_vowels',
    title: 'The "Swallowed" Vowels of Lisbon',
    titleNepali: 'भित्री स्वरहरू (Silent/Muffled Vowels)',
    nepaliBridgeRule: 'ब्राजिलमा सबै अक्षर स्पष्ट बोलिन्छ तर पोर्चुगलमा जोड नपरेका "E" र "O" अक्षरहरू लगभग हराउँछन् वा छोटो हुन्छन्।',
    devanagariExample: 'De ➔ द (दी होइन) | Como está? ➔ कम् श्ता?',
    explanation: 'In European Portuguese, unstressed "e" turns into a muted schwa (like an ultra-short Nepali "अ"), and unstressed "o" becomes a soft "u" (उ).',
    examples: [
      {
        pt: 'Excelente',
        en: 'Excellent',
        nepaliPhonetic: 'इश्सेलेंत (sh-s-lent)',
        nepaliMeaning: 'उत्कृष्ट',
        audioTip: 'Final -e is barely whispered, not "eh-seh-len-chee"'
      },
      {
        pt: 'Obrigada',
        en: 'Thank you (said by women)',
        nepaliPhonetic: 'उब्रिगादा',
        nepaliMeaning: 'धन्यवाद',
        audioTip: 'The starting "O" is pronounced like soft "U"'
      },
      {
        pt: 'Como estás?',
        en: 'How are you? (informal)',
        nepaliPhonetic: 'कोमु श्ताश? / कम् श्ताश?',
        nepaliMeaning: 'तिमीलाई कस्तो छ?',
        audioTip: 'Notice the vowel in "estás" merges into "shtash"'
      },
      {
        pt: 'Por favor',
        en: 'Please',
        nepaliPhonetic: 'पुर फावोर',
        nepaliMeaning: 'कृपया / प्लिज',
        audioTip: 'Short "pur", not drawn out'
      }
    ]
  },
  {
    id: 's_sounds',
    ptPattern: 'The "SH" Sibilant (S at syllable ends)',
    category: 'sibilants',
    title: 'The Lisbon "SH" Sound (तालव्य श)',
    titleNepali: 'लिस्बनको ट्रेडमार्क "श" (SH) आवाज',
    nepaliBridgeRule: 'शब्दको अन्त्यमा वा कडा व्यञ्जन अघि आउने "S" अक्षर नेपाली "श" (SH) जस्तै उच्चारण हुन्छ।',
    devanagariExample: 'Lisboa ➔ लिश्बोवा (लिस्बोआ होइन) | Três ➔ त्रेश',
    explanation: 'This gives European Portuguese its unmistakable, soothing Slavic/Celtic cadence that makes it sound so unique compared to Spanish or Brazilian Portuguese!',
    examples: [
      {
        pt: 'Lisboa',
        en: 'Lisbon',
        nepaliPhonetic: 'लिश्बोवा',
        nepaliMeaning: 'लिस्बन सहर',
        audioTip: 'Notice the soft "sh" inside Lisbon'
      },
      {
        pt: 'Gostas de mim?',
        en: 'Do you like me?',
        nepaliPhonetic: 'गोश्ताश द मीम?',
        nepaliMeaning: 'के तिमी मलाई मन पराउँछौ?',
        audioTip: 'Both "S" turn into sweet "sh" sounds'
      },
      {
        pt: 'Dois pastéis',
        en: 'Two custard tarts',
        nepaliPhonetic: 'दोइश पास्तेइश',
        nepaliMeaning: 'दुईवटा पेस्टल दे नाता',
        audioTip: 'Double "sh" at the end of both words'
      }
    ]
  },
  {
    id: 'r_sounds',
    ptPattern: 'Rolling R vs Guttural RR',
    category: 'r_sounds',
    title: 'The French/German Style "RR" Sound',
    titleNepali: 'कण्ठ्य "RR" र जिब्रो बटार्ने "R"',
    nepaliBridgeRule: 'शब्दको सुरुमा वा दोहोरो "RR" आउँदा घाँटीको भित्री भागबाट (गलाबाट) गर्जिने आवाज निस्कन्छ।',
    devanagariExample: 'Rua ➔ रुवा (घाँटीबाट) | Carro ➔ कार्रु',
    explanation: 'Single "R" between vowels is a gentle tap (like in Nepali "तर"), but "RR" or starting "R" vibrates gently in the throat.',
    examples: [
      {
        pt: 'Rua Augusta',
        en: 'Augusta Street (Famous downtown Lisbon)',
        nepaliPhonetic: 'रुवा आउगुश्ता',
        nepaliMeaning: 'लिस्बनको प्रसिद्ध सडक',
        audioTip: 'Throaty soft R'
      },
      {
        pt: 'Carro',
        en: 'Car',
        nepaliPhonetic: 'कार्रु',
        nepaliMeaning: 'कार / गाडी',
        audioTip: 'Deep throaty sound unlike "Caro" (expensive)'
      }
    ]
  }
];

export const LISBON_SLANG_EXPRESSIONS: LisbonSlangItem[] = [
  {
    pt: 'Fixe!',
    nepaliDevanagari: 'फिसे!',
    en: 'Cool! / Awesome! / Great!',
    nepaliMeaning: 'कस्तो बबाल! / एकदम राम्रो!',
    usageContext: 'The #1 most common positive reaction in Portugal.',
    examplePt: 'Este restaurante é bué de fixe!',
    exampleEn: 'This restaurant is super cool!',
    exampleNepali: 'यो रेस्टुरेन्ट साह्रै बबाल छ!'
  },
  {
    pt: 'Giro / Gira',
    nepaliDevanagari: 'जिरु / जिरा',
    en: 'Cute / Pretty / Nice',
    nepaliMeaning: 'सुन्दर / कस्तो राम्री',
    usageContext: 'Used for attractive people, outfits, places, and ideas.',
    examplePt: 'A Amisha é muito gira!',
    exampleEn: 'Amisha is very pretty/cute!',
    exampleNepali: 'अमिशा साह्रै राम्री छिन्!'
  },
  {
    pt: 'Pois é!',
    nepaliDevanagari: 'पोइश् ए!',
    en: 'Exactly! / That is so true!',
    nepaliMeaning: 'हो नि! / ठ्याक्कै त्यही त!',
    usageContext: 'Used constantly in conversation to show agreement and keep dialogue flowing.',
    examplePt: '— Lisboa é linda! — Pois é!',
    exampleEn: '— Lisbon is gorgeous! — Exactly!',
    exampleNepali: '— लिस्बन सुन्दर छ! — हो नि, ठ्याक्कै!'
  },
  {
    pt: 'Bué de...',
    nepaliDevanagari: 'बुए द...',
    en: 'A lot of... / Super...',
    nepaliMeaning: 'धेरै नै / एकदमै धेरै',
    usageContext: 'Informal slang imported from Angolan Portuguese, universally used in Lisbon.',
    examplePt: 'Tenho bué de saudades tuas.',
    exampleEn: 'I have so much longing/love for you.',
    exampleNepali: 'मलाई तिम्रो असाध्यै धेरै सम्झना छ।'
  },
  {
    pt: "Está bem / 'Tá bem",
    nepaliDevanagari: 'स्ता बेंइ / ता बेंइ',
    en: 'Alright / Okay / Sounds good',
    nepaliMeaning: 'हुन्छ / ठिक छ',
    usageContext: 'Polite acknowledgment in shops, restaurants, and with friends.',
    examplePt: '— Encontramo-nos às sete? — Está bem!',
    exampleEn: '— Meet at 7? — Sounds good!',
    exampleNepali: '— ७ बजे भेट्ने? — हुन्छ, ठिक छ!'
  }
];

export const CULTURAL_ETIQUETTE_GUIDES: CulturalEtiquetteGuide[] = [
  {
    id: 'greetings',
    title: 'The "Dois Beijinhos" & Social Greetings',
    titleNepali: 'पोर्चुगाली भेटघाट शिष्टाचार (दुईवटा गाला जोड्ने)',
    icon: '💋',
    summary: 'When introducing yourself or greeting friends in Portugal, women give two kisses on the cheeks (starting with the RIGHT cheek first!). Men shake hands unless close friends/family.',
    summaryNepali: 'पोर्चुगलमा भेट्दा महिला-महिला वा महिला-पुरुष बीच दायाँ गालाबाट सुरु गरेर दुईवटा गाला छुवाइन्छ (Dois Beijinhos)।',
    dos: [
      { text: 'Always lean to your RIGHT cheek first when offering greetings.', nepali: 'सधैं पहिले आफ्नो दायाँ गाला अघि सार्नुहोस्।' },
      { text: 'Say "Bom dia" (morning) before 12:00, "Boa tarde" (afternoon), and "Boa noite" (after dark).', nepali: 'समय अनुसार उपयुक्त अभिवादन गर्नुहोस्।' },
      { text: 'Say "Muito prazer" when meeting someone for the very first time.', nepali: 'पहिलो पटक भेट्दा "धेरै खुसी लाग्यो" (Muito prazer) भन्नुहोस्।' }
    ],
    donts: [
      { text: 'Do not kiss the lips; it is just a light cheek brush with a gentle kiss sound.', nepali: 'गाला मात्र हल्का छुवाउने हो।' },
      { text: 'Do not skip saying hello when walking into small neighborhood shops (Pastelaria, Talho, Mercearia).', nepali: 'कुनै पनि पसल पस्दा सधैं नमस्ते (Bom dia) भन्न नबिर्सनुहोस्।' }
    ],
    loveNoteFromSujan: 'Amisha, don’t feel shy! Portuguese people are super warm and welcoming. When we stroll through Lisbon together, you will love the friendly smiles everywhere! ❤️'
  },
  {
    id: 'formality_voce',
    title: 'The Formality Secret: "Tu" vs "O Senhor / A Senhora"',
    titleNepali: 'आदरार्थी भाषा: Tu र तपाईं/हजुर भन्ने तरिका',
    icon: '🎩',
    summary: 'Unlike Brazilian Portuguese which uses "Você" for everyone, in European Portugal calling someone "Você" directly can feel rude or cold! Use "Tu" for friends/loved ones, and address elders as "O senhor" (sir) or "A senhora" (ma’am).',
    summaryNepali: 'पोर्चुगलमा "Você" शब्द अलि रुखो मानिन्छ। प्रेमी र साथीभाइलाई "Tu" र अग्रज वा अपरिचितलाई "O senhor / A senhora" भनिन्छ।',
    dos: [
      { text: 'Use "Tu" when talking to Sujan, friends, and kids (e.g., "Como estás?").', nepali: 'सुजन र साथीभाइलाई "Tu" प्रयोग गर्नुहोस्।' },
      { text: 'Drop the pronoun completely for most polite verbs: "Pode ajudar-me?" (Can you help me?).', nepali: 'सर्वनाम नराखी सिधै क्रिया प्रयोग गर्दा सबैभन्दा सभ्य सुनिन्छ।' },
      { text: 'Use "A senhora" when addressing older Portuguese women politely.', nepali: 'उमेर पुगेका महिलाहरूलाई "A senhora" भन्नुहोस्।' }
    ],
    donts: [
      { text: 'Never snap your fingers or yell to call a waiter in a restaurant.', nepali: 'रेस्टुरेन्टमा वेटरलाई बोलाउँदा कहिल्यै औंला नपड्काउनुहोस्।' },
      { text: 'Do not use "Você" with teachers, doctors, or government officials.', nepali: 'अफिस वा डाक्टरसँग कुरा गर्दा "Você" नभन्नुहोस्।' }
    ],
    loveNoteFromSujan: 'With me, you are always "meu amor" and "tu" 🥰. You’ll be speaking effortlessly in no time!'
  },
  {
    id: 'dining_couvert',
    title: 'The Restaurant "Couvert" & Coffee Etiquette',
    titleNepali: 'रेस्टुरेन्ट र क्याफेका महत्त्वपूर्ण नियमहरू',
    icon: '🍷',
    summary: 'When you sit at a Portuguese restaurant, the waiter will place bread, olives, butter, and cheese (Couvert) on your table. It is NOT free! If you don’t eat it, you won’t be charged.',
    summaryNepali: 'रेस्टुरेन्टमा बस्नेबित्तिकै टेबलमा पाउरोटी, जैतून (Olives), चिज राखिन्छ (Couvert)। यो नि:शुल्क हुँदैन, नखाएमा पैसा तिर्नु पर्दैन।',
    dos: [
      { text: 'Feel free to enjoy the bread and cheese if you like; it usually costs only €1 to €3.', nepali: 'मन लागे खान सक्नुहुन्छ, यसको मूल्य सस्तो (१-३ युरो) हुन्छ।' },
      { text: 'Simply leave them untouched if you don’t want them, and they won’t appear on the bill.', nepali: 'नचाहिए नछोई राख्नुहोस्, बिलमा जोडिँदैन।' },
      { text: 'Tip 5-10% in sit-down restaurants for good service (though not legally mandatory).', nepali: 'राम्रो सेवा पाएमा केही सिक्का वा ५-१०% टिप दिन सकिन्छ।' }
    ],
    donts: [
      { text: 'Do not rush your meal! Dining in Portugal is a relaxed social experience.', nepali: 'हतार-हतार खाना नखानुहोस्, पोर्चुगलमा फुर्सदले आनन्द लिएर खाइन्छ।' },
      { text: 'Do not order a cappuccino after a heavy dinner; locals order a simple espresso (bica/café).', nepali: 'रातिको खानापछि दुध कफी नभई सामान्य एस्प्रेसो (Bica) पिउनुहोस्।' }
    ],
    loveNoteFromSujan: 'I have already scoped out the most romantic ocean-view taverns in Cascais for our first dinner date! 🌊🍽️'
  }
];
