export interface VocabItem {
  word: string;
  translation: string;
  category: 'Noun' | 'Verb' | 'Adjective' | 'Expression' | 'Slang';
  ipa: string;
  sentence: string;
  sentenceTranslation: string;
}

export interface SentencePattern {
  id: string;
  template: string; // e.g. "I would like {noun}"
  translationTemplate: string; // e.g. "Aș dori {noun}"
  description: string;
  placeholders: {
    key: string;
    label: string;
    options: { word: string; translation: string }[];
  }[];
}

export interface PronunciationRule {
  character: string;
  sound: string; // IPA or description
  example: string;
  exampleTranslation: string;
}

export interface ConjugationTable {
  verb: string;
  translation: string;
  tenses: {
    name: string;
    pronouns: {
      pronoun: string;
      conjugated: string;
    }[];
  }[];
}

export interface LanguageEssentialsData {
  language: string;
  flag: string;
  introduction: string;
  vocabulary: VocabItem[];
  sentencePatterns: SentencePattern[];
  pronunciation: {
    overview: string;
    rules: PronunciationRule[];
    difficultSounds: { sound: string; advice: string }[];
  };
  grammar: {
    overview: string;
    nounRules: string;
    wordOrder: string;
    conjugations: ConjugationTable[];
  };
}

