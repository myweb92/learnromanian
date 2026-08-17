import { ScenarioContent } from '../types';

export const PREBUILT_SCENARIOS: Record<string, ScenarioContent> = {
  "sc-1": {
    id: "sc-1",
    romanianText: `Mă trezesc la ora 7:30 dimineața în apartamentul meu mic din București. Soarele strălucește prin fereastă. Beau un pahar cu apă și fac o cafea. În România, cafeaua este foarte importantă! La micul dejun, mănânc iaurt cu muesli și pâine proaspătă cu unt și gem. Uneori mănânc un covrig de la brutăria de jos. La 8:30 ies din casă. Iau metroul pentru că este rapid și ieftin. În metrou, de obicei ascult podcasturi în română ca să exersez limba.

Lucrez la birou până la ora 17:00. În pauza de prânz, mănânc cu colegii mei. Astăzi am mâncat sarmale și mămăligă. Mâncarea a fost delicioasă! După serviciu, merg la parc (Parcul Herăstrău). Mă plimb 30 de minute și mă bucur de aerul curat.

Seara, mă întâlnesc cu prietena mea Ana la o terasă. Bem o bere rece și vorbim despre viață. Ea vorbește încet ca să înțeleg mai bine. Când ajung acasă, gătesc ceva simplu – poate pui la grătar cu legume și salată. După cină, mă uit la un serial românesc la televizor („Las Fierbinți” sau „Umbre”) cu subtitrare în română. Înainte de culcare, scriu în jurnalul meu ce am învățat azi. Apoi citesc câteva pagini dintr-o carte ușoară în română. Îmi place foarte mult să trăiesc în România. Oamenii sunt prietenoși și mâncarea este extraordinară!`,
    englishText: `I wake up at 7:30 in the morning in my small apartment in Bucharest. The sun is shining through the window. I drink a glass of water and make coffee. In Romania, coffee is very important! For breakfast, I eat yogurt with muesli and some fresh bread with butter and jam. Sometimes I eat a pretzel (covrig) from the bakery downstairs. At 8:30 I leave the house. I take the metro because it's fast and cheap. In the metro, I usually listen to Romanian podcasts to practice the language.

I work in an office until 5 PM. During the lunch break, I eat with my colleagues. Today we had cabbage rolls (sarmale) and polenta (mămăligă). The food was delicious! After work, I go to the park (Herăstrău Park). I walk for 30 minutes and enjoy the fresh air.

In the evening, I meet my friend Ana at a terrace. We drink a cold beer and talk about life. She speaks slowly so I can understand better. When I come home, I cook something simple – maybe grilled chicken with vegetables and salad. After dinner, I watch a Romanian series on TV (“Las Fierbinți” or “Umbre”) with Romanian subtitles. Before sleeping, I write in my journal what I learned today. Then I read a few pages of an easy book in Romanian. I really like living in Romania. The people are friendly and the food is amazing!`,
    paragraphs: [
      {
        romanian: "Mă trezesc la ora 7:30 dimineața în apartamentul meu mic din București. Soarele strălucește prin fereastră. Beau un pahar cu apă și fac o cafea. În România, cafeaua este foarte importantă!",
        english: "I wake up at 7:30 in the morning in my small apartment in Bucharest. The sun is shining through the window. I drink a glass of water and make coffee. In Romania, coffee is very important!"
      },
      {
        romanian: "La micul dejun, mănânc iaurt cu muesli și pâine proaspătă cu unt și gem. Uneori mănânc un covrig de la brutăria de jos.",
        english: "For breakfast, I eat yogurt with muesli and some fresh bread with butter and jam. Sometimes I eat a covrig from the bakery downstairs."
      },
      {
        romanian: "La 8:30 ies din casă. Iau metroul pentru că este rapid și ieftin. În metrou, de obicei ascult podcasturi în română ca să exersez limba.",
        english: "At 8:30 I leave the house. I take the metro because it's fast and cheap. In the metro, I usually listen to Romanian podcasts to practice the language."
      },
      {
        romanian: "Lucrez la birou până la ora 17:00. În pauza de prânz, mănânc cu colegii mei. Astăzi am mâncat sarmale și mămăligă. Mâncarea a fost delicioasă!",
        english: "I work in an office until 5 PM. During the lunch break, I eat with my colleagues. Today we had sarmale and mămăligă. The food was delicious!"
      },
      {
        romanian: "După serviciu, merg la parc (Parcul Herăstrău). Mă plimb 30 de minute și mă bucur de aerul curat.",
        english: "After work, I go to the park (Parcul Herăstrău). I walk for 30 minutes and enjoy the fresh air."
      },
      {
        romanian: "Seara, mă întâlnesc cu prietena mea Ana la o terasă. Bem o bere rece și vorbim despre viață. Ea vorbește încet ca să înțeleg mai bine.",
        english: "In the evening, I meet my friend Ana at a terrace. We drink a cold beer and talk about life. She speaks slowly so I can understand better."
      },
      {
        romanian: "Când ajung acasă, gătesc ceva simplu – poate pui la grătar cu legume și salată. După cină, mă uit la un serial românesc la televizor („Las Fierbinți” sau „Umbre”) cu subtitrare în română.",
        english: "When I come home, I cook something simple – maybe grilled chicken with vegetables and salad. After dinner, I watch a Romanian series on TV (“Las Fierbinți” or “Umbre”) with Romanian subtitles."
      },
      {
        romanian: "Înainte de culcare, scriu în jurnalul meu ce am învățat azi. Apoi citesc câteva pagini dintr-o carte ușoară în română.",
        english: "Before sleeping, I write in my journal what I learned today. Then I read a few pages of an easy book in Romanian."
      },
      {
        romanian: "Îmi place foarte mult să trăiesc în România. Oamenii sunt prietenoși și mâncarea este extraordinară!",
        english: "I really like living in Romania. The people are friendly and the food is amazing!"
      }
    ],
    vocabulary: [
      {
        romanian: "Mă trezesc",
        english: "I wake up",
        context: "Mă trezesc la ora 7:30 dimineața în fiecare zi.",
        contextTranslation: "I wake up at 7:30 in the morning every day."
      },
      {
        romanian: "covrig",
        english: "pretzel / Romanian circular bread",
        context: "Uneori mănânc un covrig cald cu susan.",
        contextTranslation: "Sometimes I eat a hot pretzel with sesame."
      },
      {
        romanian: "brutărie",
        english: "bakery",
        context: "Merg la brutărie de jos să cumpăr pâine proaspătă.",
        contextTranslation: "I go to the bakery downstairs to buy fresh bread."
      },
      {
        romanian: "sarmale",
        english: "cabbage rolls (traditional Romanian dish)",
        context: "De Crăciun, bunica pregătește cele mai bune sarmale.",
        contextTranslation: "For Christmas, grandma prepares the best cabbage rolls."
      },
      {
        romanian: "mămăligă",
        english: "polenta (boiled cornmeal)",
        context: "Mâncăm mămăligă fierbinte cu brânză și smântână.",
        contextTranslation: "We eat hot polenta with cheese and sour cream."
      },
      {
        romanian: "lucrez",
        english: "I work",
        context: "Lucrez ca programator în centrul orașului.",
        contextTranslation: "I work as a programmer in the city center."
      },
      {
        romanian: "seara",
        english: "in the evening / the evening",
        context: "Seara, mă plimb prin Centrul Vechi cu prietenii.",
        contextTranslation: "In the evening, I walk in the Old Town with friends."
      },
      {
        romanian: "încet",
        english: "slowly / quietly",
        context: "Ea vorbește încet pentru că eu sunt începător.",
        contextTranslation: "She speaks slowly because I am a beginner."
      },
      {
        romanian: "mancare",
        english: "food",
        context: "Mâncarea din România este foarte gustoasă.",
        contextTranslation: "The food in Romania is very tasty."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "La ce oră se trezește naratorul dimineața?",
        options: [
          "La ora 6:30",
          "La ora 7:30",
          "La ora 8:30",
          "La ora 9:00"
        ],
        correctAnswerIndex: 1,
        explanation: "Naratorul spune: 'Mă trezesc la ora 7:30 dimineața.'",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "Ce bea naratorul dimineața?",
        options: [
          "Un ceai cald",
          "Un pahar cu suc",
          "Un pahar cu apă și o cafea",
          "Doar o bere rece"
        ],
        correctAnswerIndex: 2,
        explanation: "Naratorul spune: 'Beau un pahar cu apă și fac o cafea.'",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "De unde își cumpără uneori un covrig?",
        options: [
          "De la supermarket",
          "De la brutăria de jos",
          "De la birou",
          "De la metrou"
        ],
        correctAnswerIndex: 1,
        explanation: "Naratorul menționează: 'Uneori mănânc un covrig de la brutăria de jos.'",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "De ce ia metroul la ora 8:30?",
        options: [
          "Pentru că plouă afară",
          "Pentru că nu are mașină",
          "Pentru că este rapid și ieftin",
          "Pentru că vrea să asculte muzică"
        ],
        correctAnswerIndex: 2,
        explanation: "Naratorul scrie: 'Iau metroul pentru că este rapid și ieftin.'",
        type: "multiple-choice"
      },
      {
        id: "q5",
        question: "Ce a mâncat naratorul la prânz împreună cu colegii?",
        options: [
          "Pizza și paste",
          "Pui la grătar cu salată",
          "Sarmale și mămăligă",
          "Iogurt cu muesli"
        ],
        correctAnswerIndex: 2,
        explanation: "Textul menționează: 'Astăzi am mâncat sarmale și mămăligă.'",
        type: "multiple-choice"
      },
      {
        id: "q6",
        question: "În care parc se plimbă naratorul după serviciu?",
        options: [
          "Parcul Cișmigiu",
          "Parcul Tineretului",
          "Parcul Herăstrău",
          "Parcul Carol"
        ],
        correctAnswerIndex: 2,
        explanation: "Scrie în text: 'După serviciu, merg la parc (Parcul Herăstrău).'",
        type: "multiple-choice"
      },
      {
        id: "q7",
        question: "Cum vorbește prietena lui Ana?",
        options: [
          "Ea vorbește foarte repede",
          "Ea nu vorbește în română",
          "Ea vorbește încet ca naratorul să înțeleagă mai bine",
          "Ea vorbește doar în engleză"
        ],
        correctAnswerIndex: 2,
        explanation: "Textul spune: 'Ea vorbește încet ca să înțeleg mai bine.'",
        type: "multiple-choice"
      },
      {
        id: "q8",
        question: "La micul dejun, mănânc iaurt cu muesli și pâine proaspătă cu unt și ____.",
        options: [
          "gem",
          "brânză",
          "salam",
          "sarmale"
        ],
        correctAnswerIndex: 0,
        explanation: "Propoziția completă este: 'Mănânc iaurt cu muesli și pâine proaspătă cu unt și gem.'",
        type: "fill-in-the-blank"
      }
    ]
  },
  "sc-2": {
    id: "sc-2",
    romanianText: `Bună dimineața! Merg la brutăria Luca din colț ca să cumpăr ceva cald de mâncare. Miroase minunat a pâine proaspătă și covrigi calzi! 
— Bună dimineața! Cu ce vă pot ajuta? mă întreabă vânzătoarea zâmbitoare.
— Bună dimineața! Aș dori doi covrigi calzi, vă rog.
— De care doriți? Avem covrigi simpli cu sare, covrigi cu mac sau covrigi cu susan.
— Aș dori un covrig cu mac și unul cu susan, vă rog. Sunt proaspeți?
— Da, chiar acum i-am scos din cuptor. Mai doriți și altceva? Avem și merdele cu brânză, proaspăt coapte.
— Da, vă rog, o merdea cu brânză dulce și stafide, și o sticlă de iaurt de băut.
— Desigur. În total este paisprezece lei. Plătiți cu cardul sau numerar?
— Cu cardul, vă rog. Apropiați cardul de aparat, mulțumesc!
— Poftiți comanda. Să aveți o zi bună!
— Mulțumesc la fel! La revedere!`,
    englishText: `Good morning! I go to the Luca bakery on the corner to buy something hot to eat. It smells wonderful of fresh bread and hot pretzels!
— Good morning! How can I help you? the smiling saleswoman asks me.
— Good morning! I would like two hot pretzels, please.
— Which kind would you like? We have plain salted pretzels, poppyseed pretzels, or sesame seeds pretzels.
— I would like one with poppy seeds and one with sesame, please. Are they fresh?
— Yes, we just took them out of the oven. Would you like anything else? We also have cheese pastries (merdele), freshly baked.
— Yes, please, one cheese pastry with sweet cheese and raisins, and a bottle of drinking yogurt.
— Of course. The total is fourteen lei. Are you paying by card or cash?
— By card, please. Step the card on the machine, thank you!
— Here is your order. Have a nice day!
— Thank you, same to you! Goodbye!`,
    paragraphs: [
      {
        romanian: "Bună dimineața! Merg la brutăria Luca din colț ca să cumpăr ceva cald de mâncare. Miroase minunat a pâine proaspătă și covrigi calzi!",
        english: "Good morning! I go to the Luca bakery on the corner to buy something hot to eat. It smells wonderful of fresh bread and hot pretzels!"
      },
      {
        romanian: "— Bună dimineața! Cu ce vă pot ajuta? mă întreabă vânzătoarea zâmbitoare.",
        english: "— Good morning! How can I help you? the smiling saleswoman asks me."
      },
      {
        romanian: "— Bună dimineața! Aș dori doi covrigi calzi, vă rog.",
        english: "— Good morning! I would like two hot pretzels, please."
      },
      {
        romanian: "— De care doriți? Avem covrigi simpli cu sare, covrigi cu mac sau covrigi cu susan.",
        english: "— Which kind would you like? We have plain salted pretzels, poppyseed pretzels, or sesame seeds pretzels."
      },
      {
        romanian: "— Aș dori un covrig cu mac și unul cu susan, vă rog. Sunt proaspeți?",
        english: "— I would like one with poppy seeds and one with sesame, please. Are they fresh?"
      },
      {
        romanian: "— Da, chiar acum i-am scos din cuptor. Mai doriți și altceva? Avem și merdele cu brânză, proaspăt coapte.",
        english: "— Yes, we just took them out of the oven. Would you like anything else? We also have cheese pastries (merdele), freshly baked."
      },
      {
        romanian: "— Da, vă rog, o merdea cu brânză dulce și stafide, și o sticlă de iaurt de băut.",
        english: "— Yes, please, one cheese pastry with sweet cheese and raisins, and a bottle of drinking yogurt."
      },
      {
        romanian: "— Desigur. În total este paisprezece lei. Plătiți cu cardul sau numerar?",
        english: "— Of course. The total is fourteen lei. Are you paying by card or cash?"
      },
      {
        romanian: "— Cu cardul, vă rog. Apropiați cardul de aparat, mulțumesc!",
        english: "— By card, please. Step the card on the machine, thank you!"
      },
      {
        romanian: "— Poftiți comanda. Să aveți o zi bună! — Mulțumesc la fel! La revedere!",
        english: "— Here is your order. Have a nice day! — Thank you, same to you! Goodbye!"
      }
    ],
    vocabulary: [
      {
        romanian: "colț",
        english: "corner",
        context: "Magazinul este chiar la colțul străzii.",
        contextTranslation: "The shop is right at the corner of the street."
      },
      {
        romanian: "mac",
        english: "poppyseed",
        context: "Mie îmi plac foarte mult covrigii cu mac.",
        contextTranslation: "I really like pretzels with poppyseeds."
      },
      {
        romanian: "susan",
        english: "sesame seed",
        context: "Poți cumpăra o chiflă cu susan de la patiserie.",
        contextTranslation: "You can buy a sesame seed bun from the pastry shop."
      },
      {
        romanian: "cuptor",
        english: "oven",
        context: "Cozonacul este în cuptor.",
        contextTranslation: "The holiday bread is in the oven."
      },
      {
        romanian: "merdea",
        english: "traditional savory flaky pastry filled with cheese",
        context: "Am mâncat o merdea fierbinte cu brânză sărată.",
        contextTranslation: "I ate a hot cheese pastry with salty cheese."
      },
      {
        romanian: "iaurt de băut",
        english: "drinking yogurt",
        context: "Beau un iaurt de băut dimineața pentru energie.",
        contextTranslation: "I drink a drinking yogurt in the morning for energy."
      },
      {
        romanian: "numerar",
        english: "cash",
        context: "Nu am cardul la mine, plătesc numerar.",
        contextTranslation: "I do not have my card with me, I will pay cash."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "La care brutărie merge naratorul în acest scenariu?",
        options: [
          "La Mega Image",
          "La brutăria Luca",
          "La o patiserie franceză",
          "La un magazin mixt"
        ],
        correctAnswerIndex: 1,
        explanation: "Naratorul menționează că merge la 'brutăria Luca din colț'.",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "Ce fel de covrigi dorește naratorul să cumpere?",
        options: [
          "Doi covrigi simpli cu sare",
          "Un covrig cu mac și unul cu susan",
          "Trei covrigi cu ciocolată",
          "Un covrig mare cu cașcaval"
        ],
        correctAnswerIndex: 1,
        explanation: "Naratorul comandă: 'un covrig cu mac și unul cu susan'.",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "De unde au fost scoși covrigii?",
        options: [
          "Din frigider",
          "Din cuptor",
          "Din depozit",
          "Din vitrină"
        ],
        correctAnswerIndex: 1,
        explanation: "Vânzătoarea zice: 'Da, chiar acum i-am scos din cuptor.'",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "Ce alt patiserie dulce cumpără naratorul?",
        options: [
          "O gogoașă cu ciocolată",
          "O plăcintă cu mere",
          "O merdea cu brânză dulce și stafide",
          "Un cozonac mare"
        ],
        correctAnswerIndex: 2,
        explanation: "Naratorul comandă 'o merdea cu brânză dulce și stafide'.",
        type: "multiple-choice"
      },
      {
        id: "q5",
        question: "Cât costă în total întreaga comandă?",
        options: [
          "Zece lei",
          "Paisprezece lei",
          "Douăzeci de lei",
          "Cinci lei"
        ],
        correctAnswerIndex: 1,
        explanation: "Vânzătoarea zice: 'În total este paisprezece lei.'",
        type: "multiple-choice"
      },
      {
        id: "q6",
        question: "Prin ce metodă de plată alege naratorul să plătească?",
        options: [
          "Cu numerar",
          "Cu cardul",
          "Cu telefonul prin transfer",
          "Cu bonuri de masă"
        ],
        correctAnswerIndex: 1,
        explanation: "Naratorul răspunde: 'Cu cardul, vă rog.'",
        type: "multiple-choice"
      },
      {
        id: "q7",
        question: "Completează spațiul liber: 'Avem covrigi simpli cu sare, covrigi cu mac sau covrigi cu ____.'",
        options: [
          "stafide",
          "ciocolată",
          "susan",
          "brânză"
        ],
        correctAnswerIndex: 2,
        explanation: "Opțiunile de covrigi amintite sunt cu sare, mac și susan.",
        type: "fill-in-the-blank"
      },
      {
        id: "q8",
        question: "Plătiți cu cardul sau ____?",
        options: [
          "numerar",
          "euro",
          "bomboane",
          "aplicație"
        ],
        correctAnswerIndex: 0,
        explanation: "Întrebarea standard la casă este: 'Plătiți cu cardul sau numerar?'",
        type: "fill-in-the-blank"
      }
    ]
  },
  "sc-11": {
    id: "sc-11",
    romanianText: `La restaurantul „La Plăcinte” din București, masa este pregătită pentru o cină tradițională românească.
— Bună seara! Aveți o masă pentru două persoane? întreb eu pe ospătar.
— Bună seara! Da, avem o masă liberă lângă geam. Poftiți, vă rog! Iată meniurile.
— Mulțumim. Pentru început, am dori să bem o afinată tradițională și o sticlă de apă plată.
— Imediat vă aduc băuturile. V-ați decis ce doriți de mâncare?
— Ca fel principal, eu doresc o porție de sarmale în foi de varză cu mămăliguță caldă și smântână. Se aduce și ardei iute?
— Desigur, porția conține patru sarmale mari, mămăligă, smântână și un ardei iute proaspăt sau murat.
— Perfect! Iar prietenul meu dorește tochitură moldovenească cu ou ochi și brânză de burduf.
— Excelent! Este o alegere foarte populară. Mâncarea va dura aproximativ douăzeci de minute.
— Mulțumim frumos!`,
    englishText: `At the "La Plăcinte" restaurant in Bucharest, the table is set for a traditional Romanian dinner.
— Good evening! Do you have a table for two people? I ask the waiter.
— Good evening! Yes, we have a free table next to the window. Please, come in! Here are the menus.
— Thank you. To start with, we would like to drink a traditional blueberry liqueur (afinată) and a bottle of still water.
— I will bring you the drinks immediately. Have you decided what you would like to eat?
— As a main course, I want a portion of cabbage rolls (sarmale) in cabbage leaves with warm polenta and sour cream. Does it come with hot pepper?
— Of course, the portion contains four large cabbage rolls, polenta, sour cream, and a fresh or pickled hot pepper.
— Perfect! And my friend would like Moldavian stew (tochitură) with a fried egg and salty sheep's cheese (brânză de burduf).
— Excellent! It is a very popular choice. The food will take approximately twenty minutes.
— Thank you very much!`,
    paragraphs: [
      {
        romanian: "La restaurantul „La Plăcinte” din București, masa este pregătită pentru o cină tradițională românească.",
        english: "At the \"La Plăcinte\" restaurant in Bucharest, the table is set for a traditional Romanian dinner."
      },
      {
        romanian: "— Bună seara! Aveți o masă pentru două persoane? întreb eu pe ospătar.",
        english: "— Good evening! Do you have a table for two people? I ask the waiter."
      },
      {
        romanian: "— Bună seara! Da, avem o masă liberă lângă geam. Poftiți, vă rog! Iată meniurile.",
        english: "— Good evening! Yes, we have a free table next to the window. Please, come in! Here are the menus."
      },
      {
        romanian: "— Mulțumim. Pentru început, am dori să bem o afinată tradițională și o sticlă de apă plată.",
        english: "— Thank you. To start with, we would like to drink a traditional blueberry liqueur (afinată) and a bottle of still water."
      },
      {
        romanian: "— Imediat vă aduc băuturile. V-ați decis ce doriți de mâncare?",
        english: "— I will bring you the drinks immediately. Have you decided what you would like to eat?"
      },
      {
        romanian: "— Ca fel principal, eu doresc o porție de sarmale în foi de varză cu mămăliguță caldă și smântână. Se aduce și ardei iute?",
        english: "— As a main course, I want a portion of cabbage rolls (sarmale) in cabbage leaves with warm polenta and sour cream. Does it come with hot pepper?"
      },
      {
        romanian: "— Desigur, porția conține patru sarmale mari, mămăligă, smântână și un ardei iute proaspăt sau murat.",
        english: "— Of course, the portion contains four large cabbage rolls, polenta, sour cream, and a fresh or pickled hot pepper."
      },
      {
        romanian: "— Perfect! Iar prietenul meu dorește tochitură moldovenească cu ou ochi și brânză de burduf.",
        english: "— Perfect! And my friend would like Moldavian stew (tochitură) with a fried egg and salty sheep's cheese (brânză de burduf)."
      },
      {
        romanian: "— Excelent! Este o alegere foarte populară. Mâncarea va dura aproximativ douăzeci de minute. — Mulțumim frumos!",
        english: "— Excellent! It is a very popular choice. The food will take approximately twenty minutes. — Thank you very much!"
      }
    ],
    vocabulary: [
      {
        romanian: "afinată",
        english: "traditional sweet blueberry alcoholic liqueur",
        context: "Înainte de cină, am băut o afinată de casă aromată.",
        contextTranslation: "Before dinner, I drank a tasty homemade blueberry liqueur."
      },
      {
        romanian: "pahar",
        english: "glass",
        context: "Ospătarul a umplut paharul cu apă plată.",
        contextTranslation: "The waiter filled the glass with still water."
      },
      {
        romanian: "foi de varză",
        english: "cabbage leaves (used to wrap sarmale)",
        context: "Sarmalele se învelesc în foi de varză murată.",
        contextTranslation: "Sarmale are wrapped in pickled cabbage leaves."
      },
      {
        romanian: "smântână",
        english: "sour cream (thick and rich, central to Romanian cuisine)",
        context: "Îmi place să pun multă smântână peste sarmale.",
        contextTranslation: "I like to put a lot of sour cream on cabbage rolls."
      },
      {
        romanian: "tochitură",
        english: "traditional Romanian pork stew",
        context: "Tochitura moldovenească se servește cu mămăligă fierbinte.",
        contextTranslation: "Moldavian stew is served with hot polenta."
      },
      {
        romanian: "ardei iute",
        english: "hot chili pepper",
        context: "Mănânc ciorba cu un pic de ardei iute.",
        contextTranslation: "I eat the soup with a bit of hot chili pepper."
      },
      {
        romanian: "ou ochi",
        english: "sunny side up fried egg",
        context: "La micul dejun mănânc două ouă ochiuri.",
        contextTranslation: "For breakfast I eat two sunny side up fried eggs."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Cum se numește restaurantul unde are loc scena?",
        options: [
          "Caru' cu Bere",
          "La Plăcinte",
          "Hanul lui Manuc",
          "Pizzeria Trattoria"
        ],
        correctAnswerIndex: 1,
        explanation: "Textul notează: 'La restaurantul „La Plăcinte” din București'.",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "Pentru câte persoane dorește naratorul o masă?",
        options: [
          "Pentru o singură persoană",
          "Pentru două persoane",
          "Pentru o familie mare",
          "Pentru patru persoane"
        ],
        correctAnswerIndex: 1,
        explanation: "Naratorul întreabă: 'Aveți o masă pentru două persoane?'",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "Ce băutură alcoolică tradițională comandă ei pentru început?",
        options: [
          "Țuică",
          "Afinată",
          "Palincă",
          "Vin roșu"
        ],
        correctAnswerIndex: 1,
        explanation: "Ei comandă: 'am dori să bem o afinată tradițională'.",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "Ce dorește naratorul ca fel principal?",
        options: [
          "Pui la cuptor cu cartofi",
          "O tochitură moldovenească",
          "O porție de sarmale în foi de varză",
          "Mici cu cartofi prăjiți"
        ],
        correctAnswerIndex: 2,
        explanation: "El precizează: 'eu doresc o porție de sarmale în foi de varză cu mămăliguță caldă'.",
        type: "multiple-choice"
      },
      {
        id: "q5",
        question: "Câte sarmale mari conține o porție standard?",
        options: [
          "Două sarmale",
          "Trei sarmale",
          "Patru sarmale mari",
          "Cinci sarmale"
        ],
        correctAnswerIndex: 2,
        explanation: "Ospătarul explică: 'da, porția conține patru sarmale mari'.",
        type: "multiple-choice"
      },
      {
        id: "q6",
        question: "Ce fel principal comandă prietenul naratorului?",
        options: [
          "Sarmale cu orez",
          "Tochitură moldovenească",
          "Ciorbă de burtă",
          "Papanași"
        ],
        correctAnswerIndex: 1,
        explanation: "Textul spune: 'prietenul meu dorește tochitură moldovenească'.",
        type: "multiple-choice"
      },
      {
        id: "q7",
        question: "În ce fel de foi sunt învelite sarmalele comandate?",
        options: [
          "foi de viță",
          "foi de hârtie",
          "foi de varză",
          "foi de clătită"
        ],
        correctAnswerIndex: 2,
        explanation: "Comanda constă în 'sarmale în foi de varză'.",
        type: "fill-in-the-blank"
      },
      {
        id: "q8",
        question: "Se aduce și ardei ____?",
        options: [
          "iute",
          "dulce",
          "roșu",
          "grăsan"
        ],
        correctAnswerIndex: 0,
        explanation: "Sarmalele tradiționale sunt adesea servite cu ardei 'iute'.",
        type: "fill-in-the-blank"
      }
    ]
  },
  "sc-23": {
    id: "sc-23",
    romanianText: `După ce am terminat sarmalele delicioase, vine timpul pentru cel mai iubit desert românesc.
— Ați mâncat tot, văd că v-a plăcut! dorește cineva un desert la sfârșit? întreabă chelnerul vesel.
— Cu siguranță! Nu putem pleca fără să mâncăm legendarii papanași.
— Excelent! Cum doriți să fie papanașii? Avem opțiunea cu dulceață de afine sau cu dulceață de vișine.
— Eu doresc cu dulceață de afine, vă rog. Și neapărat cu multă smântână!
— Desigur. Porția este foarte mare, are doi papanași rumeni și pufoși. Doriți câte o farfurie pentru fiecare sau doriți să îi împărțiți?
— Vom împărți o singură porție, vă rog, pentru că suntem deja destul de sătui. De asemenea, aduceți-ne și două espresso scurte.
— Perfect! În zece minute vor fi gata papanașii fierbinți.
— Mulțumim, abia așteptăm!`,
    englishText: `After finishing the delicious cabbage rolls, it is time for the most beloved Romanian dessert.
— You ate everything, I see you liked it! Does anyone want a dessert at the end? the cheerful waiter asks.
— For sure! We cannot leave without eating the legendary papanași.
— Excellent! How would you like the papanași? We have the option with blueberry jam or sour cherry jam.
— I want with blueberry jam, please. And definitely with lots of sour cream!
— Of course. The portion is very large, it has two golden-brown and fluffy papanași. Would you like a plate for each of you or do you want to share them?
— We will share a single portion, please, because we are already quite full. Also, bring us two short espressos.
— Perfect! In ten minutes the hot papanași will be ready.
— Thank you, we can't wait!`,
    paragraphs: [
      {
        romanian: "După ce am terminat sarmalele delicioase, vine timpul pentru cel mai iubit desert românesc.",
        english: "After finishing the delicious cabbage rolls, it is time for the most beloved Romanian dessert."
      },
      {
        romanian: "— Ați mâncat tot, văd că v-a plăcut! dorește cineva un desert la sfârșit? întreabă chelnerul vesel.",
        english: "— You ate everything, I see you liked it! Does anyone want a dessert at the end? the cheerful waiter asks."
      },
      {
        romanian: "— Cu siguranță! Nu putem pleca fără să mâncăm legendarii papanași.",
        english: "— For sure! We cannot leave without eating the legendary papanași."
      },
      {
        romanian: "— Excelent! Cum doriți să fie papanașii? Avem opțiunea cu dulceață de afine sau cu dulceață de vișine.",
        english: "— Excellent! How would you like the papanași? We have the option with blueberry jam or sour cherry jam."
      },
      {
        romanian: "— Eu doresc cu dulceață de afine, vă rog. Și neapărat cu multă smântână!",
        english: "— I want with blueberry jam, please. And definitely with lots of sour cream!"
      },
      {
        romanian: "— Desigur. Porția este foarte mare, are doi papanași rumeni și pufoși.",
        english: "— Of course. The portion is very large, it has two golden-brown and fluffy papanași."
      },
      {
        romanian: "— Doriți câte o farfurie pentru fiecare sau doriți să îi împărțiți? — Vom împărți o singură porție, vă rog.",
        english: "— Would you like a plate for each of you or do you want to share them? — We will share a single portion, please."
      },
      {
        romanian: "— De asemenea, aduceți-ne și două espresso scurte. — Perfect! În zece minute vor fi gata.",
        english: "— Also, bring us two short espressos. — Perfect! In ten minutes they will be ready."
      }
    ],
    vocabulary: [
      {
        romanian: "desert",
        english: "dessert",
        context: "Supa a fost excelentă, dar desertul meu preferat e tarta cu fructe.",
        contextTranslation: "The soup was excellent, but my favorite dessert is the fruit tart."
      },
      {
        romanian: "papanași",
        english: "Romanian fried cheese donuts topped with sour cream and jam",
        context: "Am comandat o porție uriașă de papanași calzi cu afine.",
        contextTranslation: "I ordered a giant portion of hot papanași with blueberries."
      },
      {
        romanian: "dulceață",
        english: "jam / sweet fruit preserves",
        context: "Bunicul face o dulceață minunată de prune.",
        contextTranslation: "Grandpa makes a wonderful plum jam."
      },
      {
        romanian: "afine",
        english: "blueberries",
        context: "Am cules afine din munții Bucegi.",
        contextTranslation: "I picked blueberries in the Bucegi mountains."
      },
      {
        romanian: "vișine",
        english: "sour cherries",
        context: "Dulceața de vișine este un pic acrișoară și gustoasă.",
        contextTranslation: "The sour cherry jam is a bit tart and delicious."
      },
      {
        romanian: "rumeni",
        english: "golden-brown / blushed",
        context: "Coacem papanașii până devin rumeni și crocanți.",
        contextTranslation: "We cook the papanași until they become golden-brown and crispy."
      },
      {
        romanian: "sătui",
        english: "full / satisfied (plated/fed)",
        context: "Suntem deja foarte sătui, nu mai putem mânca nimic.",
        contextTranslation: "We are already very full, we cannot eat anything anymore."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Care este desertul menționat ca fiind cel mai iubit în România?",
        options: [
          "Clătite cu ciocolată",
          "Papanași",
          "Amandine",
          "Plăcintă cu dovleac"
        ],
        correctAnswerIndex: 1,
        explanation: "Textul îl numește pe papanași 'cel mai iubit desert românesc'.",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "Ce variante de dulceață oferă restaurantul pentru papanași?",
        options: [
          "Dulceață de afine sau dulceață de vișine",
          "Dulceață de prune sau dulceață de caise",
          "Miere de albine sau sos de ciocolată",
          "Dulceață de zmeură sau gutui"
        ],
        correctAnswerIndex: 0,
        explanation: "Chelnerul zice: 'Avem opțiunea cu dulceață de afine sau cu dulceață de vișine.'",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "Ce fel de dulceață alege naratorul în final?",
        options: [
          "Dulceață de vișine",
          "Dulceață de afine",
          "Ciocolată caldă",
          "Nu vrea dulceață"
        ],
        correctAnswerIndex: 1,
        explanation: "Naratorul spune: 'Eu doresc cu dulceață de afine, vă rog.'",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "În afară de dulceață, ce sos este absolut esențial pe papanași?",
        options: [
          "Sos caramel",
          "Smântână din abundență",
          "Vanilie călduță",
          "Mustar"
        ],
        correctAnswerIndex: 1,
        explanation: "Naratorul cere: 'Și neapărat cu multă smântână!'",
        type: "multiple-choice"
      },
      {
        id: "q5",
        question: "Câți papanași conține o porție mare în general?",
        options: [
          "Un singur papanaș",
          "Doi papanași rumeni",
          "Trei papanași mici",
          "Patru papanași"
        ],
        correctAnswerIndex: 1,
        explanation: "Ospătarul descrie: 'are doi papanași rumeni și pufoși.'",
        type: "multiple-choice"
      },
      {
        id: "q6",
        question: "De ce decid oaspeții să împartă o singură porție?",
        options: [
          "Pentru că este prea scump",
          "Pentru că sunt deja destul de sătui",
          "Pentru că nu le place mult zahăr",
          "Pentru că nu au timp de mâncat"
        ],
        correctAnswerIndex: 1,
        explanation: "Ei spun: 'Vom împărți o singură porție, vă rog, pentru că suntem deja destul de sătui.'",
        type: "multiple-choice"
      },
      {
        id: "q7",
        question: "Ce băuturi calde mai comandă oaspeții odată cu papanașii?",
        options: [
          "Ceai de mentă",
          "Bere rece",
          "Două espresso scurte",
          "Cappuccino mare"
        ],
        correctAnswerIndex: 2,
        explanation: "Ei adaugă: 'De asemenea, aduceți-ne și două espresso scurte.'",
        type: "multiple-choice"
      },
      {
        id: "q8",
        question: "Eu doresc cu dulceață de afine, vă rog. Și neapărat cu multă ____!",
        options: [
          "smântână",
          "apă",
          "pâine",
          "sare"
        ],
        correctAnswerIndex: 0,
        explanation: "Papanașii excellează cu sos de 'smântână' grasă.",
        type: "fill-in-the-blank"
      }
    ]
  },
  "sc-26": {
    id: "sc-26",
    romanianText: `La telefon, negociez detaliile închirierii unui apartament în inima Transilvaniei, în orașul studențesc Cluj-Napoca.
— Bună ziua! Sun în legătură cu anunțul pentru apartamentul cu două camere de pe strada Horea. Mai este disponibil?
— Bună ziua! Da, apartamentul este disponibil. Este renovat recent, complet mobilat și utilat modern.
— Sună foarte bine. Îmi puteți spune care este chiria lunară și ce garanție solicitați?
— Chiria este de patru sute cincizeci de euro pe lună, iar ca garanție cerem echivalentul a două luni de chirie.
— Am înțeles. Cheltuielile cu utilitățile sunt mari în timpul iernii? Apartamentul are centrală proprie pe gaz?
— Da, are centrală termică proprie, izolație termică exterioară excelentă și ferestre termopan. Facturile sunt destul de mici, în jur de trei sute de lei iarna.
— Perfect. Când se poate viziona apartamentul? Aș dori să îl văd mâine după-amiază, dacă se poate.
— Sigur, mâine la ora șaptesprezece este excelent. Ne întâlnim în fața blocului.
— Super. Ne vedem mâine atunci! Mulțumesc și o zi bună!
— O zi bună, pe mâine! La revedere!`,
    englishText: `On the phone, I negotiate the details of renting an apartment in the heart of Transylvania, in the student city of Cluj-Napoca.
— Hello! I am calling regarding the ad for the two-room apartment on Horea Street. Is it still available?
— Hello! Yes, the apartment is available. It is recently renovated, fully furnished, and modernly equipped.
— Sounds very good. Can you tell me what the monthly rent is and what security deposit you require?
— The rent is four hundred fifty euros per month, and as a deposit, we require the equivalent of two months' rent.
— I see. Are utility costs high during winter? Does the apartment have its own gas boiler?
— Yes, it has its own heating boiler, excellent external thermal insulation, and double-glazed windows. The bills are quite low, around three hundred lei in winter.
— Perfect. When can the apartment be viewed? I would like to see it tomorrow afternoon, if possible.
— Sure, tomorrow at 5 PM is excellent. We will meet in front of the building.
— Super. See you tomorrow then! Thank you and have a nice day!
— Have a nice day, see you tomorrow! Goodbye!`,
    paragraphs: [
      {
        romanian: "La telefon, negociez detaliile închirierii unui apartament în inima Transilvaniei, în orașul studențesc Cluj-Napoca.",
        english: "On the phone, I negotiate the details of renting an apartment in the heart of Transylvania, in the student city of Cluj-Napoca."
      },
      {
        romanian: "— Bună ziua! Sun în legătură cu anunțul pentru apartamentul cu două camere de pe strada Horea. Mai este disponibil?",
        english: "— Hello! I am calling regarding the ad for the two-room apartment on Horea Street. Is it still available?"
      },
      {
        romanian: "— Bună ziua! Da, apartamentul este disponibil. Este renovat recent, complet mobilat și utilat modern.",
        english: "— Hello! Yes, the apartment is available. It is recently renovated, fully furnished, and modernly equipped."
      },
      {
        romanian: "— Chiria este de patru sute cincizeci de euro pe lună, iar ca garanție cerem echivalentul a două luni de chirie.",
        english: "— The rent is four hundred fifty euros per month, and as a deposit, we require the equivalent of two months' rent."
      },
      {
        romanian: "— Cheltuielile cu utilitățile sunt mari în timpul iernii? Apartamentul are centrală proprie pe gaz?",
        english: "— Are utility costs high during winter? Does the apartment have its own gas boiler?"
      },
      {
        romanian: "— Da, are centrală termică proprie, izolație termică exterioară excelentă și ferestre termopan. Facturile sunt destul de mici, în jur de trei sute de lei iarna.",
        english: "— Yes, it has its own heating boiler, excellent external thermal insulation, and double-glazed windows. The bills are quite low, around three hundred lei in winter."
      },
      {
        romanian: "— Perfect. Când se poate viziona apartamentul? Aș dori să îl văd mâine după-amiază, dacă se poate.",
        english: "— Perfect. When can the apartment be viewed? I would like to see it tomorrow afternoon, if possible."
      },
      {
        romanian: "— Sigur, mâine la ora șaptesprezece este excelent. Ne întâlnim în fața blocului. — Super. Ne vedem mâine atunci!",
        english: "— Sure, tomorrow at 5 PM is excellent. We will meet in front of the building. — Super. See you tomorrow then!"
      }
    ],
    vocabulary: [
      {
        romanian: "închiriere",
        english: "renting / rental",
        context: "Acest contract de închiriere este semnat pe un an.",
        contextTranslation: "This rental contract is signed for one year."
      },
      {
        romanian: "stradă",
        english: "street",
        context: "Merg pe strada principală spre centru.",
        contextTranslation: "I walk on the main street towards the center."
      },
      {
        romanian: "disponibil",
        english: "available",
        context: "Camera este disponibilă începând cu luna viitoare.",
        contextTranslation: "The room is available starting next month."
      },
      {
        romanian: "chirie",
        english: "rent (as in payment)",
        context: "Plătesc chiria în prima zi a fiecărei luni.",
        contextTranslation: "I pay the rent on the first day of each month."
      },
      {
        romanian: "garanție",
        english: "security deposit",
        context: "Am plătit o garanție de opt sute de euro proprietarului.",
        contextTranslation: "I paid an eight hundred euro security deposit to the owner."
      },
      {
        romanian: "centrală termică",
        english: "heating boiler / climate station unit",
        context: "Am oprit centrala termică pentru că e cald afară.",
        contextTranslation: "I turned off the heating boiler because it is warm outside."
      },
      {
        romanian: "vizionare",
        english: "viewing (an apartment)",
        context: "Am stabilit o vizionare pentru apartament diseară la ora șase.",
        contextTranslation: "I scheduled an apartment viewing tonight at six o'clock."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "În ce oraș din Transilvania dorește naratorul să închirieze apartamentul?",
        options: [
          "Sibiu",
          "Brașov",
          "Cluj-Napoca",
          "Timișoara"
        ],
        correctAnswerIndex: 2,
        explanation: "Naratorul precizează că negociază închirerea 'în orașul studențesc Cluj-Napoca'.",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "Pe ce stradă se află apartamentul cu două camere?",
        options: [
          "Strada Horea",
          "Bulevardul Eroilor",
          "Strada Mihai Viteazu",
          "Aleea Trandafirilor"
        ],
        correctAnswerIndex: 0,
        explanation: "La telefon se menționează: 'de pe strada Horea'.",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "Cât costă chiria lunară a apartamentului?",
        options: [
          "Trei sute de euro",
          "Patru sute cincizeci de euro",
          "Cinci sute de euro",
          "O mie de lei"
        ],
        correctAnswerIndex: 1,
        explanation: "Agentul sau proprietarul precizează: 'Chiria este de patru sute cincizeci de euro pe lună'.",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "Cât se cere garanție pentru închiriere?",
        options: [
          "Echivalentul unei luni de chirie",
          "Echivalentul a două luni de chirie",
          "Trei luni de chirie în avans",
          "Nu se cere garanție"
        ],
        correctAnswerIndex: 1,
        explanation: "Se specifică: 'ca garanție cerem echivalentul a două luni de chirie'.",
        type: "multiple-choice"
      },
      {
        id: "q5",
        question: "De ce sunt facturile de utilități relativ mici iarna în apartament?",
        options: [
          "Pentru că nu se dă drumul la căldură",
          "Datorită centralei termice proprii, izolației exterioare și termopanelor",
          "Pentru că utilitățile sunt subvenționate de primărie",
          "Pentru că blocul este vechi și neîncălzit"
        ],
        correctAnswerIndex: 1,
        explanation: "Proprietarul zice: 'Da, are centrală termică proprie, izolație termică exterioară excelentă și ferestre termopan.'",
        type: "multiple-choice"
      },
      {
        id: "q6",
        question: "La ce oră s-a stabilit vizionarea apartamentului?",
        options: [
          "La ora zece dimineața",
          "La ora treisprezece",
          "La ora șaptesprezece (5 PM)",
          "La ora nouăzeci (7 PM)"
        ],
        correctAnswerIndex: 2,
        explanation: "Din convorbire: 'mâine la ora șaptesprezece este excelent.' (17:00)",
        type: "multiple-choice"
      },
      {
        id: "q7",
        question: "Unde urmează să se întâlnească cei doi pentru vizionare?",
        options: [
          "În centrul orașului",
          "În fața blocului",
          "La agenția imobiliară",
          "La cafenea"
        ],
        correctAnswerIndex: 1,
        explanation: "Proprietarul menționează direct: 'Ne întâlnim în fața blocului.'",
        type: "multiple-choice"
      },
      {
        id: "q8",
        question: "Chiria este de patru sute cincizeci de ____ pe lună.",
        options: [
          "lei",
          "euro",
          "dolari",
          "marce"
        ],
        correctAnswerIndex: 1,
        explanation: "Apartamentele în România se închiriază de regulă listate în 'euro'.",
        type: "fill-in-the-blank"
      }
    ]
  }
};
