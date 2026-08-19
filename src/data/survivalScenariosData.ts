export interface ScenarioDialogueStep {
  speaker: 'sujan' | 'local' | 'amisha';
  speakerName: string;
  speakerRole: string;
  pt: string;
  en: string;
  nepaliPhonetic: string;
  nepaliMeaning: string;
  culturalTip?: string;
  options?: {
    textPt: string;
    textEn: string;
    textNepali: string;
    isCorrect: boolean;
    feedback: string;
    nepaliFeedback: string;
  }[];
}

export interface SurvivalScenario {
  id: string;
  title: string;
  titleNepali: string;
  subtitle: string;
  location: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Essential';
  bgGradient: string;
  description: string;
  nepaliDescription: string;
  dialogue: ScenarioDialogueStep[];
  cheatSheet: {
    pt: string;
    en: string;
    nepali: string;
    nepaliPhonetic: string;
  }[];
}

export const SURVIVAL_SCENARIOS: SurvivalScenario[] = [
  {
    id: 'airport',
    title: 'Lisbon Airport Arrival',
    titleNepali: 'लिस्बन विमानस्थल आगमन (Aeroporto Humberto Delgado)',
    subtitle: 'Immigration, Baggage & Finding Transport',
    location: 'Aeroporto Humberto Delgado (Terminal 1)',
    icon: '✈️',
    difficulty: 'Essential',
    bgGradient: 'from-sky-500 to-blue-600',
    description: 'You just landed in Lisbon! Navigate immigration, ask for baggage claim, and buy your first Metro ticket to meet Sujan.',
    nepaliDescription: 'तपाईं लिस्बन विमानस्थलमा ओर्लनुभयो! इमिग्रेसन पार गर्ने, ब्यागेज लिने र मेट्रो टिकट किन्ने अभ्यास गर्नुहोस्।',
    cheatSheet: [
      { pt: 'Onde posso recolher a bagagem?', en: 'Where can I collect the baggage?', nepali: 'मेरो सामान कहाँबाट लिने?', nepaliPhonetic: 'ओन्दे पोसु रेकुलेर आ बागाजेम?' },
      { pt: 'Onde fica a estação de metro?', en: 'Where is the metro station?', nepali: 'मेट्रो स्टेशन कहाँ छ?', nepaliPhonetic: 'ओन्दे फिका आ इस्तासाउँ द मेत्रु?' },
      { pt: 'Um bilhete de metro, por favor.', en: 'One metro ticket, please.', nepali: 'एउटा मेट्रो टिकट दिनुहोस्, प्लिज।', nepaliPhonetic: 'उम बिलेत द मेत्रु, पुर फावोर।' },
      { pt: 'O meu namorado está à minha espera.', en: 'My boyfriend is waiting for me.', nepali: 'मेरो प्रेमी मलाई पर्खिरहनुभएको छ।', nepaliPhonetic: 'उ मेउ नामोरादु स्ता आ मिन्हा स्पेरा।' }
    ],
    dialogue: [
      {
        speaker: 'local',
        speakerName: 'Oficial de Imigração',
        speakerRole: 'Border Control Officer',
        pt: 'Bom dia. O seu passaporte e motivo da viagem, por favor?',
        en: 'Good morning. Your passport and purpose of travel, please?',
        nepaliPhonetic: 'बोम दिया। उ सेउ पासापोर्त इ मुतिभु दा वियाजेम, पुर फावोर?',
        nepaliMeaning: 'नमस्ते। तपाईंको पासपोर्ट र यात्राको उद्देश्य देखाउनुहोस्, प्लिज?',
        culturalTip: 'In Portugal, border officers are polite but formal. Answer clearly with a gentle smile.',
        options: [
          {
            textPt: 'Bom dia! Aqui está. Venho visitar e estudar.',
            textEn: 'Good morning! Here it is. I am coming to visit and study.',
            textNepali: 'नमस्ते! यो लिनुहोस्। म घुम्न र पढ्न आएकी हुँ।',
            isCorrect: true,
            feedback: 'Perfeito! Polished, polite, and confident.',
            nepaliFeedback: 'उत्कृष्ट! धेरै शिष्ट र स्पष्ट जवाफ।'
          },
          {
            textPt: 'Toma meu passaporte, mano.',
            textEn: 'Take my passport, bro.',
            textNepali: 'मेरो पासपोर्ट ले, ब्रो।',
            isCorrect: false,
            feedback: 'Too casual! "Mano" is slang for buddy/brother. Use formal manners with officers.',
            nepaliFeedback: 'अति अनौपचारिक भयो! "Mano" साथीभाइलाई मात्र भनिन्छ।'
          }
        ]
      },
      {
        speaker: 'local',
        speakerName: 'Funcionário do Aeroporto',
        speakerRole: 'Airport Staff',
        pt: 'As malas do voo chegam no tapete número 4, mesmo ali em frente.',
        en: 'Baggage from your flight arrives at belt number 4, right straight ahead.',
        nepaliPhonetic: 'आश मालाश् दु भोउ सेगाम नु तापेते नुमेरु क्वात्रु, मेज्मु आली एँ फ्रेन्ते।',
        nepaliMeaning: 'तपाईंको उडानको सामान बेल्ट नम्बर ४ मा आउँछ, ठ्याक्कै अगाडि।'
      },
      {
        speaker: 'amisha',
        speakerName: 'Amisha',
        speakerRole: 'At Metro Ticket Machine',
        pt: 'Desculpe, como posso comprar o cartão Navegante?',
        en: 'Excuse me, how can I buy the Navegante transport card?',
        nepaliPhonetic: 'दिशकुल्प, कोमु पोसु कोम्प्रा उ कार्ताउँ नावेगाँते?',
        nepaliMeaning: 'माफ गर्नुहोस्, म नाभेगान्ते (Navegante) कार्ड कसरी किन्न सक्छु?',
        culturalTip: '"Navegante Ocasional" (formerly Viva Viagem) is the reusable green paper card for all Lisbon trains, buses, and metro (€0.50 card fee + top-up).'
      },
      {
        speaker: 'sujan',
        speakerName: 'Sujan (Waiting outside with flowers 🌸)',
        speakerRole: 'Waiting at Arrivals',
        pt: 'Bem-vinda a Lisboa, meu amor! Estava com tantas saudades tuas!',
        en: 'Welcome to Lisbon, my love! I missed you so much!',
        nepaliPhonetic: 'बेंइ-विन्दा आ लिश्बोवा, मेउ आमोर! स्ताभा कोम तान्ताश् साउदादिश तुवाश!',
        nepaliMeaning: 'लिस्बनमा स्वागत छ मेरो माया! मलाई तिम्रो धेरै सम्झना आइरहेको थियो!',
        options: [
          {
            textPt: 'Finalmente juntos! Também tive tantas saudades tuas!',
            textEn: 'Finally together! I missed you so much too!',
            textNepali: 'अन्ततः हामी सँगै भयौं! मलाई पनि तिम्रो धेरै सम्झना आयो!',
            isCorrect: true,
            feedback: 'Aww! The most romantic European Portuguese reunion phrasing ❤️',
            nepaliFeedback: 'साँच्चिकै मायालु र शुद्ध पोर्चुगिज पुनर्मिलन ❤️'
          }
        ]
      }
    ]
  },
  {
    id: 'pastelaria',
    title: 'The Lisbon Pastelaria & Café',
    titleNepali: 'परम्परागत क्याफे र पेस्ट्री पसल (A Pastelaria)',
    subtitle: 'Ordering Bica, Galão, Pastel de Nata & The Bill',
    location: 'Pastelaria Santo António, Alfama',
    icon: '☕',
    difficulty: 'Essential',
    bgGradient: 'from-amber-500 to-orange-600',
    description: 'Learn the daily sacred ritual of Portuguese coffee culture. Order an espresso (bica), pastel de nata with cinnamon, and pay politely.',
    nepaliDescription: 'पोर्चुगलको क्याफे संस्कृति सिक्नुहोस्: कफी, प्रसिद्ध पेस्टल दे नाता अर्डर गर्ने र बिल माग्ने तरिका।',
    cheatSheet: [
      { pt: 'Um café / Uma bica, se faz favor.', en: 'An espresso, please.', nepali: 'एउटा कफी (एस्प्रेसो) दिनुहोस्, प्लिज।', nepaliPhonetic: 'उम काफे / उमा बिका, स फाश फावोर।' },
      { pt: 'Um galão e uma torrada.', en: 'A tall latte and thick toast.', nepali: 'एउटा दुध कफी (Latte) र टोस्ट।', nepaliPhonetic: 'उम गालाउँ इ उमा तुरादा।' },
      { pt: 'Um pastel de nata com canela.', en: 'A custard tart with cinnamon.', nepali: 'दालचिनी धुलोसहितको पेस्टल दे नाता।', nepaliPhonetic: 'उम पास्तेल द नाता कोम कानेला।' },
      { pt: 'A conta, por favor.', en: 'The bill, please.', nepali: 'बिल दिनुहोस्, प्लिज।', nepaliPhonetic: 'आ कोन्ता, पुर फावोर।' },
      { pt: 'Posso pagar com cartão?', en: 'Can I pay by card?', nepali: 'के म कार्डबाट तिर्न सक्छु?', nepaliPhonetic: 'पोसु पागार कोम कार्ताउँ?' }
    ],
    dialogue: [
      {
        speaker: 'local',
        speakerName: 'Empregado de Mesa',
        speakerRole: 'Café Barista / Waiter',
        pt: 'Bom dia! O que vai ser para hoje?',
        en: 'Good morning! What will it be for today?',
        nepaliPhonetic: 'बोम दिया! उ क भाइ सेर पारा ओज?',
        nepaliMeaning: 'नमस्ते! आज के लिनुहुन्छ?',
        culturalTip: 'In Lisbon, an espresso is commonly called "uma bica" (Beba Isto Com Açúcar). If you want milk coffee in a glass, ask for "um galão".',
        options: [
          {
            textPt: 'Bom dia! Uma bica e dois pastéis de nata, se faz favor.',
            textEn: 'Good morning! One espresso and two custard tarts, please.',
            textNepali: 'नमस्ते! एउटा कफी र दुईवटा पेस्टल दे नाता दिनुहोस्, प्लिज।',
            isCorrect: true,
            feedback: 'Perfect! "Se faz favor" is the most natural Portuguese way to say please.',
            nepaliFeedback: 'उत्कृष्ट! "Se faz favor" पोर्चुगलमा प्लिज भन्न सबैभन्दा बढी प्रयोग गरिन्छ।'
          },
          {
            textPt: 'Dá-me café rápido.',
            textEn: 'Give me coffee fast.',
            textNepali: 'मलाई छिटो कफी दे।',
            isCorrect: false,
            feedback: 'Too blunt! Portuguese service staff appreciate warm greetings and polite phrasing.',
            nepaliFeedback: 'अलि रुखो भयो! सधैं शिष्ट भाषा प्रयोग गर्नुहोस्।'
          }
        ]
      },
      {
        speaker: 'local',
        speakerName: 'Empregado de Mesa',
        speakerRole: 'Café Barista',
        pt: 'Deseja canela e açúcar nos pastéis?',
        en: 'Would you like cinnamon and sugar on the tarts?',
        nepaliPhonetic: 'दिसिजा कानेला इ आसूकार नुश् पास्तेइश?',
        nepaliMeaning: 'के पेस्टलमा दालचिनी (Canela) र चिनी धुलो छर्किदिऊँ?'
      },
      {
        speaker: 'amisha',
        speakerName: 'Amisha',
        speakerRole: 'Customer',
        pt: 'Sim, só canela, obrigada! Estão deliciosos.',
        en: 'Yes, only cinnamon, thank you! They are delicious.',
        nepaliPhonetic: 'सिम, सो कानेला, उब्रिगादा! स्ताउँ दिलिसियोजुश।',
        nepaliMeaning: 'हजुर, दालचिनी मात्र, धन्यवाद! धेरै मिठो छ।',
        culturalTip: 'Since Amisha is a woman, she says "Obrigada" (ending in -a). Men say "Obrigado" (ending in -o).'
      },
      {
        speaker: 'amisha',
        speakerName: 'Amisha',
        speakerRole: 'Asking for the bill',
        pt: 'A conta, se faz favor. Posso pagar com cartão?',
        en: 'The bill, please. Can I pay with card?',
        nepaliPhonetic: 'आ कोन्ता, स फाश फावोर। पोसु पागार कोम कार्ताउँ?',
        nepaliMeaning: 'बिल दिनुहोस्, प्लिज। के कार्डबाट भुक्तानी गर्न सकिन्छ?',
        options: [
          {
            textPt: 'A conta, se faz favor. Tem Multibanco?',
            textEn: 'The bill, please. Do you have Multibanco (card machine)?',
            textNepali: 'बिल दिनुहोस्, प्लिज। मल्टिब्यांको (कार्ड मेसिन) छ?',
            isCorrect: true,
            feedback: '"Multibanco" is the national card payment network in Portugal!',
            nepaliFeedback: 'पोर्चुगलमा कार्ड भुक्तानीलाई "Multibanco" भनिन्छ!'
          }
        ]
      }
    ]
  },
  {
    id: 'supermarket',
    title: 'Supermarket at Pingo Doce',
    titleNepali: 'सुपरमार्केटमा किनमेल (Pingo Doce / Continente)',
    subtitle: 'Weighing Fruit, Bag Question & Cashier Interaction',
    location: 'Pingo Doce Supermercado, Lisbon',
    icon: '🛒',
    difficulty: 'Essential',
    bgGradient: 'from-emerald-500 to-teal-700',
    description: 'Learn how to shop at Portugal’s favorite grocery stores (Pingo Doce & Continente). Weighing fruits, answering "Precisa de saco?", and receipt with NIF.',
    nepaliDescription: 'पिङ्गो दोसे वा कोन्तिनेन्तेमा सामान किन्ने, फलफूल जोख्ने र क्यासियरसँग कुराकानी गर्ने तरिका।',
    cheatSheet: [
      { pt: 'Precisa de saco?', en: 'Do you need a plastic bag?', nepali: 'के तपाईंलाई झोला चाहिन्छ?', nepaliPhonetic: 'प्रिसिजा द साकु?' },
      { pt: 'Quer contribuinte / NIF na fatura?', en: 'Do you want tax number (NIF) on the receipt?', nepali: 'बिलमा कर नम्बर (NIF) राख्ने हो?', nepaliPhonetic: 'केर कोन्त्रिबुइन्ते / एन.आई.एफ ना फातुरा?' },
      { pt: 'Não, obrigado / Não, obrigada.', en: 'No, thank you.', nepali: 'पर्दैन, धन्यवाद।', nepaliPhonetic: 'नाउँ, उब्रिगादा।' },
      { pt: 'Onde encontro o azeite e o arroz?', en: 'Where do I find olive oil and rice?', nepali: 'ओलिभ तेल र चामल कहाँ पाइन्छ?', nepaliPhonetic: 'ओन्दे एँकोन्त्रु उ आजेइते इ उ आरोश?' }
    ],
    dialogue: [
      {
        speaker: 'amisha',
        speakerName: 'Amisha',
        speakerRole: 'In the produce section',
        pt: 'Boa tarde. Onde posso pesar as maçãs?',
        en: 'Good afternoon. Where can I weigh the apples?',
        nepaliPhonetic: 'बोवा तार्द। ओन्दे पोसु पजार आश मासाँश?',
        nepaliMeaning: 'शुभ दिउँसो। म स्याउ कहाँ जोख्न सक्छु?',
        culturalTip: 'In Portuguese supermarkets, you MUST weigh fruits/veggies yourself in the produce section, note the 2 or 3-digit number, and stick the printed barcode label on the bag before heading to the register!'
      },
      {
        speaker: 'local',
        speakerName: 'Caixa do Supermercado',
        speakerRole: 'Supermarket Cashier',
        pt: 'Boa tarde! Tem cartão Poupa Mais ou Continente?',
        en: 'Good afternoon! Do you have a loyalty card?',
        nepaliPhonetic: 'बोवा तार्द! तेंइ कार्ताउँ पोउपा माइश ओउ कोन्तिनेन्ते?',
        nepaliMeaning: 'नमस्ते! के तपाईंसँग लोयल्टी/डिस्काउन्ट कार्ड छ?',
        options: [
          {
            textPt: 'Não tenho, obrigada.',
            textEn: 'I do not have one, thank you.',
            textNepali: 'छैन, धन्यवाद।',
            isCorrect: true,
            feedback: 'Clear, polite, and simple!',
            nepaliFeedback: 'सटीक र स्पष्ट जवाफ!'
          }
        ]
      },
      {
        speaker: 'local',
        speakerName: 'Caixa do Supermercado',
        speakerRole: 'Supermarket Cashier',
        pt: 'Precisa de saco para as compras? E quer número de contribuinte na fatura?',
        en: 'Do you need a bag for your groceries? And do you want tax number (NIF) on the invoice?',
        nepaliPhonetic: 'प्रिसिजा द साकु पारा आश कोम्प्राश? इ केर नुमेरु द कोन्त्रिबुइन्ते ना फातुरा?',
        nepaliMeaning: 'के सामानको लागि झोला चाहिन्छ? र बिलमा कर नम्बर (NIF) राख्नुहुन्छ?',
        culturalTip: 'In Portugal, bags cost around 10-15 cents. Cashiers will ALWAYS ask for "Contribuinte" (NIF) because Portuguese tax returns give deductions for registered purchases!',
        options: [
          {
            textPt: 'Sim, um saco, por favor. Sem contribuinte, obrigada.',
            textEn: 'Yes, one bag please. Without tax number, thank you.',
            textNepali: 'हजुर, एउटा झोला दिनुहोस्। कर नम्बर चाहिँदैन, धन्यवाद।',
            isCorrect: true,
            feedback: 'Perfeito! Exactly how locals answer daily.',
            nepaliFeedback: 'उत्कृष्ट! स्थानीय बासिन्दाहरूले दैनिक यसरी नै जवाफ दिन्छन्।'
          }
        ]
      }
    ]
  },
  {
    id: 'transport',
    title: 'Lisbon Metro & Carris Trams',
    titleNepali: 'मेट्रो र ट्राम यात्रा (Metro de Lisboa e Elétricos)',
    subtitle: 'Validating Passes, Asking for Directions & Stops',
    location: 'Estação Baixa-Chiado (Linha Azul/Verde)',
    icon: '🚇',
    difficulty: 'Intermediate',
    bgGradient: 'from-violet-600 to-indigo-800',
    description: 'Learn how to ride the iconic Metro lines, board Carris buses, and ask locals for directions in downtown Lisbon.',
    nepaliDescription: 'लिस्बनको सबवे (Metro) चढ्न, दिशा सोध्न र अर्को स्टेशन पत्ता लगाउन सिक्नुहोस्।',
    cheatSheet: [
      { pt: 'Qual é a linha para o Terreiro do Paço?', en: 'Which line goes to Terreiro do Paço?', nepali: 'तेरिरु दु पासो जान कुन लाइन चढ्नुपर्छ?', nepaliPhonetic: 'क्वाल ए आ लिन्हा पारा उ तेरेइरु दु पासु?' },
      { pt: 'Este comboio vai para Sintra?', en: 'Does this train go to Sintra?', nepali: 'के यो रेल सिन्ट्रा जान्छ?', nepaliPhonetic: 'एश्त कोम्बोइयु भाइ पारा सिन्त्रा?' },
      { pt: 'Qual é a próxima paragem?', en: 'What is the next stop?', nepali: 'अर्को स्टेशन/बस स्टप कुन हो?', nepaliPhonetic: 'क्वाल ए आ प्रोक्सिमा पाराजेम?' },
      { pt: 'Com licença!', en: 'Excuse me! (Passing through crowded transit)', nepali: 'बाटो छोडिदिनुस् न, प्लिज! (भीडमा)', nepaliPhonetic: 'कोम लिसेंसा!' }
    ],
    dialogue: [
      {
        speaker: 'amisha',
        speakerName: 'Amisha',
        speakerRole: 'Passenger at Station',
        pt: 'Com licença, para mudar para a linha verde tenho de sair aqui?',
        en: 'Excuse me, to change to the green line do I need to get off here?',
        nepaliPhonetic: 'कोम लिसेंसा, पारा मुदार पारा आ लिन्हा भेर्द तेंयु द साइर आकि?',
        nepaliMeaning: 'माफ गर्नुहोस्, हरियो लाइन फेर्न मैले यहीँ ओर्लनुपर्छ?',
        culturalTip: '"Com licença" is used when asking to pass through a crowd or politely getting someone’s attention. "Desculpe" is used for apologizing.'
      },
      {
        speaker: 'local',
        speakerName: 'Passageiro Local',
        speakerRole: 'Lisbon Local',
        pt: 'Sim, nesta estação de Baixa-Chiado. Siga as setas verdes no corredor.',
        en: 'Yes, at this Baixa-Chiado station. Follow the green arrows in the corridor.',
        nepaliPhonetic: 'सिम, नेश्ता इस्तासाउँ द बाइशा-सियादु। सिगा आश सेताश भेर्दिश नु कोरेदोर।',
        nepaliMeaning: 'हजुर, यही बाइशा-सियादु स्टेशनमा। कोरिडोरको हरियो तीरलाई पछ्याउनुहोस्।',
        options: [
          {
            textPt: 'Muito obrigada pela ajuda! Tenha um bom dia.',
            textEn: 'Thank you very much for the help! Have a good day.',
            textNepali: 'मद्दतको लागि धेरै धन्यवाद! तपाईंको दिन शुभ रहोस्।',
            isCorrect: true,
            feedback: 'Warm and gracious! Portuguese people appreciate friendly courtesy.',
            nepaliFeedback: 'धेरै राम्रो! पोर्चुगाली मानिसहरू यस्तो शिष्टता धेरै मन पराउँछन्।'
          }
        ]
      }
    ]
  },
  {
    id: 'pharmacy',
    title: 'At the Farmácia (Health & Wellness)',
    titleNepali: 'फार्मेसी / स्वास्थ्य सेवा (A Farmácia)',
    subtitle: 'Describing Symptoms, Cold Medicine & Pain Relief',
    location: 'Farmácia Central de Lisboa (Green Cross)',
    icon: '💊',
    difficulty: 'Intermediate',
    bgGradient: 'from-rose-500 to-red-600',
    description: 'Pharmacies in Portugal (look for the illuminated green cross) can help with mild ailments, colds, headaches, and emergency care.',
    nepaliDescription: 'फार्मेसीमा टाउको दुखेको, रुघाखोकीको औषधि माग्ने र लक्षण बताउने तरिका।',
    cheatSheet: [
      { pt: 'Estou com dor de cabeça e febre.', en: 'I have a headache and fever.', nepali: 'मलाई टाउको दुखेको र ज्वरो आएको छ।', nepaliPhonetic: 'इश्तोउ कोम दोर द काबेसा इ फेब्र।' },
      { pt: 'Tem algo para a dor de garganta?', en: 'Do you have something for sore throat?', nepali: 'घाँटी दुखेको केही औषधि छ?', nepaliPhonetic: 'तेंइ आल्गु पारा आ दोर द गार्गान्ता?' },
      { pt: 'Quantas vezes ao dia devo tomar?', en: 'How many times a day should I take it?', nepali: 'दिनमा कति पटक औषधि खानुपर्छ?', nepaliPhonetic: 'क्वान्ताश भेजिश आउ दिया देभु तुमार?' },
      { pt: 'Preciso de receita médica?', en: 'Do I need a doctor’s prescription?', nepali: 'के डाक्टरको प्रेस्क्रिप्सन चाहिन्छ?', nepaliPhonetic: 'प्रिसिजु द रेसेइता मेदिका?' }
    ],
    dialogue: [
      {
        speaker: 'local',
        speakerName: 'Farmacêutico',
        speakerRole: 'Licensed Pharmacist',
        pt: 'Bom dia. Em que posso ajudar?',
        en: 'Good morning. How can I help you?',
        nepaliPhonetic: 'बोम दिया। एँ क पोसु आजुदार?',
        nepaliMeaning: 'नमस्ते। म कसरी मद्दत गर्न सक्छु?',
        options: [
          {
            textPt: 'Bom dia. Estou constipada e com muita dor de garganta.',
            textEn: 'Good morning. I have a cold and bad sore throat.',
            textNepali: 'नमस्ते। मलाई रुघा लागेको छ र घाँटी धेरै दुखेको छ।',
            isCorrect: true,
            feedback: 'Note: In Portugal, "constipada" means having a cold (NOT constipated)!',
            nepaliFeedback: 'ख्याल गर्नुहोस्: पोर्चुगलमा "constipada" भनेको रुघाखोकी लाग्नु हो!'
          }
        ]
      },
      {
        speaker: 'local',
        speakerName: 'Farmacêutico',
        speakerRole: 'Pharmacist',
        pt: 'Recomendo estas pastilhas e paracetamol. Tome um comprimido de oito em oito horas.',
        en: 'I recommend these lozenges and paracetamol. Take one tablet every 8 hours.',
        nepaliPhonetic: 'रेकुमेन्दु एश्ताश पास्तिल्याश इ पारासितामोल। तोम उम कोम्प्रिमिदु द ओइतु एँ ओइतु ओराश।',
        nepaliMeaning: 'म यो चुस्ने चक्की र प्यारासिटामोल सिफारिस गर्छु। हरेक ८ घण्टामा एउटा चक्की खानुहोस्।'
      },
      {
        speaker: 'amisha',
        speakerName: 'Amisha',
        speakerRole: 'Customer',
        pt: 'Muito obrigada pelas explicações! As melhoras para o meu dia.',
        en: 'Thank you very much for the explanations!',
        nepaliPhonetic: 'मुइतु उब्रिगादा पेलाश इश्प्लिकसाँइश!',
        nepaliMeaning: 'सम्झाइदिनुभएकोमा धेरै धन्यवाद!'
      }
    ]
  }
];
