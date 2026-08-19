import { Unit } from '../types';

export const UNITS_DATA: Record<string, Unit> = {
  unit1: {
    id: 'unit1',
    chapterNum: 1,
    chapterTitle: 'Chapter 1: Greetings & Politeness',
    chapterDesc: 'The absolute basics of European Portuguese.',
    title: 'Greetings & Politeness',
    desc: 'Hello, please, and thank you.',
    color: '#3B82F6',
    iconName: 'MessageSquare',
    words: [
      { pt: "Olá", en: "Hello", phonetic: "oh-LAH", nepali: "नमस्ते", nepaliPhonetic: "ओला" },
      { pt: "Bom dia", en: "Good morning", phonetic: "bom DEE-ah", nepali: "शुभ प्रभात", nepaliPhonetic: "बोम् दिया" },
      { pt: "Boa tarde", en: "Good afternoon", phonetic: "BOH-ah TAR-deh", nepali: "शुभ दिउँसो", nepaliPhonetic: "बोआ तार्द" },
      { pt: "Boa noite", en: "Good night", phonetic: "BOH-ah NOY-teh", nepali: "शुभ रात्री", nepaliPhonetic: "बोआ नोइत" },
      { pt: "Adeus", en: "Goodbye", phonetic: "ah-DEH-oosh", nepali: "अलविदा", nepaliPhonetic: "अदेउश" },
      { pt: "Até logo", en: "See you later", phonetic: "ah-TEH LOH-goo", nepali: "पछि भेटौँला", nepaliPhonetic: "अते लोगु" },
      { pt: "Até amanhã", en: "See you tomorrow", phonetic: "ah-TEH ah-man-YAHNG", nepali: "भोलि भेटौँला", nepaliPhonetic: "अते अमान्याँ" },
      { pt: "Até já", en: "See you soon", phonetic: "ah-TEH zhah", nepali: "छिट्टै भेटौँला", nepaliPhonetic: "अते झा" },
      { pt: "Tchau", en: "Bye", phonetic: "chow", nepali: "बाई", nepaliPhonetic: "चाउ" },
      { pt: "Tudo bem?", en: "How are you? / All good?", phonetic: "TOO-doo beng", nepali: "सबै ठिक छ?", nepaliPhonetic: "तुदु बेइँ?" },
      { pt: "Como estás?", en: "How are you? (informal)", phonetic: "KOH-moo sh-TASH", nepali: "तिमीलाई कस्तो छ?", nepaliPhonetic: "कोमु स्ताश?" },
      { pt: "Como está?", en: "How are you? (formal)", phonetic: "KOH-moo sh-TAH", nepali: "तपाईंलाई कस्तो छ?", nepaliPhonetic: "कोमु स्ता?" },
      { pt: "Tudo ótimo", en: "Everything is great", phonetic: "TOO-doo OH-tee-moo", nepali: "सबै एकदमै राम्रो", nepaliPhonetic: "तुदु ओतिमु" },
      { pt: "Estou bem", en: "I am fine", phonetic: "sh-TOH beng", nepali: "म ठिक छु", nepaliPhonetic: "स्तो बेइँ" },
      { pt: "Mais ou menos", en: "So-so", phonetic: "mysh oh MEH-noosh", nepali: "ठिक-ठाकै", nepaliPhonetic: "माइश ओ मेनुश" },
      { pt: "E tu?", en: "And you? (informal)", phonetic: "ee too", nepali: "अनि तिमी?", nepaliPhonetic: "इ तु?" },
      { pt: "Por favor", en: "Please", phonetic: "poor fah-VOHR", nepali: "कृपया", nepaliPhonetic: "पोर फाभोर" },
      { pt: "Se faz favor", en: "If you please", phonetic: "seh fash fah-VOHR", nepali: "कृपया (पोर्चुगिज शैली)", nepaliPhonetic: "से फाश फाभोर" },
      { pt: "Obrigado", en: "Thank you (said by man)", phonetic: "oh-bree-GAH-doo", nepali: "धन्यवाद (पुरुष)", nepaliPhonetic: "ओब्रिगादु" },
      { pt: "Obrigada", en: "Thank you (said by woman)", phonetic: "oh-bree-GAH-dah", nepali: "धन्यवाद (महिला - अमिशाले भन्ने)", nepaliPhonetic: "ओब्रिगादा" },
      { pt: "Muito obrigado", en: "Thank you very much (man)", phonetic: "MWIN-too oh-bree-GAH-doo", nepali: "धेरै धन्यवाद", nepaliPhonetic: "मुइँतु ओब्रिगादु" },
      { pt: "Muito obrigada", en: "Thank you very much (woman)", phonetic: "MWIN-too oh-bree-GAH-dah", nepali: "धेरै धन्यवाद", nepaliPhonetic: "मुइँतु ओब्रिगादा" },
      { pt: "De nada", en: "You're welcome", phonetic: "deh NAH-dah", nepali: "स्वागत छ / केही छैन", nepaliPhonetic: "दे नादा" },
      { pt: "Não tem de quê", en: "Don't mention it", phonetic: "nowng teng deh keh", nepali: "उल्लेख गर्नु पर्दैन", nepaliPhonetic: "नाउँ तेइँ दे के" },
      { pt: "Com licença", en: "Excuse me", phonetic: "kom lee-SEN-sah", nepali: "माफ गर्नुहोस् (बाटो माग्दा)", nepaliPhonetic: "कोम लिसेन्सा" },
      { pt: "Desculpe", en: "Sorry / Excuse me", phonetic: "des-KOOL-peh", nepali: "माफ गर्नुहोस्", nepaliPhonetic: "दिसकुल्प" },
      { pt: "Peço desculpa", en: "I apologize", phonetic: "PEH-soo des-KOOL-pah", nepali: "म क्षमा चाहन्छु", nepaliPhonetic: "पेसु दिसकुल्पा" },
      { pt: "Não faz mal", en: "No problem / It's okay", phonetic: "nowng fash mahl", nepali: "कुनै समस्या छैन", nepaliPhonetic: "नाउँ फाश माल" },
      { pt: "Boa sorte", en: "Good luck", phonetic: "BOH-ah SORT", nepali: "शुभकामना", nepaliPhonetic: "बोआ सोर्त" },
      { pt: "Parabéns", en: "Congratulations", phonetic: "pah-rah-BEYNS", nepali: "बधाई छ", nepaliPhonetic: "पाराबेइँश" }
    ]
  },
  unit2: {
    id: 'unit2',
    chapterNum: 2,
    chapterTitle: 'Chapter 2: Introductions & Survival',
    chapterDesc: 'Who are you and making yourself understood.',
    title: 'Introductions & Survival',
    desc: 'Survival phrases in Portuguese.',
    color: '#10B981',
    iconName: 'User',
    words: [
      { pt: "Como te chamas?", en: "What is your name? (informal)", phonetic: "KOH-moo teh SHAH-mash", nepali: "तिम्रो नाम के हो?", nepaliPhonetic: "कोमु ते शामाश?" },
      { pt: "Como se chama?", en: "What is your name? (formal)", phonetic: "KOH-moo seh SHAH-mah", nepali: "तपाईंको नाम के हो?", nepaliPhonetic: "कोमु से शामा?" },
      { pt: "Chamo-me Amisha", en: "My name is Amisha", phonetic: "SHAH-moo-meh ah-MEE-shah", nepali: "मेरो नाम अमिशा हो", nepaliPhonetic: "शामु-मे अमिशा" },
      { pt: "O meu nome é...", en: "My name is...", phonetic: "oo meh-oo NOHM eh", nepali: "मेरो नाम ... हो", nepaliPhonetic: "उ मेउ नोम ए" },
      { pt: "De onde és?", en: "Where are you from?", phonetic: "deh OHND esh", nepali: "तिमी कहाँबाट हौ?", nepaliPhonetic: "दे ओन्द एश?" },
      { pt: "Sou do Nepal", en: "I am from Nepal", phonetic: "soh doo neh-PAHL", nepali: "म नेपालबाट हुँ", nepaliPhonetic: "सोउ दु नेफाल" },
      { pt: "Moro em Lisboa", en: "I live in Lisbon", phonetic: "MOH-roo eng leesh-BOH-ah", nepali: "म लिस्बनमा बस्छु", nepaliPhonetic: "मोरु एइँ लिश्बोआ" },
      { pt: "Fala inglês?", en: "Do you speak English?", phonetic: "FAH-lah een-GLESH", nepali: "के तपाईं अंग्रेजी बोल्नुहुन्छ?", nepaliPhonetic: "फाला इङ्गलेश?" },
      { pt: "Falo um pouco", en: "I speak a little", phonetic: "FAH-loo oong POH-koo", nepali: "म अलि-अलि बोल्छु", nepaliPhonetic: "फालु उँ पोकु" },
      { pt: "Não compreendo", en: "I don't understand", phonetic: "nowng kom-pree-EN-doo", nepali: "मैले बुझिनँ", nepaliPhonetic: "नाउँ कोम्प्रीएन्दु" },
      { pt: "Pode repetir?", en: "Can you repeat?", phonetic: "POHD reh-peh-TEER", nepali: "दोहोर्याउन सक्नुहुन्छ?", nepaliPhonetic: "पोद रेपेतिर?" },
      { pt: "Mais devagar, por favor", en: "Slower, please", phonetic: "mysh de-vah-GAR poor fah-VOHR", nepali: "कृपया अलि बिस्तारै", nepaliPhonetic: "माइश दिभागार पोर फाभोर" },
      { pt: "Como se diz...?", en: "How do you say...?", phonetic: "KOH-moo seh deesh", nepali: "...कसरी भनिन्छ?", nepaliPhonetic: "कोमु से दिश?" },
      { pt: "Preciso de ajuda", en: "I need help", phonetic: "pre-SEE-zoo deh ah-ZHOO-dah", nepali: "मलाई मद्दत चाहिन्छ", nepaliPhonetic: "प्रिसिजु दे अझुदा" },
      { pt: "Pode ajudar-me?", en: "Can you help me?", phonetic: "POHD ah-zhoo-DAR-meh", nepali: "मलाई मद्दत गर्न सक्नुहुन्छ?", nepaliPhonetic: "पोद अझुदार-मे?" }
    ]
  },
  unit3: {
    id: 'unit3',
    chapterNum: 3,
    chapterTitle: 'Chapter 3: Essential Needs & Dining',
    chapterDesc: 'Everything you need at Lisbon cafes and restaurants.',
    title: 'Essential Needs & Dining',
    desc: 'Cafes and pastelarias in Lisbon.',
    color: '#F59E0B',
    iconName: 'Coffee',
    words: [
      { pt: "O menu, por favor", en: "The menu, please", phonetic: "oo meh-NOO poor fah-VOHR", nepali: "मेनु दिनुहोस्, कृपया", nepaliPhonetic: "उ मेनु पोर फाभोर" },
      { pt: "A ementa", en: "The menu (Portuguese word)", phonetic: "ah ee-MEN-tah", nepali: "मेनु", nepaliPhonetic: "आ इमेन्ता" },
      { pt: "Eu queria...", en: "I would like...", phonetic: "eh-oo KREE-ah", nepali: "मलाई ... मनपर्थ्यो", nepaliPhonetic: "एउ ख्रिया" },
      { pt: "Um café", en: "An espresso", phonetic: "oong kah-FEH", nepali: "एक कप कफी", nepaliPhonetic: "उँ काफे" },
      { pt: "Uma bica", en: "An espresso in Lisbon", phonetic: "OO-mah BEE-kah", nepali: "लिस्बन कफी (बिका)", nepaliPhonetic: "उमा बिका" },
      { pt: "Um galão", en: "Tall glass milky coffee", phonetic: "oong gah-LOWNG", nepali: "दुध-कफी (गालाउँ)", nepaliPhonetic: "उँ गालाउँ" },
      { pt: "Uma meia de leite", en: "Half milk half coffee", phonetic: "OO-mah MAY-ah deh LAY-teh", nepali: "आधा दुध आधा कफी", nepaliPhonetic: "उमा मेइया दे लेइत" },
      { pt: "Uma água sem gás", en: "Still water", phonetic: "OO-mah AH-gwah seng gash", nepali: "सादा पानी", nepaliPhonetic: "उमा आग्वा सेइँ ग्याश" },
      { pt: "Uma água com gás", en: "Sparkling water", phonetic: "OO-mah AH-gwah kong gash", nepali: "ग्यास भएको पानी", nepaliPhonetic: "उमा आग्वा कोम ग्याश" },
      { pt: "Um pastel de nata", en: "Custard tart", phonetic: "oong pash-TEL deh NAH-tah", nepali: "पास्तेल द नाता (मिठाई)", nepaliPhonetic: "उँ पास्तेल दे नाता" },
      { pt: "Uma tosta mista", en: "Ham and cheese toastie", phonetic: "OO-mah TOSH-tah MEESH-tah", nepali: "चीज र ह्याम टोस्ट", nepaliPhonetic: "उमा तोश्ता मिश्ता" },
      { pt: "A conta, por favor", en: "The bill, please", phonetic: "ah KOHN-tah poor fah-VOHR", nepali: "बिल दिनुहोस्, कृपया", nepaliPhonetic: "आ कोन्ता पोर फाभोर" },
      { pt: "Quanto é?", en: "How much is it?", phonetic: "KWAHN-too eh", nepali: "कति भयो?", nepaliPhonetic: "क्वान्दु ए?" },
      { pt: "Posso pagar com cartão?", en: "Can I pay by card?", phonetic: "POH-soo pah-GAR kong kar-TOWNG", nepali: "कार्डबाट तिर्न मिल्छ?", nepaliPhonetic: "पोसु पागार कोम कार्ताउँ?" },
      { pt: "Estava delicioso", en: "It was delicious", phonetic: "sh-TAH-vah deh-lee-see-OH-zoo", nepali: "धेरै स्वादिलो थियो", nepaliPhonetic: "स्ताभा दिलिसिओजु" }
    ]
  },
  unit4: {
    id: 'unit4',
    chapterNum: 4,
    chapterTitle: 'Chapter 4: Getting Around & Time',
    chapterDesc: 'Mastering metro, trams, and directions.',
    title: 'Getting Around & Time',
    desc: 'Navigating Lisbon and transport.',
    color: '#EF4444',
    iconName: 'MapPin',
    words: [
      { pt: "Onde fica o metro?", en: "Where is the metro?", phonetic: "OHND FEE-kah oo MEH-troo", nepali: "मेट्रो स्टेशन कहाँ छ?", nepaliPhonetic: "ओन्द फिका उ मेत्रु?" },
      { pt: "A estação de comboios", en: "The train station", phonetic: "ah sh-tah-SOWNG deh kom-BOY-oosh", nepali: "रेल स्टेशन", nepaliPhonetic: "आ स्तासाउँ दे कोम्बोइश" },
      { pt: "A paragem de autocarro", en: "The bus stop", phonetic: "ah pah-RAH-zheng deh oh-toh-KAH-roo", nepali: "बस स्टप", nepaliPhonetic: "आ पाराझेइँ दे आउतोकारु" },
      { pt: "O aeroporto", en: "The airport", phonetic: "oo ah-eh-roo-POOR-too", nepali: "विमानस्थल", nepaliPhonetic: "उ आएरोपोर्तु" },
      { pt: "Um bilhete, por favor", en: "A ticket, please", phonetic: "oong bee-LYEH-teh poor fah-VOHR", nepali: "एउटा टिकट, कृपया", nepaliPhonetic: "उँ बिल्येते पोर फाभोर" },
      { pt: "Ida e volta", en: "Round trip", phonetic: "EE-dah ee VOHL-tah", nepali: "दुईतर्फी (जाने र आउने)", nepaliPhonetic: "इदा इ भोल्ता" },
      { pt: "Só ida", en: "One way", phonetic: "soh EE-dah", nepali: "एकतर्फी", nepaliPhonetic: "सो इदा" },
      { pt: "À esquerda", en: "On the left", phonetic: "ah sh-KEHR-dah", nepali: "देब्रेतर्फ", nepaliPhonetic: "आ श्केर्दा" },
      { pt: "À direita", en: "On the right", phonetic: "ah dee-RAY-tah", nepali: "दाहिनेतर्फ", nepaliPhonetic: "आ दिरेइता" },
      { pt: "Sempre em frente", en: "Straight ahead", phonetic: "SENG-pr eng FRENT", nepali: "सिधा अगाडि", nepaliPhonetic: "सेम्प्रे एइँ फ्रेन्ते" },
      { pt: "Perto", en: "Near", phonetic: "PEHR-too", nepali: "नजिक", nepaliPhonetic: "पेर्दु" },
      { pt: "Longe", en: "Far", phonetic: "LONZH", nepali: "टाढा", nepaliPhonetic: "लोन्झ" },
      { pt: "Que horas são?", en: "What time is it?", phonetic: "keh OH-rash sowng", nepali: "कति बज्यो?", nepaliPhonetic: "के ओराश साउँ?" }
    ]
  },
  unit5: {
    id: 'unit5',
    chapterNum: 5,
    chapterTitle: 'Chapter 5: Supermarket & Daily Shopping',
    chapterDesc: 'Navigating grocery stores, fruits, and prices in Lisbon.',
    title: 'Supermarket & Shopping',
    desc: 'Pingo Doce, Continente, and fresh markets.',
    color: '#8B5CF6',
    iconName: 'ShoppingBag',
    words: [
      { pt: "O supermercado", en: "The supermarket", phonetic: "oo soo-pehr-mehr-KAH-doo", nepali: "सुपरमार्केट", nepaliPhonetic: "उ सुपेरमेर्कादु" },
      { pt: "O saco de compras", en: "The shopping bag", phonetic: "oo SAH-koo deh KOHM-prash", nepali: "किनमेल झोला", nepaliPhonetic: "उ साकु दे कोम्प्राश" },
      { pt: "Precisa de saco?", en: "Do you need a bag?", phonetic: "pre-SEE-zah deh SAH-koo", nepali: "झोला चाहिन्छ?", nepaliPhonetic: "प्रिसिजा दे साकु?" },
      { pt: "Tem cartão de cliente?", en: "Do you have loyalty card?", phonetic: "teng kar-TOWNG deh klee-EN-teh", nepali: "क्लाइन्ट कार्ड छ?", nepaliPhonetic: "तेइँ कार्ताउँ दे क्लियेन्ते?" },
      { pt: "Fruta e legumes", en: "Fruit and vegetables", phonetic: "FROO-tah ee leh-GOO-mesh", nepali: "फलफूल र तरकारी", nepaliPhonetic: "फ्रुता इ लेगुमेश" },
      { pt: "Maçã", en: "Apple", phonetic: "mah-SAHNG", nepali: "स्याउ", nepaliPhonetic: "मासाँ" },
      { pt: "Banana", en: "Banana", phonetic: "bah-NAH-nah", nepali: "केरा", nepaliPhonetic: "बानाना" },
      { pt: "Leite", en: "Milk", phonetic: "LAY-teh", nepali: "दूध", nepaliPhonetic: "लेइते" },
      { pt: "Pão fresco", en: "Fresh bread", phonetic: "powng FRESH-koo", nepali: "ताजा पाउरोटी", nepaliPhonetic: "पाउँ फ्रेश्कु" },
      { pt: "Ovos", en: "Eggs", phonetic: "OH-voosh", nepali: "अण्डा", nepaliPhonetic: "ओभुश" },
      { pt: "Arroz", en: "Rice", phonetic: "ah-ROHSH", nepali: "चामल / भात", nepaliPhonetic: "अरोश" },
      { pt: "Azeite de oliva", en: "Olive oil", phonetic: "ah-ZAY-teh deh oh-LEE-vah", nepali: "जैतुनको तेल", nepaliPhonetic: "अजेइते दे ओलिभा" }
    ]
  },
  unit6: {
    id: 'unit6',
    chapterNum: 6,
    chapterTitle: 'Chapter 6: Health & Pharmacy',
    chapterDesc: 'Expressing feelings, ailments, and pharmacy essentials.',
    title: 'Health & Pharmacy',
    desc: 'Farmácia and doctor terms.',
    color: '#EC4899',
    iconName: 'Heart',
    words: [
      { pt: "A farmácia", en: "The pharmacy", phonetic: "ah far-MAH-see-ah", nepali: "औषधि पसल", nepaliPhonetic: "आ फार्मासिया" },
      { pt: "Estou doente", en: "I am sick", phonetic: "sh-TOH doo-ENT", nepali: "म बिरामी छु", nepaliPhonetic: "स्तो दुएन्ते" },
      { pt: "Dói-me a cabeça", en: "My head hurts", phonetic: "DOY-meh ah kah-BEH-sah", nepali: "मेरो टाउको दुखिरहेको छ", nepaliPhonetic: "दोइ-मे आ काबेसा" },
      { pt: "Dói-me a barriga", en: "My stomach hurts", phonetic: "DOY-meh ah bah-REE-gah", nepali: "मेरो पेट दुखिरहेको छ", nepaliPhonetic: "दोइ-मे आ बारिगा" },
      { pt: "Tenho febre", en: "I have a fever", phonetic: "TEH-nyoo FEH-breh", nepali: "मलाई ज्वरो आएको छ", nepaliPhonetic: "तेन्यु फेब्रे" },
      { pt: "Um medicamento", en: "A medicine", phonetic: "oong meh-dee-kah-MEN-too", nepali: "औषधि", nepaliPhonetic: "उँ मेदिकाactionमेन्दु" },
      { pt: "O hospital", en: "The hospital", phonetic: "oo osh-pee-TAHL", nepali: "अस्पताल", nepaliPhonetic: "उ ओश्पिताल" },
      { pt: "Emergência 112", en: "Emergency 112 (Portugal)", phonetic: "eh-mehr-ZHEN-see-ah", nepali: "आपतकालीन ११२", nepaliPhonetic: "एमेर्झेन्सिया ११०" }
    ]
  },
  unit7: {
    id: 'unit7',
    chapterNum: 7,
    chapterTitle: 'Chapter 7: Love & Messages for Sujan',
    chapterDesc: 'Romantic phrases, daily love notes, and Lisbon dreams together.',
    title: 'Love Notes for Sujan',
    desc: 'Sweet words and romantic Portuguese.',
    color: '#FF2A85',
    iconName: 'Heart',
    words: [
      { pt: "Amo-te", en: "I love you", phonetic: "AH-moo-teh", nepali: "म तिमीलाई माया गर्छु", nepaliPhonetic: "आमु-ते", note: "The most classic European PT declaration of love" },
      { pt: "Meu amor", en: "My love", phonetic: "meh-oo ah-MOHR", nepali: "मेरो माया", nepaliPhonetic: "मेउ अमोर", note: "Used affectionately for Sujan" },
      { pt: "Tenho saudades tuas", en: "I miss you so much", phonetic: "TEH-nyoo sow-DAH-desh TOO-ash", nepali: "मलाई तिम्रो धेरै याद आउँछ", nepaliPhonetic: "तेन्यु साउदादिश तुआश", note: "Authentic Lisbon way of saying 'I miss you'" },
      { pt: "És a minha vida", en: "You are my life", phonetic: "ESH ah MEE-nyah VEE-dah", nepali: "तिमी मेरो जीवन हौ", nepaliPhonetic: "एश आ मिन्या भिदा" },
      { pt: "Beijinhos doces", en: "Sweet kisses", phonetic: "bay-ZHEE-nyoosh DOH-sesh", nepali: "मीठो चुम्बनहरू", nepaliPhonetic: "बेइझिन्युश दोसिश" },
      { pt: "Estou a contar os dias", en: "I am counting the days", phonetic: "sh-TOH ah kon-TAR oosh DEE-ash", nepali: "म दिनहरू गन्दै छु", nepaliPhonetic: "स्तो आ कोन्तार उश दियाश", note: "Counting down to meet in Portugal" },
      { pt: "Para sempre contigo", en: "Forever with you", phonetic: "PAH-rah SENG-pr kon-TEE-goo", nepali: "सधैँ तिमीसँग", nepaliPhonetic: "पारा सेम्प्रे कोन्तिगु" },
      { pt: "O meu coração é teu", en: "My heart is yours", phonetic: "oo meh-oo koo-rah-SOWNG eh teh-oo", nepali: "मेरो मुटु तिम्रो हो", nepaliPhonetic: "उ मेउ कोरासाउँ ए तेउ" },
      { pt: "És o meu príncipe", en: "You are my prince", phonetic: "ESH oo meh-oo PREEN-see-peh", nepali: "तिमी मेरो राजकुमार हौ", nepaliPhonetic: "एश उ मेउ प्रिन्सिप" },
      { pt: "Sonho contigo todos os dias", en: "I dream of you every single day", phonetic: "SOH-nyoo kon-TEE-goo TOH-doosh oosh DEE-ash", nepali: "म हरेक दिन तिम्रो सपना देख्छु", nepaliPhonetic: "सोन्यु कोन्तिगु तोदुश उश दियाश" },
      { pt: "Um abraço apertado", en: "A tight warm hug", phonetic: "oong ah-BRAH-soo ah-pehr-TAH-doo", nepali: "न्यानो अँगालो", nepaliPhonetic: "उँ आब्रासु आपेरतादु" }
    ]
  }
};

