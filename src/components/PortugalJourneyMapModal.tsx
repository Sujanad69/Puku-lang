import React, { useState } from 'react';
import { 
  X, MapPin, Volume2, Sparkles, Compass, CheckCircle2, 
  ChevronRight, Award, Footprints, Heart, Camera, Coffee, 
  HelpCircle, RotateCcw
} from 'lucide-react';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export interface LandmarkStop {
  id: string;
  region: 'lisbon' | 'porto';
  name: string;
  ptName: string;
  pronunciation: string;
  tagline: string;
  coords: { x: number; y: number };
  description: string;
  coupleTip: string;
  imageIcon: string;
  accentColor: string;
  badgeEmoji: string;
  phrases: {
    pt: string;
    en: string;
    nepali: string;
    phonetic: string;
  }[];
  challenge: {
    question: string;
    ptPrompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const LANDMARK_STOPS: LandmarkStop[] = [
  // LISBON REGION
  {
    id: 'baixa-chiado',
    region: 'lisbon',
    name: 'Baixa-Chiado & Praça do Comércio',
    ptName: 'Praça do Comércio e Chiado',
    pronunciation: 'PRAH-sah doo koo-MEHR-see-oo ee SHEE-ah-doo',
    tagline: 'The Grand Riverfront Gate & Historic Cafés',
    coords: { x: 28, y: 78 },
    description: 'Lisbon’s majestic yellow square opening right onto the blue Tagus River. Stroll up into Chiado for bookshops and pastelarias.',
    coupleTip: 'Grab two bicas at A Brasileira and take a romantic photo under the triumphal Arco da Rua Augusta!',
    imageIcon: '🏛️',
    accentColor: '#0a84ff',
    badgeEmoji: '🌊',
    phrases: [
      { pt: "Vamos encontrar-nos no Rossio?", en: "Shall we meet at Rossio?", nepali: "हामी रोसिओमा भेट्ने हो?", phonetic: "VAH-moosh eng-kohn-TRAR-noosh noo roo-SEE-oo" },
      { pt: "Uma bica e um pastel de nata, por favor.", en: "An espresso and a custard tart, please.", nepali: "एक कप कफी र एउटा पेस्ट्री दिनुहोस्।", phonetic: "OO-mah BEE-kah ee oong pash-TEL deh NAH-tah" },
      { pt: "Esta praça é linda!", en: "This square is beautiful!", nepali: "यो चोक धेरै सुन्दर छ!", phonetic: "ESH-tah PRAH-sah eh LEEN-dah" }
    ],
    challenge: {
      question: 'How do you ask for an espresso in a historic Lisbon café?',
      ptPrompt: 'Uma _____ , se faz favor.',
      options: ['bica', 'água', 'cerveja', 'mesa'],
      correctIndex: 0,
      explanation: 'In Lisbon, an espresso is traditionally called "uma bica" (originally an acronym for Beba Isto Com Açúcar).'
    }
  },
  {
    id: 'alfama',
    region: 'lisbon',
    name: 'Alfama & Castelo de São Jorge',
    ptName: 'Bairro de Alfama e Castelo',
    pronunciation: 'BY-rroo deh ahl-FAH-mah ee kash-TEH-loo',
    tagline: 'Soulful Fado Alleyways & Castle Panoramic Sunset',
    coords: { x: 38, y: 72 },
    description: 'Lisbon’s oldest quarter with winding cobblestone streets, blooming bougainvillea, sardine grills, and melancholic Fado melodies.',
    coupleTip: 'Head to Miradouro de Santa Luzia at sunset to listen to acoustic Portuguese guitar together.',
    imageIcon: '🏰',
    accentColor: '#bf5af2',
    badgeEmoji: '🎶',
    phrases: [
      { pt: "Onde podemos ouvir Fado?", en: "Where can we listen to Fado?", nepali: "हामी फादो संगीत कहाँ सुन्न सक्छौँ?", phonetic: "OHND poo-DEH-moosh oh-VEER FAH-doo" },
      { pt: "Que vista maravilhosa da cidade!", en: "What a marvelous view of the city!", nepali: "सहरको कस्तो अचम्मको दृश्य!", phonetic: "keh VEESH-tah mah-rah-vee-LYOH-zah dah see-DAH-deh" },
      { pt: "Vamos subir a pé?", en: "Shall we walk up?", nepali: "के हामी हिँडेर उकालो जाने?", phonetic: "VAH-moosh soo-BEER ah PEH" }
    ],
    challenge: {
      question: 'What is the soulful, traditional Portuguese music genre born in Alfama called?',
      ptPrompt: 'A música tradicional portuguesa chama-se _____ .',
      options: ['Fado', 'Samba', 'Tango', 'Flamenco'],
      correctIndex: 0,
      explanation: 'Fado is Portugal’s UNESCO-recognized musical tradition, filled with "saudade" and acoustic Portuguese 12-string guitars.'
    }
  },
  {
    id: 'belem',
    region: 'lisbon',
    name: 'Belém & Mosteiro dos Jerónimos',
    ptName: 'Torre de Belém e Pastéis',
    pronunciation: 'TOH-rreh deh beh-LAYNG ee pash-TEYSH',
    tagline: 'Age of Discovery, Sea Tower & Warm Cinnamon Tarts',
    coords: { x: 18, y: 82 },
    description: 'The monumental waterfront where Portuguese navigators set sail. Home to the original 1837 bakery serving hot Pastéis de Belém.',
    coupleTip: 'Sprinkle powdered cinnamon on your hot pastel and share a riverside stroll to the Belém Tower.',
    imageIcon: '🗼',
    accentColor: '#ff9f0a',
    badgeEmoji: '🥐',
    phrases: [
      { pt: "Queria uma caixa de seis pastéis.", en: "I would like a box of six pastries.", nepali: "मलाई ६ वटा पेस्ट्रीको बक्स दिनुहोस्।", phonetic: "KREE-ah OO-mah KY-shah deh saysh pash-TEYSH" },
      { pt: "Com canela e açúcar em pó, por favor.", en: "With cinnamon and powdered sugar, please.", nepali: "दालचिनी र चिनीको धुलोसहित, कृपया।", phonetic: "kong kah-NEH-lah ee ah-SOO-kar eng POH" },
      { pt: "A Torre de Belém é imponente.", en: "The Belém Tower is magnificent.", nepali: "बेलेम टावर भव्य छ।", phonetic: "ah TOH-rreh deh beh-LAYNG eh eem-poo-NEN-teh" }
    ],
    challenge: {
      question: 'What traditional spice do locals always sprinkle on warm Pastéis de Belém?',
      ptPrompt: 'Pastéis de nata com _____ (cinnamon).',
      options: ['canela', 'sal', 'pimenta', 'azeite'],
      correctIndex: 0,
      explanation: '"Canela" means cinnamon — the essential topping for Lisbon pastries!'
    }
  },
  {
    id: 'sintra',
    region: 'lisbon',
    name: 'Sintra & Palácio da Pena',
    ptName: 'Vila Romântica de Sintra',
    pronunciation: 'VEE-lah rroo-MAHN-tee-kah deh SEEN-trah',
    tagline: 'Fairytale Mountains, Mist & Vivid Castles',
    coords: { x: 12, y: 64 },
    description: 'A magical mountain oasis wrapped in mist, lush exotic forests, and the vibrant yellow-and-red Pena Palace atop the peaks.',
    coupleTip: 'Sujan and Amisha will love getting lost in the mossy gardens of Quinta da Regaleira and tasting sweet Sintra Travesseiros pastries!',
    imageIcon: '✨',
    accentColor: '#ff375f',
    badgeEmoji: '👑',
    phrases: [
      { pt: "Parece um conto de fadas!", en: "It feels like a fairytale!", nepali: "यो परी कथा जस्तो लाग्छ!", phonetic: "pah-REH-seh oong KOHN-too deh FAH-dash" },
      { pt: "Dois bilhetes para o palácio, por favor.", en: "Two tickets for the palace, please.", nepali: "दरबारको लागि दुईवटा टिकट, कृपया।", phonetic: "DOYSH bee-LYEH-tesh PAH-rah oo pah-LAH-see-oo" },
      { pt: "O clima aqui é muito fresco.", en: "The weather here is very fresh and cool.", nepali: "यहाँको मौसम धेरै शीतल छ।", phonetic: "oo KLEE-mah ah-KEE eh MWIN-too FRESH-koo" }
    ],
    challenge: {
      question: 'How do you say "fairytale" in Portuguese when describing Sintra?',
      ptPrompt: 'Um conto de _____ .',
      options: ['fadas', 'comboios', 'cidades', 'pontes'],
      correctIndex: 0,
      explanation: '"Conto de fadas" means fairytale, the most famous descriptor for romantic Sintra.'
    }
  },
  {
    id: 'cascais',
    region: 'lisbon',
    name: 'Cascais & Boca do Inferno',
    ptName: 'Cascais e Costa do Atlântico',
    pronunciation: 'kash-KYSH ee KOHSH-tah doo aht-LAHN-tee-koo',
    tagline: 'Golden Coast, Sandy Coves & Ocean Breeze',
    coords: { x: 16, y: 74 },
    description: 'Charming seaside town with golden beaches, marina yachts, and dramatic ocean cliffs crashing against the Atlantic.',
    coupleTip: 'Rent beach cruiser bikes and ride together down the coastal avenue all the way to Guincho Beach.',
    imageIcon: '🏖️',
    accentColor: '#30b0c7',
    badgeEmoji: '🌊',
    phrases: [
      { pt: "A água está boa para nadar?", en: "Is the water good for swimming?", nepali: "पानी पौडी खेल्न राम्रो छ?", phonetic: "ah AH-gwah sh-TAH BOH-ah PAH-rah nah-DAR" },
      { pt: "Vamos passear junto ao mar?", en: "Shall we walk along the sea?", nepali: "के हामी समुद्र किनारमा हिँड्ने?", phonetic: "VAH-moosh pah-see-AR ZHOON-too ow MAR" },
      { pt: "O peixe grelhado está fresquíssimo.", en: "The grilled fish is extremely fresh.", nepali: "पोलेको माछा एकदम ताजा छ।", phonetic: "oo PAY-sheh greh-LYAH-doo sh-TAH fresh-KEE-see-moo" }
    ],
    challenge: {
      question: 'How do you say "the sea" in Portuguese?',
      ptPrompt: 'Vamos ver o _____ (the sea).',
      options: ['mar', 'rio', 'céu', 'sol'],
      correctIndex: 0,
      explanation: '"O mar" is the sea in Portuguese.'
    }
  },

  // PORTO REGION
  {
    id: 'ribeira-douro',
    region: 'porto',
    name: 'Ribeira & Ponte Dom Luís I',
    ptName: 'Ribeira do Porto e Rio Douro',
    pronunciation: 'rree-BAY-rah doo POOR-too ee REE-oo DOH-roo',
    tagline: 'Double-Deck Iron Bridge, Colorful Houses & River Boats',
    coords: { x: 65, y: 26 },
    description: 'The UNESCO heart of Porto with postcard pastel riverside townhouses, the majestic iron bridge designed by Eiffel’s partner, and Rabelo wine boats.',
    coupleTip: 'Cross the upper pedestrian deck of Dom Luís Bridge at dusk for one of Europe’s most breathtaking romantic city views!',
    imageIcon: '🌉',
    accentColor: '#0a84ff',
    badgeEmoji: '⛵',
    phrases: [
      { pt: "Vamos atravessar a ponte a pé?", en: "Shall we cross the bridge on foot?", nepali: "हामी हिँडेर पुल तर्ने हो?", phonetic: "VAH-moosh ah-trah-veh-SAR ah POHN-teh ah PEH" },
      { pt: "O Douro ao pôr do sol é mágico.", en: "The Douro at sunset is magical.", nepali: "सूर्यास्तमा डोउरो नदी जादुमय हुन्छ।", phonetic: "oo DOH-roo ow POOR doo SAWL eh MAH-zhee-koo" },
      { pt: "Uma francesinha para partilhar, se faz favor.", en: "A Francesinha to share, please.", nepali: "एउटा फ्रान्सेजिन्हा बाँडेर खान दिनुहोस्।", phonetic: "OO-mah frahn-seh-ZEE-nyah PAH-rah par-tee-LYAR" }
    ],
    challenge: {
      question: 'What is Porto’s famous decadent layered sandwich with cheese and spiced beer sauce?',
      ptPrompt: 'O prato mais famoso do Porto é a _____ .',
      options: ['Francesinha', 'Bacalhau', 'Caldo Verde', 'Bitoque'],
      correctIndex: 0,
      explanation: 'The Francesinha is Porto’s legendary sandwich stuffed with meats and drenched in warm melted cheese & beer sauce.'
    }
  },
  {
    id: 'sao-bento',
    region: 'porto',
    name: 'São Bento Railway Station',
    ptName: 'Estação de São Bento',
    pronunciation: 'sh-tah-SOWNG deh sowng BEN-too',
    tagline: '20,000 Blue Azulejo Tiles Telling Portugal’s History',
    coords: { x: 74, y: 24 },
    description: 'Often called the most gorgeous train station on earth. Its soaring main hall is lined with 20,000 hand-painted blue ceramic Azulejos.',
    coupleTip: 'Look up together to spot the historical royal wedding of King João I depicted in shimmering blue tiles.',
    imageIcon: '🎨',
    accentColor: '#5856d6',
    badgeEmoji: '🟦',
    phrases: [
      { pt: "Estes azulejos são impressionantes.", en: "These ceramic tiles are breathtaking.", nepali: "यी टाइलहरू धेरै मनमोहक छन्।", phonetic: "ESH-tesh ah-zoo-LAY-zhoosh sowng eem-preh-see-oo-NAHN-tesh" },
      { pt: "A que horas parte o próximo comboio?", en: "What time does the next train depart?", nepali: "अर्को रेल कति बजे छुट्छ?", phonetic: "ah keh OH-rash PAR-teh oo PRAW-see-moo kom-BOY-oo" },
      { pt: "Isto é uma verdadeira obra de arte!", en: "This is a true work of art!", nepali: "यो साँच्चिकै कलाको उत्कृष्ट नमुना हो!", phonetic: "EESH-too eh OO-mah ver-dah-DAY-rah OH-brah deh AR-teh" }
    ],
    challenge: {
      question: 'What are the iconic blue and white glazed ceramic tiles in Portugal called?',
      ptPrompt: 'Os painéis de cerâmica azul chamam-se _____ .',
      options: ['azulejos', 'madeiras', 'tijolos', 'vidros'],
      correctIndex: 0,
      explanation: '"Azulejos" are Portugal’s celebrated ceramic tiles decorating stations, churches, and houses.'
    }
  },
  {
    id: 'livraria-lello',
    region: 'porto',
    name: 'Livraria Lello & Clérigos Tower',
    ptName: 'Livraria Lello e Torre dos Clérigos',
    pronunciation: 'leev-rah-REE-ah LEH-loo ee TOH-rreh doosh KLEH-ree-goosh',
    tagline: 'Gothic Crimson Staircase & City Bell Tower',
    coords: { x: 70, y: 18 },
    description: 'One of the world’s most magical bookstores with a swirling crimson staircase and stained glass ceiling, next to Porto’s iconic baroque tower.',
    coupleTip: 'Pick out a Portuguese poetry book by Fernando Pessoa as a memento of your trip together.',
    imageIcon: '📚',
    accentColor: '#ff453a',
    badgeEmoji: '📖',
    phrases: [
      { pt: "Adoro o cheiro dos livros antigos.", en: "I love the smell of old books.", nepali: "मलाई पुराना किताबहरूको सुगन्ध मनपर्छ।", phonetic: "ah-DOH-roo oo SHAY-roo doosh LEE-vroosh ahn-TEE-goosh" },
      { pt: "Podemos subir à torre?", en: "Can we climb up the tower?", nepali: "के हामी टावरमाथि चढ्न सक्छौँ?", phonetic: "poo-DEH-moosh soo-BEER ah TOH-rreh" },
      { pt: "A escadaria vermelha é incrível!", en: "The red staircase is incredible!", nepali: "रातो सिँढी अविश्वसनीय छ!", phonetic: "ah sh-kah-dah-REE-ah ver-MEH-lyah eh eeng-KREE-vel" }
    ],
    challenge: {
      question: 'How do you say "book" and "bookstore" in Portuguese?',
      ptPrompt: 'Um _____ (book) na livraria.',
      options: ['livro', 'caderno', 'lápis', 'carta'],
      correctIndex: 0,
      explanation: '"Livro" means book in Portuguese!'
    }
  },
  {
    id: 'fado-porto',
    region: 'porto',
    name: 'Foz do Douro & Ocean Promenades',
    ptName: 'Foz do Douro e Farol',
    pronunciation: 'FAWZ doo DOH-roo ee fah-RAWL',
    tagline: 'Where the River Meets the Atlantic & Ocean Sunset',
    coords: { x: 55, y: 32 },
    description: 'The romantic coastline where the calm Douro River merges into the roaring Atlantic ocean, lined with palm trees and oceanfront pergolas.',
    coupleTip: 'Walk hand-in-hand to Felgueiras Lighthouse to feel the fresh ocean mist together.',
    imageIcon: '🌊',
    accentColor: '#0a84ff',
    badgeEmoji: '💡',
    phrases: [
      { pt: "O vento do oceano é revigorante.", en: "The ocean wind is invigorating.", nepali: "समुद्रको हावा ताजगी दिने छ।", phonetic: "oo VEN-too doo oh-seh-AH-noo eh rreh-vee-goo-RAHN-teh" },
      { pt: "Vamos ver o farol ao longe.", en: "Let's see the lighthouse in the distance.", nepali: "पर रहेको लाइटहाउस हेरौँ।", phonetic: "VAH-moosh VEHR oo fah-RAWL ow LOHN-zheh" },
      { pt: "Um copo de Vinho do Porto, por favor.", en: "A glass of Port Wine, please.", nepali: "एक गिलास पोर्ट वाइन, कृपया।", phonetic: "oong KAW-poo deh VEE-nyoo doo POOR-too por fah-VOR" }
    ],
    challenge: {
      question: 'What is the world-famous fortified sweet wine produced exclusively in the Douro Valley called?',
      ptPrompt: 'O famoso vinho doce de Portugal é o Vinho do _____ .',
      options: ['Porto', 'Lisboa', 'Sintra', 'Algarve'],
      correctIndex: 0,
      explanation: '"Vinho do Porto" (Port Wine) has been aged and shipped from Porto’s riverbanks since the 17th century!'
    }
  }
];

interface PortugalJourneyMapModalProps {
  onClose: () => void;
  onReward?: (xp: number, coins: number) => void;
}

export const PortugalJourneyMapModal: React.FC<PortugalJourneyMapModalProps> = ({
  onClose,
  onReward
}) => {
  const [selectedStopId, setSelectedStopId] = useState<string>('baixa-chiado');
  const [activeRegion, setActiveRegion] = useState<'all' | 'lisbon' | 'porto'>('all');
  const [slowAudio, setSlowAudio] = useState(false);
  const [visitedStamps, setVisitedStamps] = useState<string[]>(['baixa-chiado']);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [playingPhraseIndex, setPlayingPhraseIndex] = useState<number | null>(null);

  const currentStop = LANDMARK_STOPS.find(s => s.id === selectedStopId) || LANDMARK_STOPS[0];

  const handleSelectStop = (stop: LandmarkStop) => {
    playTone(550, 'sine', 0.04);
    triggerHaptic('light');
    setSelectedStopId(stop.id);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (!visitedStamps.includes(stop.id)) {
      setVisitedStamps(prev => [...prev, stop.id]);
    }
  };

  const handlePlayVoice = (text: string, index?: number) => {
    if (index !== undefined) setPlayingPhraseIndex(index);
    playTone(600, 'sine', 0.04);
    triggerHaptic('light');
    speakPt(text, slowAudio);
    if (index !== undefined) {
      setTimeout(() => setPlayingPhraseIndex(null), 2200);
    }
  };

  const handleCheckChallenge = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === currentStop.challenge.correctIndex;

    if (isCorrect) {
      playTone(880, 'sine', 0.15);
      triggerHaptic('success');
      if (!completedChallenges.includes(currentStop.id)) {
        setCompletedChallenges(prev => [...prev, currentStop.id]);
        if (onReward) {
          onReward(25, 5);
        }
      }
    } else {
      playTone(260, 'sawtooth', 0.2);
      triggerHaptic('error');
    }
  };

  const lisbonStops = LANDMARK_STOPS.filter(s => s.region === 'lisbon');
  const portoStops = LANDMARK_STOPS.filter(s => s.region === 'porto');

  const visibleStops = activeRegion === 'all' 
    ? LANDMARK_STOPS 
    : LANDMARK_STOPS.filter(s => s.region === activeRegion);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-3 sm:p-5 overflow-y-auto ios-fade-in">
      
      {/* Apple HIG Sheet Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[32px] bg-[#1c1c1e] border border-white/10 text-white shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden my-auto">
        
        {/* iOS Pull Handle Bar */}
        <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mt-3 mb-1 shrink-0" />

        {/* ================= TOP HEADER BANNER (Lisbon & Porto Journey) ================= */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-[#0040dd] via-[#0a84ff] to-[#3898ff] border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                <Compass className="w-6 h-6 text-white animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/30 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/15">
                    Bridging Our Worlds 🇵🇹
                  </span>
                  <span className="text-[10px] font-bold text-[#ffd60a] bg-[#ffd60a]/20 px-2.5 py-0.5 rounded-full border border-[#ffd60a]/30">
                    {visitedStamps.length}/{LANDMARK_STOPS.length} Discovered
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 font-['Courier_New',Courier,monospace]">
                  Portugal Interactive Flight Path
                </h2>
              </div>
            </div>

            {/* Apple Close Pill Button */}
            <button
              onClick={() => {
                playTone(400, 'sine', 0.04);
                onClose();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/25 hover:bg-black/45 active:scale-90 transition-all border border-white/20 cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Region Tabs Filter */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/15 relative z-10">
            <button
              onClick={() => {
                playTone(500, 'sine', 0.03);
                setActiveRegion('all');
              }}
              className={`px-4 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                activeRegion === 'all'
                  ? 'bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              🗺️ All Destinations
            </button>

            <button
              onClick={() => {
                playTone(500, 'sine', 0.03);
                setActiveRegion('lisbon');
                if (currentStop.region !== 'lisbon') setSelectedStopId('baixa-chiado');
              }}
              className={`px-4 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                activeRegion === 'lisbon'
                  ? 'bg-[#ffd60a] text-black shadow-[0_4px_12px_rgba(255,214,10,0.3)]'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              🚋 Lisbon & Sintra ({lisbonStops.length})
            </button>

            <button
              onClick={() => {
                playTone(500, 'sine', 0.03);
                setActiveRegion('porto');
                if (currentStop.region !== 'porto') setSelectedStopId('ribeira-douro');
              }}
              className={`px-4 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                activeRegion === 'porto'
                  ? 'bg-[#64d2ff] text-black shadow-[0_4px_12px_rgba(100,210,255,0.3)]'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              🍷 Porto & Douro ({portoStops.length})
            </button>
          </div>
        </div>

        {/* ================= MAIN SCROLLABLE CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Landmark Navigation Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-[#0a84ff]" />
                Select Waypoint to Explore & Listen
              </span>
              <span className="text-[11px] text-[#0a84ff] font-medium">
                Tap pins for local dialogues
              </span>
            </div>

            {/* Horizontal landmark scroll cards */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
              {visibleStops.map((stop) => {
                const isSelected = stop.id === selectedStopId;
                const isCompleted = completedChallenges.includes(stop.id);
                return (
                  <button
                    key={stop.id}
                    onClick={() => handleSelectStop(stop)}
                    className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-[18px] border transition-all cursor-pointer text-left active:scale-95 ${
                      isSelected
                        ? 'bg-[#0a84ff] text-white border-transparent shadow-[0_8px_20px_rgba(10,132,255,0.4)] scale-[1.02]'
                        : 'bg-[#2c2c2e]/70 hover:bg-[#2c2c2e] text-zinc-200 border-white/5'
                    }`}
                  >
                    <div className="text-2xl shrink-0">{stop.imageIcon}</div>
                    <div className="min-w-[120px]">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold truncate max-w-[140px]">{stop.name.split('&')[0]}</span>
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158] shrink-0" />}
                      </div>
                      <p className="text-[10px] opacity-75 font-medium truncate max-w-[140px]">{stop.ptName}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= ACTIVE LANDMARK SPOTLIGHT ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Landmark Details & Romantic Couple Note */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Landmark Header Card */}
              <div className="p-5 rounded-[22px] bg-[#2c2c2e]/60 border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.3)] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentStop.imageIcon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0a84ff] bg-[#0a84ff]/15 px-2.5 py-0.5 rounded-full border border-[#0a84ff]/20">
                        {currentStop.region === 'lisbon' ? 'Lisboa Region' : 'Porto Region'}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                      {currentStop.name}
                    </h3>
                    <p className="text-xs font-mono text-[#64d2ff] mt-0.5">
                      {currentStop.ptName} • /{currentStop.pronunciation}/
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayVoice(currentStop.ptName)}
                    className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#0a84ff] hover:bg-[#007aff] text-white shadow-[0_4px_14px_rgba(10,132,255,0.4)] active:scale-95 transition-all shrink-0 cursor-pointer"
                    title="Listen to Landmark Name"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                  {currentStop.description}
                </p>

                {/* Sujan & Amisha Couple Secret */}
                <div className="p-3.5 rounded-[16px] bg-[#ff375f]/10 border border-[#ff375f]/25 flex items-start gap-3">
                  <Heart className="w-4 h-4 text-[#ff375f] shrink-0 mt-0.5 fill-[#ff375f]/30" />
                  <div className="text-xs text-rose-200">
                    <span className="font-bold text-[#ff375f] block mb-0.5">Sujan & Amisha Trip Moment 💌</span>
                    {currentStop.coupleTip}
                  </div>
                </div>
              </div>

              {/* Landmark Key European Portuguese Dialogues */}
              <div className="p-5 rounded-[22px] bg-[#2c2c2e]/60 border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.3)] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ffd60a]" />
                    Local Phrases for {currentStop.name.split('&')[0]}
                  </h4>

                  <button
                    onClick={() => setSlowAudio(prev => !prev)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-[10px] transition-all cursor-pointer active:scale-95 ${
                      slowAudio ? 'bg-[#ffd60a] text-black' : 'bg-white/10 text-zinc-300 hover:bg-white/15'
                    }`}
                  >
                    {slowAudio ? '🐢 Slow Audio: ON' : '⚡ Audio: Normal'}
                  </button>
                </div>

                <div className="space-y-2">
                  {currentStop.phrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePlayVoice(phrase.pt, idx)}
                      className={`p-3.5 rounded-[16px] border transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.98] ${
                        playingPhraseIndex === idx
                          ? 'bg-[#0a84ff]/25 border-[#0a84ff] shadow-[0_0_15px_rgba(10,132,255,0.3)]'
                          : 'bg-[#1c1c1e]/80 hover:bg-[#1c1c1e] border-white/5'
                      }`}
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">{phrase.pt}</p>
                          <span className="text-[10px] text-[#64d2ff] font-mono hidden sm:inline">/{phrase.phonetic}/</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{phrase.en}</p>
                        <p className="text-[11px] font-semibold text-[#ffd60a] truncate">🇳🇵 {phrase.nepali}</p>
                      </div>

                      <button
                        className="h-8 w-8 rounded-full bg-[#0a84ff]/20 hover:bg-[#0a84ff]/30 text-[#0a84ff] flex items-center justify-center shrink-0"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Landmark Passport Quiz Challenge */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="p-5 rounded-[22px] bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.3)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#ffd60a]" />
                    <h4 className="text-xs sm:text-sm font-bold text-white">Passport Stamp Challenge</h4>
                  </div>
                  <span className="text-[10px] font-bold text-[#30d158] bg-[#30d158]/15 px-2.5 py-0.5 rounded-full border border-[#30d158]/20">
                    +25 XP • +5 🪙
                  </span>
                </div>

                <p className="text-xs text-zinc-300 font-medium">
                  {currentStop.challenge.question}
                </p>

                <div className="p-3 rounded-[14px] bg-black/40 border border-white/10 text-center font-bold text-xs text-[#ffd60a]">
                  "{currentStop.challenge.ptPrompt}"
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {currentStop.challenge.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswer === oIdx;
                    const isCorrect = oIdx === currentStop.challenge.correctIndex;
                    let btnStyle = 'bg-[#1c1c1e] hover:bg-[#2c2c2e] text-zinc-200 border-white/10';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-[#30d158] text-white border-[#30d158] shadow-[0_0_12px_rgba(48,209,88,0.4)]';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-[#ff453a] text-white border-[#ff453a]';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#0a84ff] text-white border-[#0a84ff] shadow-[0_0_12px_rgba(10,132,255,0.4)]';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswerSubmitted}
                        onClick={() => {
                          playTone(500, 'sine', 0.03);
                          setSelectedAnswer(oIdx);
                        }}
                        className={`p-3 rounded-[14px] font-bold text-xs border transition-all cursor-pointer text-center active:scale-95 ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Verification / Action */}
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedAnswer === null}
                    onClick={handleCheckChallenge}
                    className={`w-full py-3 rounded-[16px] font-bold text-xs transition-all cursor-pointer ${
                      selectedAnswer !== null
                        ? 'bg-gradient-to-r from-[#0a84ff] to-[#0066ff] text-white shadow-[0_4px_14px_rgba(10,132,255,0.4)] active:scale-95'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    Verify Answer & Stamp Passport ✨
                  </button>
                ) : (
                  <div className="space-y-2 fade-in">
                    <div className={`p-3 rounded-[14px] text-xs font-semibold ${
                      selectedAnswer === currentStop.challenge.correctIndex
                        ? 'bg-[#30d158]/15 border border-[#30d158]/30 text-[#30d158]'
                        : 'bg-[#ff453a]/15 border border-[#ff453a]/30 text-[#ff453a]'
                    }`}>
                      {selectedAnswer === currentStop.challenge.correctIndex ? '🎉 Correto! ' : '❌ Quase lá! '}
                      {currentStop.challenge.explanation}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAnswer(null);
                        setIsAnswerSubmitted(false);
                      }}
                      className="w-full py-2.5 rounded-[12px] bg-white/10 hover:bg-white/15 text-xs font-bold text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Try Again
                    </button>
                  </div>
                )}

              </div>

              {/* Passport Stamps Visual Grid */}
              <div className="p-4 rounded-[22px] bg-[#2c2c2e]/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <span>Passport Stamps ({completedChallenges.length}/{LANDMARK_STOPS.length})</span>
                  <span>🇵🇹</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {LANDMARK_STOPS.map(stop => {
                    const isDone = completedChallenges.includes(stop.id);
                    return (
                      <div
                        key={stop.id}
                        title={stop.name}
                        onClick={() => handleSelectStop(stop)}
                        className={`aspect-square rounded-[12px] border flex flex-col items-center justify-center p-1 text-center cursor-pointer transition-all active:scale-95 ${
                          isDone 
                            ? 'bg-[#ffd60a]/20 border-[#ffd60a] text-[#ffd60a] shadow-[0_0_10px_rgba(255,214,10,0.3)]' 
                            : 'bg-black/30 border-white/5 text-zinc-600 opacity-40 hover:opacity-80'
                        }`}
                      >
                        <span className="text-base">{stop.badgeEmoji}</span>
                        <span className="text-[8px] font-bold truncate w-full">{stop.name.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 bg-[#141416] border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#ffd60a]" />
            European Portuguese Dialect (Lisboa & Porto Accent)
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[14px] bg-[#0a84ff] hover:bg-[#007aff] text-white font-bold text-xs transition-all active:scale-95 shadow-[0_2px_10px_rgba(10,132,255,0.4)] cursor-pointer"
          >
            Continue Learning
          </button>
        </div>

      </div>

    </div>
  );
};