export const ESSENTIALS_BY_LANGUAGE: Record<string, LanguageEssentialsData> = {
  English: {
    language: 'English',
    flag: '🇺🇸',
    introduction: 'English is a West Germanic language and a global lingua franca. It is the most widely spoken language worldwide by number of speakers.',
    vocabulary: [
      { word: 'hello', translation: 'hello', category: 'Expression', ipa: '/həˈloʊ/', sentence: 'Hello! How are you today?', sentenceTranslation: 'Hello! How are you today?' },
      { word: 'thank you', translation: 'thank you', category: 'Expression', ipa: '/θæŋk ju/', sentence: 'Thank you for your help.', sentenceTranslation: 'Thank you for your help.' },
      { word: 'please', translation: 'please', category: 'Expression', ipa: '/pliːz/', sentence: 'Could you please pass the salt?', sentenceTranslation: 'Could you please pass the salt?' },
      { word: 'awesome', translation: 'awesome', category: 'Slang', ipa: '/ˈɔː.səm/', sentence: 'That movie was awesome!', sentenceTranslation: 'That movie was awesome!' },
      { word: 'food', translation: 'food', category: 'Noun', ipa: '/fuːd/', sentence: 'This food is delicious.', sentenceTranslation: 'This food is delicious.' },
    ],
    sentencePatterns: [
      {
        id: 'en-1',
        template: 'I would like {item}',
        translationTemplate: 'I would like {item}',
        description: 'Polite way to request food, drinks, or services.',
        placeholders: [{
          key: 'item',
          label: 'item',
          options: [
            { word: 'a coffee', translation: 'a coffee' },
            { word: 'water', translation: 'water' },
            { word: 'the bill', translation: 'the bill' }
          ]
        }]
      }
    ],
    pronunciation: {
      overview: 'English pronunciation can be quite irregular because of its complex history and borrowed vocabulary.',
      rules: [
        { character: 'th', sound: '/θ/ or /ð/', example: 'think / this', exampleTranslation: 'think / this' }
      ],
      difficultSounds: [
        { sound: '/r/', advice: 'English R is an alveolar approximant, meaning the tongue approaches the roof of the mouth but doesn\'t touch it.' }
      ]
    },
    grammar: {
      overview: 'English grammar relies heavily on word order (Subject-Verb-Object) rather than inflections.',
      nounRules: 'Plurals are usually formed by adding -s or -es, with some irregular nouns (e.g. child -> children).',
      wordOrder: 'Subject-Verb-Object (SVO)',
      conjugations: [
        {
          verb: 'to be',
          translation: 'to be',
          tenses: [
            {
              name: 'Present Simple',
              pronouns: [
                { pronoun: 'I', conjugated: 'am' },
                { pronoun: 'You', conjugated: 'are' },
                { pronoun: 'He/She/It', conjugated: 'is' },
                { pronoun: 'We', conjugated: 'are' },
                { pronoun: 'They', conjugated: 'are' }
              ]
            }
          ]
        }
      ]
    }
  },
  Romanian: {
    language: 'Romanian',
    flag: '🇷🇴',
    introduction: 'Romanian is a Romance language spoken by around 24 million people. It shares about 77% of its vocabulary with Italian, and has a rich Latin heritage mixed with Slavic and Balkan influences.',
    vocabulary: [
      { word: 'bună', translation: 'hello', category: 'Expression', ipa: '/ˈbu.nə/', sentence: 'Bună! Ce mai faci astăzi?', sentenceTranslation: 'Hello! How are you doing today?' },
      { word: 'mulțumesc', translation: 'thank you', category: 'Expression', ipa: '/mul.t͡suˈmesk/', sentence: 'Mulțumesc mult pentru ajutorul tău.', sentenceTranslation: 'Thank you very much for your help.' },
      { word: 'te rog', translation: 'please', category: 'Expression', ipa: '/te roɡ/', sentence: 'Dă-mi sarea, te rog.', sentenceTranslation: 'Give me the salt, please.' },
      { word: 'covrig', translation: 'pretzel', category: 'Noun', ipa: '/kovˈriɡ/', sentence: 'Cumpăr un covrig cald de la patiserie.', sentenceTranslation: 'I am buying a warm pretzel from the bakery.' },
      { word: 'mâncare', translation: 'food', category: 'Noun', ipa: '/mɨnˈka.re/', sentence: 'Această mâncare tradițională este delicioasă.', sentenceTranslation: 'This traditional food is delicious.' },
      { word: 'frumos', translation: 'beautiful / nice', category: 'Adjective', ipa: '/fruˈmos/', sentence: 'Bucureștiul este un oraș frumos.', sentenceTranslation: 'Bucharest is a beautiful city.' },
      { word: 'a dori', translation: 'to wish / to want', category: 'Verb', ipa: '/a doˈri/', sentence: 'Aș dori să comand o prăjitură.', sentenceTranslation: 'I would like to order a cake.' },
      { word: 'prieten', translation: 'friend', category: 'Noun', ipa: '/priˈe.ten/', sentence: 'El este cel mai bun prieten al meu.', sentenceTranslation: 'He is my best friend.' },
      { word: 'tren', translation: 'train', category: 'Noun', ipa: '/tren/', sentence: 'Trenul spre Brașov pleacă la ora zece.', sentenceTranslation: 'The train to Brasov departs at ten o\'clock.' },
      { word: 'mișto', translation: 'cool / awesome', category: 'Slang', ipa: '/miʃˈto/', sentence: 'Filmul de ieri a fost super mișto.', sentenceTranslation: 'Yesterday\'s movie was super cool.' }
    ],
    sentencePatterns: [
      {
        id: 'ro-1',
        template: 'I would like {item}',
        translationTemplate: 'Aș dori {item}',
        description: 'Polite way to request food, drinks, or services in cafes and shops.',
        placeholders: [{
          key: 'item',
          label: 'item',
          options: [
            { word: 'o cafea', translation: 'a coffee' },
            { word: 'o apă plată', translation: 'a still water' },
            { word: 'notă de plată', translation: 'the bill' },
            { word: 'un covrig', translation: 'a pretzel' }
          ]
        }]
      },
      {
        id: 'ro-2',
        template: 'Where is the {place}?',
        translationTemplate: 'Unde este {place}?',
        description: 'Essential pattern for navigating Romanian towns, stations, and markets.',
        placeholders: [{
          key: 'place',
          label: 'place',
          options: [
            { word: 'gara', translation: 'the train station' },
            { word: 'toaleta', translation: 'the restroom' },
            { word: 'hotelul', translation: 'the hotel' },
            { word: 'stația de metrou', translation: 'the subway station' }
          ]
        }]
      }
    ],
    pronunciation: {
      overview: 'Romanian pronunciation is phonetic, meaning words are pronounced exactly as they are written. However, it contains unique letters (diacritics) that require special attention.',
      rules: [
        { character: 'ă', sound: 'uh (schwa /ə/)', example: 'fată', exampleTranslation: 'girl (pronounced fah-tuh)' },
        { character: 'â / î', sound: 'closed i (/ɨ/) - tight throat vowel', example: 'român', exampleTranslation: 'Romanian' },
        { character: 'ș', sound: 'sh (/ʃ/) as in shoe', example: 'și', exampleTranslation: 'and' },
        { character: 'ț', sound: 'ts (/t͡s/) as in cats', example: 'țară', exampleTranslation: 'country' }
      ],
      difficultSounds: [
        { sound: 'â / î', advice: 'Keep your teeth together, flatten your tongue as if making an "ee" sound, but force the sound from the back of your throat.' },
        { sound: 'Silent "i" at the end', advice: 'In words like "bucurești" or "vezi", the final "i" is not a full vowel. It just softens (palatalizes) the preceding consonant, like a tiny whisper of air.' }
      ]
    },
    grammar: {
      overview: 'Romanian grammar is synthetic. It retains a case system (Nominative-Accusative, Genitive-Dative, Vocative) from Latin, gendered nouns, and flexible verbal conjugation groups.',
      nounRules: 'Nouns are Masculine, Feminine, or Neuter (which behave like masculine in singular and feminine in plural). Definitive articles are attached as suffixes at the end of nouns (e.g., drum = road, drumul = the road).',
      wordOrder: 'Standard Word Order is Subject-Verb-Object (SVO), but adjectives usually follow the noun they modify (e.g., covrig cald = pretzel hot).',
      conjugations: [
        {
          verb: 'a fi',
          translation: 'to be',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Eu (I)', conjugated: 'sunt' },
                { pronoun: 'Tu (You)', conjugated: 'ești' },
                { pronoun: 'El/Ea (He/She)', conjugated: 'este / e' },
                { pronoun: 'Noi (We)', conjugated: 'suntem' },
                { pronoun: 'Voi (You pl.)', conjugated: 'sunteți' },
                { pronoun: 'Ei/Ele (They)', conjugated: 'sunt' }
              ]
            }
          ]
        },
        {
          verb: 'a avea',
          translation: 'to have',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Eu (I)', conjugated: 'am' },
                { pronoun: 'Tu (You)', conjugated: 'ai' },
                { pronoun: 'El/Ea (He/She)', conjugated: 'are' },
                { pronoun: 'Noi (We)', conjugated: 'avem' },
                { pronoun: 'Voi (You pl.)', conjugated: 'aveți' },
                { pronoun: 'Ei/Ele (They)', conjugated: 'au' }
              ]
            }
          ]
        }
      ]
    }
  },
  Dutch: {
    language: 'Dutch',
    flag: '🇳🇱',
    introduction: 'Dutch is a West Germanic language spoken by about 25 million people. It stands linguistically between English and German, sharing sentence structural elements and many cognates.',
    vocabulary: [
      { word: 'hallo', translation: 'hello', category: 'Expression', ipa: '/ɦɑˈloː/', sentence: 'Hallo! Hoe gaat het met jou?', sentenceTranslation: 'Hello! How are you doing?' },
      { word: 'dank je wel', translation: 'thank you very much', category: 'Expression', ipa: '/ˈdɑŋcəˌʋɛl/', sentence: 'Dank je wel voor het lekkere eten!', sentenceTranslation: 'Thank you very much for the delicious food!' },
      { word: 'alstublieft', translation: 'please (formal) / here you go', category: 'Expression', ipa: '/ˌɑlstyˈblift/', sentence: 'Een kopje koffie, alstublieft.', sentenceTranslation: 'A cup of coffee, please.' },
      { word: 'fiets', translation: 'bicycle', category: 'Noun', ipa: '/fits/', sentence: 'Ik ga altijd op de fiets naar het werk.', sentenceTranslation: 'I always go to work on the bicycle.' },
      { word: 'gezellig', translation: 'cozy / companionable', category: 'Adjective', ipa: '/ɣəˈzɛləx/', sentence: 'Het café was gisteravond heel gezellig.', sentenceTranslation: 'The cafe was very cozy yesterday evening.' },
      { word: 'lekker', translation: 'delicious / tasty / nice', category: 'Adjective', ipa: '/ˈlɛkər/', sentence: 'Deze stroopwafel is echt super lekker.', sentenceTranslation: 'This stroopwafel is really super delicious.' },
      { word: 'begrijpen', translation: 'to understand', category: 'Verb', ipa: '/bəˈɣrɛipə(n)/', sentence: 'Ik begrijp de Nederlandse grammatica nog niet.', sentenceTranslation: 'I do not understand Dutch grammar yet.' },
      { word: 'treinstation', translation: 'train station', category: 'Noun', ipa: '/ˈtrɛinstɑˌʃɔn/', sentence: 'Het treinstation is vijf minuten lopen hiervandaan.', sentenceTranslation: 'The train station is a five-minute walk from here.' },
      { word: 'leuk', translation: 'fun / nice', category: 'Adjective', ipa: '/løːk/', sentence: 'Wat leuk dat je Nederlands leert!', sentenceTranslation: 'How nice that you are learning Dutch!' },
      { word: 'nou ja', translation: 'well / oh well', category: 'Slang', ipa: '/nʌu jaː/', sentence: 'Nou ja, het maakt niet zoveel uit.', sentenceTranslation: 'Well, it doesn\'t matter that much.' }
    ],
    sentencePatterns: [
      {
        id: 'nl-1',
        template: 'I would like {item}',
        translationTemplate: 'Ik wil graag {item}',
        description: 'Standard polite request for placing orders in Dutch establishments.',
        placeholders: [{
          key: 'item',
          label: 'item',
          options: [
            { word: 'een koffie', translation: 'a coffee' },
            { word: 'een biertje', translation: 'a beer' },
            { word: 'de rekening', translation: 'the bill' },
            { word: 'een stroopwafel', translation: 'a stroopwafel' }
          ]
        }]
      },
      {
        id: 'nl-2',
        template: 'Where is the {place}?',
        translationTemplate: 'Waar is {place}?',
        description: 'Crucial for finding your way around Amsterdam or other cities.',
        placeholders: [{
          key: 'place',
          label: 'place',
          options: [
            { word: 'het station', translation: 'the station' },
            { word: 'de wc', translation: 'the restroom' },
            { word: 'de supermarkt', translation: 'the supermarket' },
            { word: 'het hotel', translation: 'the hotel' }
          ]
        }]
      }
    ],
    pronunciation: {
      overview: 'Dutch pronunciation features guttural sounds and long/short vowels which can change the meaning of words completely.',
      rules: [
        { character: 'g / ch', sound: 'guttural scraped g (/ɣ/ or /x/)', example: 'goed', exampleTranslation: 'good (scraped sound)' },
        { character: 'ui', sound: 'diphthong (/œy/) - unique sound', example: 'huis', exampleTranslation: 'house' },
        { character: 'ij', sound: 'diphthong (/ɛi/) - sounds like "ay" in say', example: 'trein', exampleTranslation: 'train' },
        { character: 'sch', sound: 's followed by scraped g (/sx/)', example: 'school', exampleTranslation: 'school' }
      ],
      difficultSounds: [
        { sound: 'The hard "G"', advice: 'Pretend you are clearing your throat gently. Try to produce a soft friction at the back of the palate.' },
        { sound: 'The double vowels (aa, ee, oo, uu)', advice: 'These are pure long vowels. Unlike English vowels, do not turn them into diphthongs. Keep your mouth position steady.' }
      ]
    },
    grammar: {
      overview: 'Dutch grammar has split verb rules (V2 word order), compound nouns, and two definite gender articles (de and het).',
      nounRules: 'Nouns use two gender articles: "de" (masculine/feminine) and "het" (neuter). Plural nouns always use "de". Definite articles affect the adjectives preceding them.',
      wordOrder: 'Dutch uses Subject-Verb-Object in main clauses, but uses Verb-Second (V2) rules. In subordinate clauses, verbs get pushed to the very end of the sentence.',
      conjugations: [
        {
          verb: 'zijn',
          translation: 'to be',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Ik (I)', conjugated: 'ben' },
                { pronoun: 'Jij (You)', conjugated: 'bent' },
                { pronoun: 'Hij/Zij (He/She)', conjugated: 'is' },
                { pronoun: 'Wij (We)', conjugated: 'zijn' },
                { pronoun: 'Jullie (You pl.)', conjugated: 'zijn' },
                { pronoun: 'Zij (They)', conjugated: 'zijn' }
              ]
            }
          ]
        },
        {
          verb: 'hebben',
          translation: 'to have',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Ik (I)', conjugated: 'heb' },
                { pronoun: 'Jij (You)', conjugated: 'hebt' },
                { pronoun: 'Hij/Zij (He/She)', conjugated: 'heeft' },
                { pronoun: 'Wij (We)', conjugated: 'hebben' },
                { pronoun: 'Jullie (You pl.)', conjugated: 'hebben' },
                { pronoun: 'Zij (They)', conjugated: 'hebben' }
              ]
            }
          ]
        }
      ]
    }
  },
  Spanish: {
    language: 'Spanish',
    flag: '🇪🇸',
    introduction: 'Spanish is a Romance language spoken by over 500 million people globally. It is famous for its phonetic spelling, rich verb conjugation system, and rhythmic speech flow.',
    vocabulary: [
      { word: 'hola', translation: 'hello', category: 'Expression', ipa: '/ˈo.la/', sentence: '¡Hola! ¿Cómo estás hoy?', sentenceTranslation: 'Hello! How are you today?' },
      { word: 'gracias', translation: 'thank you', category: 'Expression', ipa: '/ˈɡɾa.sjas/', sentence: 'Muchas gracias por la comida.', sentenceTranslation: 'Thank you very much for the food.' },
      { word: 'por favor', translation: 'please', category: 'Expression', ipa: '/poɾ faˈβoɾ/', sentence: 'Un café solo, por favor.', sentenceTranslation: 'A black coffee, please.' },
      { word: 'tapas', translation: 'tapas / small dishes', category: 'Noun', ipa: '/ˈta.pas/', sentence: 'Vamos a cenar unas tapas deliciosas.', sentenceTranslation: 'We are going to have some delicious tapas for dinner.' },
      { word: 'hermoso', translation: 'beautiful', category: 'Adjective', ipa: '/eɾˈmo.so/', sentence: 'El paisaje de esta playa es hermoso.', sentenceTranslation: 'The scenery of this beach is beautiful.' },
      { word: 'querer', translation: 'to want / to love', category: 'Verb', ipa: '/keˈɾeɾ/', sentence: 'Quiero aprender español rápidamente.', sentenceTranslation: 'I want to learn Spanish quickly.' },
      { word: 'amigo', translation: 'friend', category: 'Noun', ipa: '/aˈmi.ɣo/', sentence: 'Mi amigo vive en Barcelona.', sentenceTranslation: 'My friend lives in Barcelona.' },
      { word: 'tren', translation: 'train', category: 'Noun', ipa: '/tɾen/', sentence: 'El tren de alta velocidad llega a tiempo.', sentenceTranslation: 'The high-speed train arrives on time.' },
      { word: 'guay', translation: 'cool / great', category: 'Slang', ipa: '/ɡwai/', sentence: '¡Esta aplicación es muy guay!', sentenceTranslation: 'This application is very cool!' },
      { word: 'siesta', translation: 'nap', category: 'Noun', ipa: '/ˈsjes.ta/', sentence: 'Me gusta dormir la siesta después del almuerzo.', sentenceTranslation: 'I like to take a nap after lunch.' }
    ],
    sentencePatterns: [
      {
        id: 'es-1',
        template: 'I would like {item}',
        translationTemplate: 'Me gustaría {item}',
        description: 'Polite request for ordering in bars, cafes, and buying tickets.',
        placeholders: [{
          key: 'item',
          label: 'item',
          options: [
            { word: 'un café con leche', translation: 'a coffee with milk' },
            { word: 'una ración de patatas bravas', translation: 'a portion of spicy potatoes' },
            { word: 'la cuenta', translation: 'the bill' },
            { word: 'un billete de tren', translation: 'a train ticket' }
          ]
        }]
      },
      {
        id: 'es-2',
        template: 'Where is the {place}?',
        translationTemplate: '¿Dónde está {place}?',
        description: 'Direction-asking layout essential for any Spanish-speaking tourist.',
        placeholders: [{
          key: 'place',
          label: 'place',
          options: [
            { word: 'la estación', translation: 'the station' },
            { word: 'el baño', translation: 'the bathroom' },
            { word: 'el supermercado', translation: 'the supermarket' },
            { word: 'el hotel más cercano', translation: 'the nearest hotel' }
          ]
        }]
      }
    ],
    pronunciation: {
      overview: 'Spanish is highly phonetic. Letters have a consistent pronunciation, making spelling straightforward once the core rules are mastered.',
      rules: [
        { character: 'h', sound: 'always silent', example: 'hola', exampleTranslation: 'hello (pronounced OH-lah)' },
        { character: 'j / g (before e, i)', sound: 'rough h (/x/) like a soft scrape', example: 'jamón', exampleTranslation: 'ham' },
        { character: 'ñ', sound: 'ny (/ɲ/) like onion', example: 'mañana', exampleTranslation: 'tomorrow / morning' },
        { character: 'll', sound: 'y (/ʝ/) or ly depending on region', example: 'calle', exampleTranslation: 'street' }
      ],
      difficultSounds: [
        { sound: 'The rolled "rr"', advice: 'Relax your tongue against the roof of your mouth behind your front teeth, and blow air over it to make it vibrate.' },
        { sound: 'The "c" and "z"', advice: 'In Castilian Spanish, these are pronounced as "th" (/θ/) before e/i. In Latin American Spanish, they sound like a standard "s".' }
      ]
    },
    grammar: {
      overview: 'Spanish is a highly inflected language. Nouns have grammatical gender (masculine/feminine) and verbs conjugate extensively for tense, aspect, mood, and person.',
      nounRules: 'Nouns ending in "-o" are typically masculine (el), and "-a" are typically feminine (la). Adjectives must agree in both gender and number with the nouns they modify.',
      wordOrder: 'Flexible but primarily Subject-Verb-Object (SVO). Adjectives almost always come after the nouns they modify (e.g. el carro rojo = the red car).',
      conjugations: [
        {
          verb: 'ser',
          translation: 'to be (permanent / identity)',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Yo (I)', conjugated: 'soy' },
                { pronoun: 'Tú (You)', conjugated: 'eres' },
                { pronoun: 'Él/Ella (He/She)', conjugated: 'es' },
                { pronoun: 'Nosotros (We)', conjugated: 'somos' },
                { pronoun: 'Vosotros (You pl.)', conjugated: 'sois' },
                { pronoun: 'Ellos/Ellas (They)', conjugated: 'son' }
              ]
            }
          ]
        },
        {
          verb: 'estar',
          translation: 'to be (temporary / location)',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Yo (I)', conjugated: 'estoy' },
                { pronoun: 'Tú (You)', conjugated: 'estás' },
                { pronoun: 'Él/Ella (He/She)', conjugated: 'está' },
                { pronoun: 'Nosotros (We)', conjugated: 'estamos' },
                { pronoun: 'Vosotros (You pl.)', conjugated: 'estáis' },
                { pronoun: 'Ellos/Ellas (They)', conjugated: 'están' }
              ]
            }
          ]
        }
      ]
    }
  },
  German: {
    language: 'German',
    flag: '🇩🇪',
    introduction: 'German is a Germanic language spoken by over 95 million native speakers. It is famous for its compound words, logical grammar, three genders, and case structures.',
    vocabulary: [
      { word: 'hallo', translation: 'hello', category: 'Expression', ipa: '/ˈhalo/', sentence: 'Hallo! Wie geht es dir heute?', sentenceTranslation: 'Hello! How are you doing today?' },
      { word: 'danke', translation: 'thank you', category: 'Expression', ipa: '/ˈdaŋkə/', sentence: 'Danke schön für Ihre freundliche Hilfe.', sentenceTranslation: 'Thank you very much for your kind help.' },
      { word: 'bitte', translation: 'please / you are welcome', category: 'Expression', ipa: '/ˈbɪtə/', sentence: 'Ein Bier, bitte.', sentenceTranslation: 'A beer, please.' },
      { word: 'brezel', translation: 'pretzel', category: 'Noun', ipa: '/ˈbʁeːt͡sl̩/', sentence: 'Ich esse eine frische Brezel mit Butter.', sentenceTranslation: 'I am eating a fresh pretzel with butter.' },
      { word: 'schön', translation: 'beautiful / nice', category: 'Adjective', ipa: '/ʃøːn/', sentence: 'Das Wetter heute ist wirklich schön.', sentenceTranslation: 'The weather today is really beautiful.' },
      { word: 'verstehen', translation: 'to understand', category: 'Verb', ipa: '/fɛɐ̯ˈʃteːən/', sentence: 'Ich verstehe dieses deutsche Wort nicht.', sentenceTranslation: 'I do not understand this German word.' },
      { word: 'freund', translation: 'friend', category: 'Noun', ipa: '/fʁɔʏnd/', sentence: 'Mein Freund wohnt jetzt in Berlin.', sentenceTranslation: 'My friend lives in Berlin now.' },
      { word: 'bahnhof', translation: 'train station', category: 'Noun', ipa: '/ˈbaːnˌhoːf/', sentence: 'Wo ist der Bahnhof hier in München?', sentenceTranslation: 'Where is the train station here in Munich?' },
      { word: 'lecker', translation: 'delicious', category: 'Adjective', ipa: '/ˈlɛkɐ/', sentence: 'Dieses deutsche Brot schmeckt sehr lecker.', sentenceTranslation: 'This German bread tastes very delicious.' },
      { word: 'geil', translation: 'cool / awesome', category: 'Slang', ipa: '/ɡaɪl/', sentence: 'Das Konzert gestern war richtig geil!', sentenceTranslation: 'The concert yesterday was really awesome!' }
    ],
    sentencePatterns: [
      {
        id: 'de-1',
        template: 'I would like {item}',
        translationTemplate: 'Ich hätte gern {item}',
        description: 'Polite request format for ordering or shopping in Germany.',
        placeholders: [{
          key: 'item',
          label: 'item',
          options: [
            { word: 'einen Kaffee', translation: 'a coffee' },
            { word: 'ein kaltes Bier', translation: 'a cold beer' },
            { word: 'die Rechnung', translation: 'the bill' },
            { word: 'eine Brezel', translation: 'a pretzel' }
          ]
        }]
      },
      {
        id: 'de-2',
        template: 'Where is the {place}?',
        translationTemplate: 'Wo ist {place}?',
        description: 'Essential pattern for directions.',
        placeholders: [{
          key: 'place',
          label: 'place',
          options: [
            { word: 'der Bahnhof', translation: 'the train station' },
            { word: 'die Toilette', translation: 'the restroom' },
            { word: 'der Supermarkt', translation: 'the supermarket' },
            { word: 'das Hotel', translation: 'the hotel' }
          ]
        }]
      }
    ],
    pronunciation: {
      overview: 'German has rules that are mostly consistent. Particular attention is needed for umlauts (ä, ö, ü) and diphthongs.',
      rules: [
        { character: 'v', sound: 'sounds like f (/f/)', example: 'vogel', exampleTranslation: 'bird' },
        { character: 'w', sound: 'sounds like English v (/v/)', example: 'wasser', exampleTranslation: 'water' },
        { character: 'ie', sound: 'long "ee" (/iː/)', example: 'bier', exampleTranslation: 'beer' },
        { character: 'ei', sound: 'sounds like "eye" (/aɪ/)', example: 'wein', exampleTranslation: 'wine' }
      ],
      difficultSounds: [
        { sound: 'Umlauts (ö, ü)', advice: 'For "ö", make the "ay" shape with your lips, but round them into an "O". For "ü", shape your lips as if whistling an "oo" sound, but try to say "ee".' },
        { sound: 'The "ch" sound', advice: 'It has two pronunciations. Soft "ich-Laut" after e/i (like a soft cat hiss) and hard "ach-Laut" after a/o/u (back of throat scrape).' }
      ]
    },
    grammar: {
      overview: 'German uses a system of four cases (Nominative, Accusative, Dative, Genitive) and three genders (Masculine, Feminine, Neuter) which change the form of articles, pronouns, and adjectives.',
      nounRules: 'Nouns are always capitalized. Definitive articles are "der" (Masculine), "die" (Feminine), and "das" (Neuter). Plural nouns use "die" in the Nominative case.',
      wordOrder: 'Verb-Second (V2) in main clauses. If a clause begins with an adverb or time reference, the verb must still occupy the second slot, forcing the subject to invert.',
      conjugations: [
        {
          verb: 'sein',
          translation: 'to be',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Ich (I)', conjugated: 'bin' },
                { pronoun: 'Du (You)', conjugated: 'bist' },
                { pronoun: 'Er/Sie/Es (He/She/It)', conjugated: 'ist' },
                { pronoun: 'Wir (We)', conjugated: 'sind' },
                { pronoun: 'Ihr (You pl.)', conjugated: 'seid' },
                { pronoun: 'Sie/sie (They / Formal)', conjugated: 'sind' }
              ]
            }
          ]
        },
        {
          verb: 'haben',
          translation: 'to have',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Ich (I)', conjugated: 'habe' },
                { pronoun: 'Du (You)', conjugated: 'hast' },
                { pronoun: 'Er/Sie/Es (He/She/It)', conjugated: 'hat' },
                { pronoun: 'Wir (We)', conjugated: 'haben' },
                { pronoun: 'Ihr (You pl.)', conjugated: 'habt' },
                { pronoun: 'Sie/sie (They / Formal)', conjugated: 'haben' }
              ]
            }
          ]
        }
      ]
    }
  },
  French: {
    language: 'French',
    flag: '🇫🇷',
    introduction: 'French is a Romance language spoken by over 275 million speakers. It has a beautiful flowing sound due to liaison rules, silent final consonants, and nasal vowels.',
    vocabulary: [
      { word: 'bonjour', translation: 'hello / good morning', category: 'Expression', ipa: '/bɔ̃.ʒuʁ/', sentence: 'Bonjour! Comment allez-vous ce matin?', sentenceTranslation: 'Hello! How are you doing this morning?' },
      { word: 'merci', translation: 'thank you', category: 'Expression', ipa: '/mɛʁ.si/', sentence: 'Merci beaucoup pour votre charmant cadeau.', sentenceTranslation: 'Thank you very much for your lovely gift.' },
      { word: 's\'il vous plaît', translation: 'please (formal)', category: 'Expression', ipa: '/s‿il vu plɛ/', sentence: 'Un croissant et un café, s\'il vous plaît.', sentenceTranslation: 'A croissant and a coffee, please.' },
      { word: 'croissant', translation: 'croissant / crescent pastry', category: 'Noun', ipa: '/kʁwa.sɑ̃/', sentence: 'J\'achète un croissant chaud à la boulangerie.', sentenceTranslation: 'I am buying a hot croissant at the bakery.' },
      { word: 'beau', translation: 'beautiful', category: 'Adjective', ipa: '/bo/', sentence: 'Paris est un très beau musée en plein air.', sentenceTranslation: 'Paris is a very beautiful open-air museum.' },
      { word: 'vouloir', translation: 'to want', category: 'Verb', ipa: '/vu.lwaʁ/', sentence: 'Je voudrais commander une bouteille d\'eau.', sentenceTranslation: 'I would like to order a bottle of water.' },
      { word: 'ami', translation: 'friend', category: 'Noun', ipa: '/a.mi/', sentence: 'Mon ami étudie la littérature à la Sorbonne.', sentenceTranslation: 'My friend studies literature at the Sorbonne.' },
      { word: 'gare', translation: 'train station', category: 'Noun', ipa: '/ɡaʁ/', sentence: 'Le train part de la gare de Lyon à midi.', sentenceTranslation: 'The train departs from Lyon train station at noon.' },
      { word: 'délicieux', translation: 'delicious', category: 'Adjective', ipa: '/de.li.sjø/', sentence: 'Ce fromage français est absolument délicieux.', sentenceTranslation: 'This French cheese is absolutely delicious.' },
      { word: 'ouf', translation: 'phew / crazy', category: 'Slang', ipa: '/uf/', sentence: 'C\'est un truc de ouf !', sentenceTranslation: 'This is a crazy thing! (Verlan for "fou")' }
    ],
    sentencePatterns: [
      {
        id: 'fr-1',
        template: 'I would like {item}',
        translationTemplate: 'Je voudrais {item}',
        description: 'Polite conditional structure for requesting things in France.',
        placeholders: [{
          key: 'item',
          label: 'item',
          options: [
            { word: 'un café', translation: 'a coffee' },
            { word: 'un croissant au beurre', translation: 'a butter croissant' },
            { word: 'l\'addition', translation: 'the bill' },
            { word: 'un billet de train', translation: 'a train ticket' }
          ]
        }]
      },
      {
        id: 'fr-2',
        template: 'Where is the {place}?',
        translationTemplate: 'Où se trouve {place}?',
        description: 'Excellent way to ask where landmarks or services are located.',
        placeholders: [{
          key: 'place',
          label: 'place',
          options: [
            { word: 'la gare', translation: 'the train station' },
            { word: 'les toilettes', translation: 'the restroom' },
            { word: 'le supermarché', translation: 'the supermarket' },
            { word: 'l\'hôtel', translation: 'the hotel' }
          ]
        }]
      }
    ],
    pronunciation: {
      overview: 'French pronunciation requires mouth muscles to be tense. Many final consonants are silent, and nasal vowels (an, in, on, un) are common.',
      rules: [
        { character: 'r', sound: 'guttural, voiced uvular fricative (/ʁ/)', example: 'rouge', exampleTranslation: 'red' },
        { character: 'ou', sound: 'sounds like "oo" in boot (/u/)', example: 'oui', exampleTranslation: 'yes' },
        { character: 'u', sound: 'tight high front rounded vowel (/y/)', example: 'tu', exampleTranslation: 'you' },
        { character: 'oi', sound: 'sounds like "wah" (/wa/)', example: 'trois', exampleTranslation: 'three' }
      ],
      difficultSounds: [
        { sound: 'The French "R"', advice: 'Pretend you are gargling water at the back of your throat. Keep the tip of your tongue resting behind your lower front teeth.' },
        { sound: 'Nasal vowels', advice: 'When saying "un, bon, vin", block the air from escaping your mouth completely at the end, letting it resonate in your nose.' }
      ]
    },
    grammar: {
      overview: 'French verbs conjugate into multiple tenses, and nouns are either Masculine or Feminine. Adjectives must agree in gender and number.',
      nounRules: 'Nouns use masculine "le" (or un) and feminine "la" (or une). For plural nouns, both genders use "les" (or des). Dual pronouns and gender markers affect writing.',
      wordOrder: 'Subject-Verb-Object (SVO). Adjectives generally go after the noun, but some common short ones (like bon, grand, petit) precede the noun.',
      conjugations: [
        {
          verb: 'être',
          translation: 'to be',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Je (I)', conjugated: 'suis' },
                { pronoun: 'Tu (You)', conjugated: 'es' },
                { pronoun: 'Il/Elle (He/She)', conjugated: 'est' },
                { pronoun: 'Nous (We)', conjugated: 'sommes' },
                { pronoun: 'Vous (You pl. / Formal)', conjugated: 'êtes' },
                { pronoun: 'Ils/Elles (They)', conjugated: 'sont' }
              ]
            }
          ]
        },
        {
          verb: 'avoir',
          translation: 'to have',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'J\' (I)', conjugated: 'ai' },
                { pronoun: 'Tu (You)', conjugated: 'as' },
                { pronoun: 'Il/Elle (He/She)', conjugated: 'a' },
                { pronoun: 'Nous (We)', conjugated: 'avons' },
                { pronoun: 'Vous (You pl. / Formal)', conjugated: 'avez' },
                { pronoun: 'Ils/Elles (They)', conjugated: 'ont' }
              ]
            }
          ]
        }
      ]
    }
  },
  Italian: {
    language: 'Italian',
    flag: '🇮🇹',
    introduction: 'Italian is a Romance language spoken by about 66 million people. It is famous for its expressive melodic rhythm, open vowels, and rich culinary/art terminology.',
    vocabulary: [
      { word: 'ciao', translation: 'hello / goodbye', category: 'Expression', ipa: '/ˈt͡ʃa.o/', sentence: 'Ciao! Come stai oggi?', sentenceTranslation: 'Hello! How are you doing today?' },
      { word: 'grazie', translation: 'thank you', category: 'Expression', ipa: '/ˈɡrat.tsje/', sentence: 'Grazie mille per il caffè delizioso.', sentenceTranslation: 'Thank you very much for the delicious coffee.' },
      { word: 'per favore', translation: 'please', category: 'Expression', ipa: '/per faˈvo.re/', sentence: 'Un gelato al limone, per favore.', sentenceTranslation: 'A lemon gelato, please.' },
      { word: 'pasta', translation: 'pasta', category: 'Noun', ipa: '/ˈpas.ta/', sentence: 'Oggi cucino una tipica pasta italiana.', sentenceTranslation: 'Today I am cooking typical Italian pasta.' },
      { word: 'bello', translation: 'beautiful / handsome', category: 'Adjective', ipa: '/ˈbɛl.lo/', sentence: 'Il colosseo di sera è davvero bello.', sentenceTranslation: 'The Colosseum at night is really beautiful.' },
      { word: 'volere', translation: 'to want', category: 'Verb', ipa: '/voˈle.re/', sentence: 'Vorrei prenotare un tavolo per stasera.', sentenceTranslation: 'I would like to reserve a table for tonight.' },
      { word: 'amico', translation: 'friend', category: 'Noun', ipa: '/aˈmi.ko/', sentence: 'Il mio amico vive a Firenze.', sentenceTranslation: 'My friend lives in Florence.' },
      { word: 'stazione', translation: 'station', category: 'Noun', ipa: '/statˈtsjo.ne/', sentence: 'La stazione centrale dista un chilometro.', sentenceTranslation: 'The central station is one kilometer away.' },
      { word: 'buono', translation: 'good / tasty', category: 'Adjective', ipa: '/ˈbwo.no/', sentence: 'Questo tiramisù è incredibilmente buono!', sentenceTranslation: 'This tiramisu is incredibly good!' },
      { word: 'figo', translation: 'cool / awesome', category: 'Slang', ipa: '/ˈfi.ɡo/', sentence: 'Quel ragazzo indossa occhiali da sole molto fighi.', sentenceTranslation: 'That guy is wearing very cool sunglasses.' }
    ],
    sentencePatterns: [
      {
        id: 'it-1',
        template: 'I would like {item}',
        translationTemplate: 'Vorrei {item}',
        description: 'Standard polite restaurant order structure in Italy.',
        placeholders: [{
          key: 'item',
          label: 'item',
          options: [
            { word: 'un espresso', translation: 'an espresso' },
            { word: 'una pizza Margherita', translation: 'a Margherita pizza' },
            { word: 'il conto', translation: 'the bill' },
            { word: 'un gelato piccolo', translation: 'a small gelato' }
          ]
        }]
      },
      {
        id: 'it-2',
        template: 'Where is the {place}?',
        translationTemplate: 'Dov\'è {place}?',
        description: 'Crucial for exploring Italian cities and historical sites.',
        placeholders: [{
          key: 'place',
          label: 'place',
          options: [
            { word: 'la stazione', translation: 'the station' },
            { word: 'il bagno', translation: 'the restroom' },
            { word: 'il ristorante', translation: 'the restaurant' },
            { word: 'l\'albergo', translation: 'the hotel' }
          ]
        }]
      }
    ],
    pronunciation: {
      overview: 'Italian spelling is mostly regular. Double consonants are held longer, and vowels are always fully and cleanly pronounced.',
      rules: [
        { character: 'c (before e, i)', sound: 'ch (/t͡ʃ/) as in chair', example: 'ciao', exampleTranslation: 'hello / bye' },
        { character: 'c (before a, o, u)', sound: 'k (/k/) as in key', example: 'caffè', exampleTranslation: 'coffee' },
        { character: 'ch (before e, i)', sound: 'always k (/k/)', example: 'chiave', exampleTranslation: 'key' },
        { character: 'gli', sound: 'soft ly sound (/ʎ/)', example: 'famiglia', exampleTranslation: 'family' }
      ],
      difficultSounds: [
        { sound: 'Double consonants (tt, ll, pp)', advice: 'Linger or pause slightly on the consonant. For instance, pronounce "fatto" as "fat-to", briefly stopping your breath before releasing.' },
        { sound: 'The rolled "R"', advice: 'Let your tongue flutter gently behind your top front teeth. Keep your airflow steady and strong.' }
      ]
    },
    grammar: {
      overview: 'Italian grammar features gendered nouns (Masculine ending in -o, Feminine in -a), pluralization by changing vowel endings, and highly precise verbal conjugations.',
      nounRules: 'Instead of adding "-s" for plurals, Italian changes the ending: masculine "-o" becomes "-i", feminine "-a" becomes "-e". Definite articles are complex (il, lo, la, i, gli, le).',
      wordOrder: 'Subject-Verb-Object (SVO), but subject pronouns are usually dropped since the conjugated verb endings clearly show who is speaking.',
      conjugations: [
        {
          verb: 'essere',
          translation: 'to be',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Io (I)', conjugated: 'sono' },
                { pronoun: 'Tu (You)', conjugated: 'sei' },
                { pronoun: 'Lui/Lei (He/She)', conjugated: 'è' },
                { pronoun: 'Noi (We)', conjugated: 'siamo' },
                { pronoun: 'Voi (You pl.)', conjugated: 'siete' },
                { pronoun: 'Loro (They)', conjugated: 'sono' }
              ]
            }
          ]
        },
        {
          verb: 'avere',
          translation: 'to have',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Io (I)', conjugated: 'ho' },
                { pronoun: 'Tu (You)', conjugated: 'hai' },
                { pronoun: 'Lui/Lei (He/She)', conjugated: 'ha' },
                { pronoun: 'Noi (We)', conjugated: 'abbiamo' },
                { pronoun: 'Voi (You pl.)', conjugated: 'avete' },
                { pronoun: 'Loro (They)', conjugated: 'hanno' }
              ]
            }
          ]
        }
      ]
    }
  },
  Japanese: {
    language: 'Japanese',
    flag: '🇯🇵',
    introduction: 'Japanese is spoken by around 125 million people. It uses three writing systems (Hiragana, Katakana, Kanji), grammatical particles, and has levels of politeness.',
    vocabulary: [
      { word: 'こんにちは (konnichiwa)', translation: 'hello', category: 'Expression', ipa: '/koɲɲit͡ɕiɰa/', sentence: 'こんにちは！お元気ですか？', sentenceTranslation: 'Hello! How are you?' },
      { word: 'ありがとう (arigatou)', translation: 'thank you', category: 'Expression', ipa: '/aɾiɡatoː/', sentence: '手伝ってくれてありがとう。', sentenceTranslation: 'Thank you for helping me.' },
      { word: 'お願いします (onegaishimasu)', translation: 'please (requesting)', category: 'Expression', ipa: '/oneɡaiɕimasɯ/', sentence: 'お水を一杯お願いします。', sentenceTranslation: 'A glass of water, please.' },
      { word: '寿司 (sushi)', translation: 'sushi', category: 'Noun', ipa: '/sɯɕi/', sentence: '日本の寿司は本当に美味しいです。', sentenceTranslation: 'Japanese sushi is really delicious.' },
      { word: '美味しい (oishii)', translation: 'delicious / tasty', category: 'Adjective', ipa: '/oiɕiː/', sentence: 'このラーメンはとても美味しいですね。', sentenceTranslation: 'This ramen is very delicious, isn\'t it?' },
      { word: '食べる (taberu)', translation: 'to eat', category: 'Verb', ipa: '/tabeɾɯ/', sentence: '今日の夜ご飯は和食を食べます。', sentenceTranslation: 'I will eat Japanese food for dinner tonight.' },
      { word: '友達 (tomodachi)', translation: 'friend', category: 'Noun', ipa: '/tomodat͡ɕi/', sentence: '明日、友達と東京駅で会います。', sentenceTranslation: 'Tomorrow, I will meet my friend at Tokyo Station.' },
      { word: '駅 (eki)', translation: 'station', category: 'Noun', ipa: '/eki/', sentence: '一番近い駅はどこですか？', sentenceTranslation: 'Where is the nearest station?' },
      { word: '綺麗 (kirei)', translation: 'beautiful / clean', category: 'Adjective', ipa: '/kiɾeː/', sentence: '京都の桜はとても綺麗でした。', sentenceTranslation: 'Kyoto\'s cherry blossoms were very beautiful.' },
      { word: 'うまい (umai)', translation: 'delicious / skillful (informal)', category: 'Slang', ipa: '/ɯmai/', sentence: 'このお好み焼き、うまいな！', sentenceTranslation: 'This okonomiyaki is so good!' }
    ],
    sentencePatterns: [
      {
        id: 'ja-1',
        template: 'I would like {item}',
        translationTemplate: '{item} をお願いします (.. o onegaishimasu)',
        description: 'Standard polite way to order items in Japanese cafes or shops.',
        placeholders: [{
          key: 'item',
          label: 'item',
          options: [
            { word: 'コーヒー (koohii)', translation: 'coffee' },
            { word: 'お水 (omizu)', translation: 'water' },
            { word: 'お会計 (okaikei)', translation: 'the bill' },
            { word: 'お寿司 (osushi)', translation: 'sushi' }
          ]
        }]
      },
      {
        id: 'ja-2',
        template: 'Where is the {place}?',
        translationTemplate: '{place} はどこですか？ (.. wa doko desu ka?)',
        description: 'Essential layout for asking directions around Japan.',
        placeholders: [{
          key: 'place',
          label: 'place',
          options: [
            { word: '駅 (eki)', translation: 'the station' },
            { word: 'お手洗い (otearai)', translation: 'the restroom' },
            { word: 'コンビニ (konbini)', translation: 'the convenience store' },
            { word: 'ホテル (hoteru)', translation: 'the hotel' }
          ]
        }]
      }
    ],
    pronunciation: {
      overview: 'Japanese pronunciation is syllable-timed and relatively flat. Every syllable is pronounced with equal length, using five clear vowel sounds.',
      rules: [
        { character: 'r', sound: 'alveolar tap (between English d, l, and r)', example: 'ringo', exampleTranslation: 'apple' },
        { character: 'u', sound: 'unrounded u (/ɯ/)', example: 'mizu', exampleTranslation: 'water' },
        { character: 'sh', sound: 'voiceless alveolo-palatal sibilant (/ɕ/)', example: 'sushi', exampleTranslation: 'sushi' },
        { character: 'n (ん)', sound: 'syllabic nasal (/ɴ/)', example: 'nihon', exampleTranslation: 'Japan' }
      ],
      difficultSounds: [
        { sound: 'The Japanese "R"', advice: 'Flick your tongue against the roof of your mouth, right behind your upper teeth, exactly like saying a rapid "d" or tapped English "t" in "water".' },
        { sound: 'Double consonants (e.g. kitto)', advice: 'A small "tsu" (っ) indicates a short silence of one beat before pronouncing the next consonant. Pause briefly.' }
      ]
    },
    grammar: {
      overview: 'Japanese is an agglutinative SOV (Subject-Object-Verb) language. Nouns do not have gender, number, or articles. Sentences use postpositional particles to mark cases.',
      nounRules: 'Nouns are simple: no plural forms or gender. Particles like "wa" or "ga" identify the topic/subject, "o" marks the object, and "ni" or "e" indicates direction.',
      wordOrder: 'Japanese is strictly Subject-Object-Verb (SOV). The verb always appears at the very end of the sentence (e.g., ringo o taberu = apple eat).',
      conjugations: [
        {
          verb: 'です (desu)',
          translation: 'to be (copula)',
          tenses: [
            {
              name: 'Present Tense (Polite)',
              pronouns: [
                { pronoun: 'I / You / He / She (Neutral)', conjugated: 'です (desu)' },
                { pronoun: 'Past Tense', conjugated: 'でした (deshita)' },
                { pronoun: 'Negative', conjugated: 'ではありません (dewa arimasen)' },
                { pronoun: 'Past Negative', conjugated: 'ではありませんでした (dewa arimasendhita)' }
              ]
            }
          ]
        },
        {
          verb: 'ある / いる (aru / iru)',
          translation: 'to exist / to have',
          tenses: [
            {
              name: 'Present Tense (Polite)',
              pronouns: [
                { pronoun: 'Exist (Inanimate - e.g. things)', conjugated: 'あります (arimasu)' },
                { pronoun: 'Exist (Animate - e.g. people/pets)', conjugated: 'います (imasu)' },
                { pronoun: 'Negative Inanimate', conjugated: 'ありません (arimasen)' },
                { pronoun: 'Negative Animate', conjugated: 'いません (imasen)' }
              ]
            }
          ]
        }
      ]
    }
  },
  Portuguese: {
    language: 'Portuguese',
    flag: '🇵🇹',
    introduction: 'Portuguese is a Romance language spoken by around 260 million people. It is characterized by nasal vowels, multiple verbal tenses, and rich contractions.',
    vocabulary: [
      { word: 'olá', translation: 'hello', category: 'Expression', ipa: '/ɔˈla/', sentence: 'Olá! Como você está hoje?', sentenceTranslation: 'Hello! How are you today?' },
      { word: 'obrigado', translation: 'thank you (masc.)', category: 'Expression', ipa: '/uβɾiˈɡaðu/', sentence: 'Muito obrigado pela sua atenção.', sentenceTranslation: 'Thank you very much for your attention.' },
      { word: 'por favor', translation: 'please', category: 'Expression', ipa: '/puɾ fɐˈvoɾ/', sentence: 'Um café expresso, por favor.', sentenceTranslation: 'An espresso coffee, please.' },
      { word: 'pastel de nata', translation: 'custard tart', category: 'Noun', ipa: '/pɐʃˈtɛɫ ðɨ ˈnatɐ/', sentence: 'Eu adoro comer um pastel de nata de manhã.', sentenceTranslation: 'I love to eat a custard tart in the morning.' },
      { word: 'bonito', translation: 'beautiful / pretty', category: 'Adjective', ipa: '/buˈnitu/', sentence: 'Lisboa é uma cidade extremamente bonita.', sentenceTranslation: 'Lisbon is an extremely beautiful city.' },
      { word: 'querer', translation: 'to want', category: 'Verb', ipa: '/kɨˈɾeɾ/', sentence: 'Eu quero reservar uma mesa para jantar.', sentenceTranslation: 'I want to reserve a table for dinner.' },
      { word: 'amigo', translation: 'friend', category: 'Noun', ipa: '/ɐˈmiɡu/', sentence: 'O meu amigo está de férias no Algarve.', sentenceTranslation: 'My friend is on holiday in Algarve.' },
      { word: 'estação', translation: 'station', category: 'Noun', ipa: '/iʃtɐˈsɐ̃w̃/', sentence: 'Onde fica a estação de comboios?', sentenceTranslation: 'Where is the train station?' },
      { word: 'gostoso', translation: 'tasty / delicious', category: 'Adjective', ipa: '/ɡuʃˈtozu/', sentence: 'Este prato de bacalhau está muito gostoso!', sentenceTranslation: 'This codfish dish is very tasty!' },
      { word: 'fixe', translation: 'cool / nice', category: 'Slang', ipa: '/ˈfiʃɨ/', sentence: 'Esta praia em Portugal é super fixe.', sentenceTranslation: 'This beach in Portugal is super cool.' }
    ],
    sentencePatterns: [
      {
        id: 'pt-1',
        template: 'I would like {item}',
        translationTemplate: 'Gostaria de {item}',
        description: 'Polite way of placing requests in Portuguese cafes and hotels.',
        placeholders: [{
          key: 'item',
          label: 'item',
          options: [
            { word: 'um café', translation: 'a coffee' },
            { word: 'um pastel de nata', translation: 'a custard tart' },
            { word: 'a conta', translation: 'the bill' },
            { word: 'um copo de água', translation: 'a glass of water' }
          ]
        }]
      },
      {
        id: 'pt-2',
        template: 'Where is the {place}?',
        translationTemplate: 'Onde fica {place}?',
        description: 'Direction-seeking structure essential for exploring towns.',
        placeholders: [{
          key: 'place',
          label: 'place',
          options: [
            { word: 'a estação', translation: 'the station' },
            { word: 'a casa de banho', translation: 'the restroom' },
            { word: 'o supermercado', translation: 'the supermarket' },
            { word: 'o hotel', translation: 'the hotel' }
          ]
        }]
      }
    ],
    pronunciation: {
      overview: 'Portuguese is rich in vowel sounds, nasal pronunciations (ã, ão), and contains distinct accents depending on whether European or Brazilian is spoken.',
      rules: [
        { character: 'ã / ão', sound: 'nasal sounds (/ɐ̃/, /ɐ̃w̃/)', example: 'pão', exampleTranslation: 'bread' },
        { character: 'lh', sound: 'soft ly sound (/ʎ/) like Italian gli', example: 'mulher', exampleTranslation: 'woman' },
        { character: 'nh', sound: 'ny sound (/ɲ/) like Spanish ñ', example: 'ninho', exampleTranslation: 'nest' },
        { character: 's (before consonants or end)', sound: 'sh sound (/ʃ/) in European Portuguese', example: 'festa', exampleTranslation: 'party (pronounced fesh-ta)' }
      ],
      difficultSounds: [
        { sound: 'Nasal vowels (ã, õ, ãe, ão)', advice: 'Let the air escape through both your nose and mouth at the same time. Imagine humming while pronouncing the vowel.' },
        { sound: 'The "lh" and "nh" sounds', advice: 'Press the flat of your tongue against the roof of your mouth as if saying "l-y" or "n-y" rapidly in a single syllable.' }
      ]
    },
    grammar: {
      overview: 'Portuguese is a Romance language with grammatical gender, extensive verb conjugations across three main groups (-ar, -er, -ir), and unique future subjunctive forms.',
      nounRules: 'Nouns are Masculine (usually ending in -o) or Feminine (usually ending in -a). Plurals are made by adding "-s" at the end of the noun, though endings can modify (-ão turns to -ões).',
      wordOrder: 'Subject-Verb-Object (SVO). Adjectives generally follow the nouns they modify.',
      conjugations: [
        {
          verb: 'ser',
          translation: 'to be (permanent)',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Eu (I)', conjugated: 'sou' },
                { pronoun: 'Tu (You)', conjugated: 'és' },
                { pronoun: 'Ele/Ela (He/She)', conjugated: 'é' },
                { pronoun: 'Nós (We)', conjugated: 'somos' },
                { pronoun: 'Vós (You pl.)', conjugated: 'sois' },
                { pronoun: 'Eles/Elas (They)', conjugated: 'são' }
              ]
            }
          ]
        },
        {
          verb: 'ter',
          translation: 'to have',
          tenses: [
            {
              name: 'Present Tense',
              pronouns: [
                { pronoun: 'Eu (I)', conjugated: 'tenho' },
                { pronoun: 'Tu (You)', conjugated: 'tens' },
                { pronoun: 'Ele/Ela (He/She)', conjugated: 'tem' },
                { pronoun: 'Nós (We)', conjugated: 'temos' },
                { pronoun: 'Vós (You pl.)', conjugated: 'tendes' },
                { pronoun: 'Eles/Elas (They)', conjugated: 'têm' }
              ]
            }
          ]
        }
      ]
    }
  }
};
