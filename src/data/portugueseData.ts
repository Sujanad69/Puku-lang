import { Unit, VocabWord } from '../types';

export const UNITS_DATA: Record<string, Unit> = {
  unit1: {
    id: 'unit1',
    title: 'Unit 1: Basic Greetings & Essentials',
    desc: 'Master everyday Portuguese greetings and polite phrases from scratch.',
    color: '#58cc02',
    iconName: 'MessageSquare',
    words: [
      { pt: 'Olá', en: 'Hello', phonetic: 'oh-LAH', note: 'Standard friendly greeting' },
      { pt: 'Bom dia', en: 'Good morning', phonetic: 'boh-DEE-ah', note: 'Used until noon' },
      { pt: 'Boa tarde', en: 'Good afternoon', phonetic: 'BOH-ah TAHR-deh', note: 'Used from noon until sunset' },
      { pt: 'Boa noite', en: 'Good night / evening', phonetic: 'BOH-ah NOY-teh', note: 'Used after dark' },
      { pt: 'Tudo bem?', en: 'How are you?', phonetic: 'TOO-doo behm?', note: 'Very common informal check-in' },
      { pt: 'Como estás?', en: 'How are you? (informal)', phonetic: 'KOH-moo esh-TASH?', note: 'Direct informal question' },
      { pt: 'Muito prazer', en: 'Nice to meet you', phonetic: 'MOOY-too prah-ZAIR', note: 'Polite initial greeting' },
      { pt: 'Obrigada', en: 'Thank you (female speaker)', phonetic: 'oh-bree-GAH-dah', note: 'Always use Obrigada as a woman!' },
      { pt: 'De nada', en: "You're welcome", phonetic: 'deh NAH-dah', note: 'Standard reply to thank you' },
      { pt: 'Sim', en: 'Yes', phonetic: 'seem', note: 'Affirmative' },
      { pt: 'Não', en: 'No', phonetic: 'nowng', note: 'Nasal "ao" sound' },
      { pt: 'Desculpe', en: 'Sorry / Excuse me', phonetic: 'desh-KOOL-peh', note: 'Polite apology' },
      { pt: 'Com licença', en: 'Excuse me (passing by)', phonetic: 'kohm lee-SEHN-sah', note: 'Polite way to walk past someone' },
      { pt: 'Adeus', en: 'Goodbye', phonetic: 'ah-DAY-oosh', note: 'Formal farewell' },
      { pt: 'Até logo', en: 'See you later', phonetic: 'ah-TEH LOH-goo', note: 'Casual see you later' },
      { pt: 'Até amanhã', en: 'See you tomorrow', phonetic: 'ah-TEH ah-mah-NYAH', note: 'Tomorrow farewell' },
      { pt: 'Por favor / Faz favor', en: 'Please', phonetic: 'fahz fah-VOR', note: 'Faz favor is very common in Portugal' },
      { pt: 'Chamo-me...', en: 'My name is...', phonetic: 'SHAH-moo-meh...', note: 'Standard way to state your name' },
      { pt: 'Qual é o teu nome?', en: 'What is your name?', phonetic: 'kwahl eh oo tay-oo NOH-meh?', note: 'Informal name query' },
      { pt: 'Muito bem', en: 'Very well', phonetic: 'MOOY-too behm', note: 'Positive status' },
      { pt: 'Mais ou menos', en: 'So-so', phonetic: 'maysh oo MAY-noosh', note: 'So-so status' },
      { pt: 'Não compreendo', en: 'I do not understand', phonetic: 'nowng kohm-pree-EHN-doo', note: 'Crucial beginner phrase' },
      { pt: 'Bem-vinda', en: 'Welcome (female)', phonetic: 'behm-VEEN-dah', note: 'Welcoming a woman' },
      { pt: 'Claro', en: 'Of course', phonetic: 'KLAH-roo', note: 'Enthusiastic agreement' }
    ]
  },
  unit2: {
    id: 'unit2',
    title: 'Unit 2: Cafe, Food & Pastel de Nata',
    desc: 'Order delicious Portuguese coffee, pastries, and meals like a local in Lisbon.',
    color: '#ff9600',
    iconName: 'Coffee',
    words: [
      { pt: 'Pão', en: 'Bread', phonetic: 'powng', note: 'Staple of Portuguese meals' },
      { pt: 'Água', en: 'Water', phonetic: 'AH-gwah', note: 'Água sem gás = Still water' },
      { pt: 'Queijo', en: 'Cheese', phonetic: 'KAY-zhoo', note: 'Famous Portuguese cheeses' },
      { pt: 'Café', en: 'Coffee (Espresso)', phonetic: 'kah-FEH', note: 'An espresso is called "um café" or "uma bica"' },
      { pt: 'Chá', en: 'Tea', phonetic: 'shah', note: 'Hot beverage' },
      { pt: 'Pastel de nata', en: 'Custard tart', phonetic: 'pahsh-TEL deh NAH-tah', note: 'Portugal’s iconic pastry!' },
      { pt: 'A conta', en: 'The bill', phonetic: 'ah KOHN-tah', note: 'A conta, por favor!' },
      { pt: 'Estou com fome', en: 'I am hungry (female)', phonetic: 'esh-TOO kohm FOH-meh', note: 'Literally: I am with hunger' },
      { pt: 'Frango', en: 'Chicken', phonetic: 'FRAWNG-goo', note: 'Piri-piri chicken favourite' },
      { pt: 'Vinho', en: 'Wine', phonetic: 'VEEN-yoo', note: 'Vinho verde / Vinho tinto' },
      { pt: 'Cerveja', en: 'Beer', phonetic: 'sair-VAY-zhah', note: 'Imperial / Sagres / Super Bock' },
      { pt: 'Peixe', en: 'Fish', phonetic: 'PAY-sheh', note: 'Fresh Atlantic fish' },
      { pt: 'Carne', en: 'Meat', phonetic: 'KAHR-neh', note: 'Red meat or pork' },
      { pt: 'Sopa', en: 'Soup', phonetic: 'SOH-pah', note: 'Caldo verde soup' },
      { pt: 'Sobremesa', en: 'Dessert', phonetic: 'soh-breh-MAY-zah', note: 'Sweet finish' },
      { pt: 'Pequeno-almoço', en: 'Breakfast', phonetic: 'peh-KAY-noo ahl-MOH-soo', note: 'European PT term for breakfast' },
      { pt: 'Almoço', en: 'Lunch', phonetic: 'ahl-MOH-soo', note: 'Main afternoon meal' },
      { pt: 'Jantar', en: 'Dinner', phonetic: 'zhahn-TAHR', note: 'Evening dinner' },
      { pt: 'Garfo', en: 'Fork', phonetic: 'GAHR-foo', note: 'Utensil' },
      { pt: 'Faca', en: 'Knife', phonetic: 'FAH-kah', note: 'Utensil' },
      { pt: 'Colher', en: 'Spoon', phonetic: 'koo-LYAIR', note: 'Utensil' },
      { pt: 'Copo', en: 'Glass', phonetic: 'KOH-poo', note: 'Drinking vessel' },
      { pt: 'Delicioso', en: 'Delicious', phonetic: 'deh-lee-SYOH-zoo', note: 'Praising the food' },
      { pt: 'Açúcar', en: 'Sugar', phonetic: 'ah-SOO-kahr', note: 'Sweetener' }
    ]
  },
  unit3: {
    id: 'unit3',
    title: 'Unit 3: Travel, Lisbon & Directions',
    desc: 'Navigate trams, trains, streets, and landmark spots across Portugal with confidence.',
    color: '#32ade6',
    iconName: 'MapPin',
    words: [
      { pt: 'Onde é...?', en: 'Where is...?', phonetic: 'OHN-deh eh...?', note: 'Asking for locations' },
      { pt: 'Bilhete', en: 'Ticket', phonetic: 'bee-LYEH-teh', note: 'European PT for ticket (not ingresso)' },
      { pt: 'Aeroporto', en: 'Airport', phonetic: 'ah-eh-roo-POR-too', note: 'Lisbon / Porto airport' },
      { pt: 'Casa de banho', en: 'Bathroom', phonetic: 'KAH-zah deh BAHN-yoo', note: 'European PT term (not banheiro!)' },
      { pt: 'Autocarro', en: 'Bus', phonetic: 'ow-toh-KAH-roo', note: 'European PT term (not ônibus!)' },
      { pt: 'Comboio', en: 'Train', phonetic: 'kohm-BOY-oo', note: 'European PT term (not trem!)' },
      { pt: 'Metro', en: 'Subway / Metro', phonetic: 'MEH-troo', note: 'Underground train' },
      { pt: 'Táxi', en: 'Taxi', phonetic: 'TAHK-see', note: 'Cab service' },
      { pt: 'Estou perdida', en: 'I am lost (female)', phonetic: 'esh-TOO pair-DEE-dah', note: 'Asking for help' },
      { pt: 'Esquerda', en: 'Left', phonetic: 'esh-KAIR-dah', note: 'Direction' },
      { pt: 'Direita', en: 'Right', phonetic: 'dee-RAY-tah', note: 'Direction' },
      { pt: 'Dinheiro', en: 'Money', phonetic: 'dee-NYAY-roo', note: 'Cash' },
      { pt: 'Multibanco', en: 'ATM / Cash machine', phonetic: 'mool-tee-BAHN-koo', note: 'Portuguese national bank network' },
      { pt: 'Rua', en: 'Street', phonetic: 'ROO-ah', note: 'Road name' },
      { pt: 'Longe', en: 'Far', phonetic: 'LOHN-zheh', note: 'Distance' },
      { pt: 'Perto', en: 'Near', phonetic: 'PAIR-too', note: 'Proximity' },
      { pt: 'Paragem', en: 'Bus stop', phonetic: 'pah-RAH-zhehms', note: 'European PT bus stop' },
      { pt: 'Estação', en: 'Station', phonetic: 'esh-tah-SOWNG', note: 'Train/Metro station' },
      { pt: 'Entrada', en: 'Entrance', phonetic: 'ehn-TRAH-dah', note: 'Way in' },
      { pt: 'Saída', en: 'Exit', phonetic: 'sah-EE-dah', note: 'Way out' },
      { pt: 'Mapa', en: 'Map', phonetic: 'MAH-pah', note: 'City guide' },
      { pt: 'Preciso de ajuda', en: 'I need help', phonetic: 'preh-SEE-zoo deh ah-ZHOO-dah', note: 'Urgent assistance' },
      { pt: 'Quanto custa?', en: 'How much does it cost?', phonetic: 'KWAHN-too KOOSH-tah?', note: 'Price query' },
      { pt: 'Aberto', en: 'Open', phonetic: 'ah-BAIR-too', note: 'Store hours' }
    ]
  },
  unit4: {
    id: 'unit4',
    title: 'Unit 4: Daily Life & Home Routines',
    desc: 'Talk about your day, time, home items, and everyday tasks.',
    color: '#ffcc00',
    iconName: 'Home',
    words: [
      { pt: 'Casa', en: 'House / Home', phonetic: 'KAH-zah', note: 'Your living space' },
      { pt: 'Quarto', en: 'Bedroom', phonetic: 'KWAHR-too', note: 'Resting space' },
      { pt: 'Cama', en: 'Bed', phonetic: 'KAH-mah', note: 'Sleeping furniture' },
      { pt: 'Cozinha', en: 'Kitchen', phonetic: 'koo-ZEE-nyah', note: 'Cooking area' },
      { pt: 'Mesa', en: 'Table', phonetic: 'MAY-zah', note: 'Dining or desk' },
      { pt: 'Cadeira', en: 'Chair', phonetic: 'kah-DAY-rah', note: 'Seating' },
      { pt: 'Janela', en: 'Window', phonetic: 'zhah-NEH-lah', note: 'Opening' },
      { pt: 'Porta', en: 'Door', phonetic: 'POR-tah', note: 'Entryway' },
      { pt: 'Livro', en: 'Book', phonetic: 'LEEV-roo', note: 'Reading material' },
      { pt: 'Carro', en: 'Car', phonetic: 'KAH-roo', note: 'Automobile' },
      { pt: 'Telefone', en: 'Phone', phonetic: 'teh-leh-FOH-neh', note: 'Mobile device' },
      { pt: 'Computador', en: 'Computer', phonetic: 'kohm-poo-tah-DOR', note: 'Work device' },
      { pt: 'Trabalho', en: 'Work / Job', phonetic: 'trah-BAHL-yoo', note: 'Career or daily tasks' },
      { pt: 'Hoje', en: 'Today', phonetic: 'OH-zheh', note: 'Current day' },
      { pt: 'Amanhã', en: 'Tomorrow', phonetic: 'ah-mah-NYAH', note: 'Next day' },
      { pt: 'Ontem', en: 'Yesterday', phonetic: 'OHN-tehm', note: 'Previous day' },
      { pt: 'Semana', en: 'Week', phonetic: 'seh-MAH-nah', note: '7-day period' },
      { pt: 'Mês', en: 'Month', phonetic: 'maysh', note: '30-day period' },
      { pt: 'Ano', en: 'Year', phonetic: 'AH-noo', note: 'Calendar year' },
      { pt: 'Sempre', en: 'Always', phonetic: 'SEHM-preh', note: 'Consistency' },
      { pt: 'Nunca', en: 'Never', phonetic: 'NOON-kah', note: 'Negation' },
      { pt: 'Agora', en: 'Now', phonetic: 'ah-GOH-rah', note: 'Immediate moment' },
      { pt: 'Manhã', en: 'Morning', phonetic: 'mah-NYAH', note: 'Start of day' },
      { pt: 'Noite', en: 'Night', phonetic: 'NOY-teh', note: 'End of day' }
    ]
  },
  unit5: {
    id: 'unit5',
    title: 'Unit 5: Shopping, Fashion & Clothing',
    desc: 'Shop for outfits, describe styles, and buy new clothes for Sujan in the store!',
    color: '#ff3b30',
    iconName: 'ShoppingBag',
    words: [
      { pt: 'Loja', en: 'Store / Shop', phonetic: 'LOH-zhah', note: 'Retail location' },
      { pt: 'Comprar', en: 'To buy', phonetic: 'kohm-PRAHR', note: 'Action of purchase' },
      { pt: 'Roupa', en: 'Clothes', phonetic: 'RHO-pah', note: 'Apparel' },
      { pt: 'Camisa', en: 'Shirt', phonetic: 'kah-MEE-zah', note: 'Top apparel' },
      { pt: 'Calças', en: 'Pants / Trousers', phonetic: 'KAHL-sahs', note: 'Bottom apparel' },
      { pt: 'Sapatos', en: 'Shoes', phonetic: 'sah-PAH-toosh', note: 'Footwear' },
      { pt: 'Casaco', en: 'Jacket / Coat', phonetic: 'kah-ZAH-koo', note: 'Outerwear' },
      { pt: 'Vestido', en: 'Dress', phonetic: 'vesh-TEE-doo', note: 'One-piece garment' },
      { pt: 'Saia', en: 'Skirt', phonetic: 'SAY-ah', note: 'Garment' },
      { pt: 'Tamanho', en: 'Size', phonetic: 'tah-MAHN-yoo', note: 'S, M, L' },
      { pt: 'Pequeno', en: 'Small', phonetic: 'peh-KAY-noo', note: 'Size S' },
      { pt: 'Médio', en: 'Medium', phonetic: 'MEH-dyoo', note: 'Size M' },
      { pt: 'Grande', en: 'Large', phonetic: 'GRAHN-deh', note: 'Size L' },
      { pt: 'Cor', en: 'Color', phonetic: 'kor', note: 'Visual shade' },
      { pt: 'Branco', en: 'White', phonetic: 'BRAHN-koo', note: 'Light color' },
      { pt: 'Preto', en: 'Black', phonetic: 'PRAY-too', note: 'Dark color' },
      { pt: 'Vermelho', en: 'Red', phonetic: 'vair-MEHL-yoo', note: 'Vibrant color' },
      { pt: 'Azul', en: 'Blue', phonetic: 'ah-ZOOL', note: 'Ocean color' },
      { pt: 'Verde', en: 'Green', phonetic: 'VAIR-deh', note: 'Nature color' },
      { pt: 'Amarelo', en: 'Yellow', phonetic: 'ah-mah-REH-loo', note: 'Sun color' },
      { pt: 'Caro', en: 'Expensive', phonetic: 'KAH-roo', note: 'High cost' },
      { pt: 'Barato', en: 'Cheap', phonetic: 'bah-RAH-too', note: 'Low cost' },
      { pt: 'Dinheiro', en: 'Cash', phonetic: 'dee-NYAY-roo', note: 'Physical money' },
      { pt: 'Cartão', en: 'Card (Credit/Debit)', phonetic: 'kahr-TOWNG', note: 'Payment method' }
    ]
  },
  unit6: {
    id: 'unit6',
    title: 'Unit 6: Feelings, Moods & Expressions',
    desc: 'Express your feelings, emotions, and how much you care about those you love.',
    color: '#b250ff',
    iconName: 'Heart',
    words: [
      { pt: 'Feliz', en: 'Happy', phonetic: 'feh-LEEZ', note: 'Positive mood' },
      { pt: 'Triste', en: 'Sad', phonetic: 'TREES-teh', note: 'Down mood' },
      { pt: 'Cansada', en: 'Tired (female)', phonetic: 'kahn-SAH-dah', note: 'Physical fatigue' },
      { pt: 'Doente', en: 'Sick', phonetic: 'doo-EHN-teh', note: 'Unwell' },
      { pt: 'Zangada', en: 'Angry (female)', phonetic: 'zahn-GAH-dah', note: 'Annoyed' },
      { pt: 'Nervosa', en: 'Nervous (female)', phonetic: 'nair-VOH-zah', note: 'Anxious' },
      { pt: 'Surpresa', en: 'Surprised (female)', phonetic: 'soor-PRAY-zah', note: 'Amazed' },
      { pt: 'Calma', en: 'Calm', phonetic: 'KAHL-mah', note: 'Peaceful' },
      { pt: 'Preocupada', en: 'Worried (female)', phonetic: 'pray-oh-koo-PAH-dah', note: 'Concerned' },
      { pt: 'Orgulhosa', en: 'Proud (female)', phonetic: 'or-gool-YOH-zah', note: 'Pride in achievement' },
      { pt: 'Contente', en: 'Glad', phonetic: 'kohn-TEHN-teh', note: 'Pleased' },
      { pt: 'Chateada', en: 'Upset (female)', phonetic: 'shah-tee-AH-dah', note: 'Bothered' },
      { pt: 'Assustada', en: 'Scared (female)', phonetic: 'ah-soosh-TAH-dah', note: 'Frightened' },
      { pt: 'Animada', en: 'Excited (female)', phonetic: 'ah-nee-MAH-dah', note: 'Hyped' },
      { pt: 'Entediada', en: 'Bored (female)', phonetic: 'ehn-teh-dee-AH-dah', note: 'Unamused' },
      { pt: 'Curiosa', en: 'Curious (female)', phonetic: 'koo-ree-OH-zah', note: 'Inquisitive' },
      { pt: 'Chorar', en: 'To cry', phonetic: 'shoo-RAHR', note: 'Emotional release' },
      { pt: 'Rir', en: 'To laugh', phonetic: 'reer', note: 'Joyful reaction' },
      { pt: 'Sorrir', en: 'To smile', phonetic: 'soo-REER', note: 'Warm expression' },
      { pt: 'Sentir', en: 'To feel', phonetic: 'sehn-TEER', note: 'Emotion perception' },
      { pt: 'Pensar', en: 'To think', phonetic: 'pehn-SAHR', note: 'Mental thought' },
      { pt: 'Esperar', en: 'To hope / wait', phonetic: 'esh-peh-RAHR', note: 'Anticipation' },
      { pt: 'Gostar', en: 'To like', phonetic: 'goosh-TAHR', note: 'Affection' },
      { pt: 'Amar', en: 'To love', phonetic: 'ah-MAHR', note: 'Deep love' }
    ]
  },
  unit7: {
    id: 'unit7',
    title: 'Unit 7: Daily Love Language for Sujan 💕',
    desc: 'Special romantic phrases for Sujan! Complete lessons here for DOUBLE Coins & XP!',
    color: '#ff2d55',
    iconName: 'Sparkles',
    words: [
      { pt: 'Já acordaste?', en: 'Are you awake?', phonetic: 'zhah ah-kor-DASH-teh?', note: 'Sweet morning text' },
      { pt: 'Dormiste bem?', en: 'Did you sleep well?', phonetic: 'dor-MEES-teh behm?', note: 'Caring question' },
      { pt: 'Bom dia, meu amor', en: 'Good morning my love', phonetic: 'boh DEE-ah may-oo ah-MOR', note: 'Start his day with love' },
      { pt: 'Sinto a tua falta', en: 'I miss you', phonetic: 'SEEN-too ah TOO-ah FAHL-tah', note: 'Classic European PT "I miss you"' },
      { pt: 'Estou com saudades tuas', en: 'I am missing you so much', phonetic: 'esh-TOO kohm sow-DAH-desh TOO-ahs', note: 'Deep Portuguese longing' },
      { pt: 'Liga-me', en: 'Call me', phonetic: 'LEE-gah-meh', note: 'Ask for a call' },
      { pt: 'Mal posso esperar', en: 'I can’t wait to see you', phonetic: 'mahl POH-soo esh-peh-RAHR', note: 'Excitement' },
      { pt: 'Estou a pensar em ti', en: 'I am thinking of you', phonetic: 'esh-TOO ah pehn-SAHR ehm tee', note: 'Sweet reminder' },
      { pt: 'Como foi o teu dia?', en: 'How was your day?', phonetic: 'KOH-moo foy oo tay-oo DEE-ah?', note: 'Evening check-in' },
      { pt: 'Descansa bem', en: 'Rest well', phonetic: 'desh-KAHN-sah behm', note: 'Night blessing' },
      { pt: 'Boa noite, querido', en: 'Good night darling', phonetic: 'BOH-ah NOY-teh keh-REE-doo', note: 'Sweet dreams text' },
      { pt: 'Estou orgulhosa de ti', en: 'I am proud of you (female)', phonetic: 'esh-TOO or-gool-YOH-zah deh tee', note: 'Encouraging Sujan' },
      { pt: 'Queria estar aí contigo', en: 'I wish I was there with you', phonetic: 'keh-REE-ah esh-TAHR eye kohn-TEE-goo', note: 'LDR romantic wish' },
      { pt: 'Faz-me rir', en: 'You make me laugh', phonetic: 'fahz-meh reer', note: 'Praising his humor' },
      { pt: 'Tens tempo para falar?', en: 'Do you have time to talk?', phonetic: 'tehnsh TEHM-poo pah-rah fah-LAHR?', note: 'Checking availability' },
      { pt: 'Manda foto', en: 'Send a photo', phonetic: 'MAHN-dah FOH-too', note: 'Playful request' },
      { pt: 'Adoro-te', en: 'I adore you', phonetic: 'ah-DOH-roo-teh', note: 'Deep affection' },
      { pt: 'Toma cuidado', en: 'Take care', phonetic: 'TOH-mah kwee-DAH-doo', note: 'Warm safety wish' },
      { pt: 'Estou sempre contigo', en: 'I am always with you', phonetic: 'esh-TOO SEHM-preh kohn-TEE-goo', note: 'Unconditional bond' },
      { pt: 'És o meu príncipe', en: 'You are my prince', phonetic: 'ehsh oo may-oo PREEN-see-peh', note: 'Cute nickname' },
      { pt: 'És o melhor namorado', en: 'You are the best boyfriend', phonetic: 'ehsh oo mehl-YOR nah-moo-RAH-doo', note: 'Best compliment' },
      { pt: 'Faz-me tão feliz', en: 'You make me so happy', phonetic: 'fahz-meh towng feh-LEEZ', note: 'Heartfelt note' },
      { pt: 'Sonhei contigo', en: 'I dreamed of you', phonetic: 'sohn-YAY kohn-TEE-goo', note: 'Sweet dream' },
      { pt: 'És tudo para mim', en: 'You are everything to me', phonetic: 'ehsh TOO-doo pah-rah meem', note: 'Ultimate love phrase' }
    ]
  }
};