export const WORDS_OF_THE_DAY = [
  { 
    pt: "Saudade", 
    en: "A profound emotional longing for someone dearly loved who is far away", 
    phonetic: "sow-DAH-deh", 
    type: "noun",
    examplePt: "Tenho tanta saudade do teu abraço.",
    exampleEn: "I have so much saudade for your embrace."
  },
  { 
    pt: "Desenrascanço", 
    en: "The quintessential Portuguese art of improvising a clever solution", 
    phonetic: "de-zen-rahs-KAHN-soo", 
    type: "noun",
    examplePt: "Com jeito e desenrascanço, tudo se resolve.",
    exampleEn: "With patience and improvising, everything gets solved."
  },
  { 
    pt: "Cafuné", 
    en: "The tender act of running your fingers affectionately through someone's hair", 
    phonetic: "kah-foo-NEH", 
    type: "noun",
    examplePt: "Fazer cafuné até adormeceres.",
    exampleEn: "Running my fingers through your hair until you fall asleep."
  },
  { 
    pt: "Apaixonar", 
    en: "To fall deeply and passionately in love with someone special", 
    phonetic: "ah-py-shoo-NAR", 
    type: "verb",
    examplePt: "Volto a apaixonar-me por ti todos os dias.",
    exampleEn: "I fall in love with you all over again every day."
  },
  { 
    pt: "Fado", 
    en: "Soulful Portuguese music and concept of shared destiny", 
    phonetic: "FAH-doo", 
    type: "noun",
    examplePt: "O fado de estarmos juntos para sempre.",
    exampleEn: "The destiny of us being together forever."
  },
  { 
    pt: "Coração", 
    en: "Heart and soul, the center of love and warmth", 
    phonetic: "koo-rah-SOWNG", 
    type: "noun",
    examplePt: "Guardei-te dentro do meu coração.",
    exampleEn: "I kept you safe inside my heart."
  },
  { 
    pt: "Carinho", 
    en: "Affection, tender caring, and loving gentleness", 
    phonetic: "kah-REE-nyoo", 
    type: "noun",
    examplePt: "Tratar-te sempre com todo o carinho.",
    exampleEn: "Always treating you with all my affection."
  }
];

export const CULTURE_ARTICLES = [
  {
    id: "greetings",
    title: "The Art of the Double Kiss",
    emoji: "😘",
    summary: "How to greet people in Portugal without making things awkward.",
    content: "In Portugal, the standard greeting between women, or a man and a woman, is two kisses on the cheeks (dois beijinhos), starting with the right cheek. Men typically shake hands or give an embrace with other men.",
    audioPhrase: "Dois beijinhos",
    audioEn: "Two kisses"
  },
  {
    id: "coffee",
    title: "How to Order Coffee in Lisbon",
    emoji: "☕",
    summary: "A 'bica', a 'meia de leite', or a 'galão'? Learn the Lisbon coffee culture.",
    content: "In Lisbon, a single espresso is called a 'bica'. A 'galão' is tall and milky served in a glass, and a 'meia de leite' is half milk, half coffee in a ceramic cup. Pair it with a fresh 'pastel de nata'!",
    audioPhrase: "Queria uma bica e um pastel de nata, por favor",
    audioEn: "I'd like an espresso and a custard tart, please"
  }
];

export const ALL_WORDS_FLAT = Object.values(UNITS_DATA).flatMap((u: any) => u.words);