export const ALL_WORDS_FLAT: VocabWord[] = Object.values(UNITS_DATA).flatMap((u) => u.words);

export const WORDS_OF_THE_DAY: VocabWord[] = [
  { pt: 'Saudades', en: 'Longing / Deeply missing someone', phonetic: 'sow-DAH-desh', note: 'Portugal’s most beautiful untranslatable word!' },
  { pt: 'Fado', en: 'Fate / Soulful Portuguese music', phonetic: 'FAH-doo', note: 'The musical heart of Lisbon' },
  { pt: 'Calmamente', en: 'Calmly / Peacefully', phonetic: 'kahl-mah-MEHN-teh', note: 'Take learning step by step' },
  { pt: 'Carinho', en: 'Tenderness / Affection', phonetic: 'kah-REEN-yoo', note: 'Love and warmth' },
  { pt: 'Achei-te', en: 'I found you', phonetic: 'ah-SHAY-teh', note: 'Romantic expression' },
  { pt: 'Luz', en: 'Light', phonetic: 'loosh', note: 'The golden light of Lisbon' }
];

export const CULTURE_ARTICLES = [
  {
    id: 'accent',
    title: 'The European Portuguese Accent Guide',
    icon: 'Volume2',
    content: `
      ### The Lisbon "Shush" & Soft Vowels
      European Portuguese (pt-PT) sounds distinct from Brazilian Portuguese. It is famously rhythmic and "shushy", often compared to Slavic cadence because vowels are held softly!
      
      #### Key Pronunciation Rules:
      1. **S at the end of a word = "SH"**:
         * *Os pastéis* is pronounced *Oozh pash-taysh*.
         * *Boas noites* is pronounced *BOH-ash NOY-tesh*.
      2. **R at the start of a word = guttural "H"**:
         * *Rua* sounds like *HOO-ah*.
         * *Roupa* sounds like *RHO-pah*.
      3. **LH and NH**:
         * **LH** sounds like "million" (*Filho* = FEE-lyoo).
         * **NH** sounds like "onion" (*Cozinha* = koo-ZEE-nyah).
      4. **Nasal Vowels (Ã, Õ, ÃES, ÃO)**:
         * *Pão* (bread) uses a nasal sound like saying "ow" through your nose!
    `
  },
  {
    id: 'grammar',
    title: 'Grammar Cheat Sheet for Girls Learning pt-PT',
    icon: 'BookOpen',
    content: `
      ### 1. Gender Agreement (Female Speaker)
      Because you are a woman speaking, adjectives that describe **you** always end in **-a**:
      * **Obrigada!** (*Thank you!* — Men say *Obrigado*, women say *Obrigada*).
      * **Estou cansada.** (*I am tired.*)
      * **Estou orgulhosa do Sujan!** (*I am proud of Sujan!*)

      ### 2. "Ser" vs. "Estar" (To Be)
      Portuguese has two verbs for "to be":
      * **SER** = Permanent identity or origin (*Eu sou bonita* - I am beautiful).
      * **ESTAR** = Temporary state or location (*Estou com fome* - I am hungry right now).

      ### 3. "Tu" vs. "Você"
      In Portugal, always use **Tu** when talking affectionately to Sujan, friends, and family! (*Como estás, Sujan?*)
    `
  },
  {
    id: 'history',
    title: 'Language History & Portuguese Influence',
    icon: 'Globe',
    content: `
      ### From Vulgar Latin to Global Oceans
      Portuguese evolved from Vulgar Latin introduced by Roman legions in the Iberian Peninsula around 218 BC.
      
      When Arab Moors arrived in 711 AD, over 800 Arabic words enriched the language—especially words starting with "Al-" (like *Algodão* / cotton, *Alfazema* / lavender).
      
      During the Age of Discovery in the 1500s, Portuguese navigators sailed across Asia, Africa, and the Americas. Today over 260 million people speak Portuguese worldwide!
    `
  },
  {
    id: 'tongue',
    title: 'Trava-Línguas (Portuguese Tongue Twisters)',
    icon: 'Smile',
    content: `
      ### Practice Your Speech Cadence!
      Tap the phrases to test your pronunciation:
      
      1. **"O rato roeu a rolha da garrafa do rei da Rússia."**
         *(The mouse gnawed the cork of the King of Russia's bottle.)*
      2. **"Três pratos de trigo para três tigres tristes."**
         *(Three plates of wheat for three sad tigers.)*
      3. **"A aranha arranha a rã. A rã arranha a aranha."**
         *(The spider scratches the frog. The frog scratches the spider.)*
    `
  }
];
