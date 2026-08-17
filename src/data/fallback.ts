import { ScenarioContent } from '../types';

export function generateFallbackContent(catalogItem: any): ScenarioContent {
  const { title, romanianTitle, level, category, description, id } = catalogItem;
  
  let romanianText = "";
  let englishText = "";
  let paragraphs: { romanian: string; english: string }[] = [];
  let vocabulary: any[] = [];
  let quiz: any[] = [];

  const safeTitle = romanianTitle || title;

  // 1. Core narratives tailored perfectly by categories
  if (category === "Food & Dining") {
    paragraphs = [
      {
        romanian: `Mă aflu la o unitate gastronomică primitoare din inima orașului pentru activitatea noastră: "${safeTitle}". Chelnerul se apropie zâmbitor, ne salută politicos în română și ne aduce meniul zilei plin cu delicatese locale.`,
        english: `I am at a cozy dining establishment in the heart of the city for our activity: "${title}". The waiter approaches with a smile, greets us politely in Romanian, and brings the daily menu filled with local delicacies.`
      },
      {
        romanian: "Analizăm opțiunile apetisante din meniu: de la ciorbă de burtă fierbinte până la sarmale delicioase și mămăliguță proaspătă proaspătă. Comandăm specialitatea casei și o băutură răcoritoare locală pentru a ne răsfăța papilele gustative.",
        english: "We analyze the appetizing options on the menu: from hot tripe soup to delicious cabbage rolls and fresh polenta. We order the specialty of the house and a local refreshing drink to pamper our taste buds."
      },
      {
        romanian: "Mâncarea ajunge caldă și miroase minunat. Savurăm fiecare înghițitură din acest prânz tradițional. La final, cerem politicos nota de plată, achităm cu cardul și lăsăm un bacșiș binemeritat de zece la sută pentru serviciul excelent.",
        english: "The food arrives warm and smells wonderful. We savor every bite of this traditional lunch. In the end, we politely ask for the bill, pay by card, and leave a well-deserved ten percent tip for the excellent service."
      }
    ];

    vocabulary = [
      { romanian: "chelner", english: "waiter", context: "Chelnerul ne-a adus meniurile imediat.", contextTranslation: "The waiter brought us the menus immediately." },
      { romanian: "nota de plată", english: "the bill", context: "Chelner, nota de plată, vă rog!", contextTranslation: "Waiter, the bill please!" },
      { romanian: "savurăm", english: "we savor", context: "Savurăm cina în Centrul Vechi.", contextTranslation: "We savor dinner in the Old Town." },
      { romanian: "specialitate", english: "specialty", context: "Specialitatea casei este noul papanași cu afine.", contextTranslation: "The house specialty is the new papanași with blueberries." },
      { romanian: "bacșiș", english: "tip", context: "În România este politicos să lași un mic bacșiș.", contextTranslation: "In Romania it is polite to leave a small tip." },
      { romanian: "delicios", english: "delicious", context: "Acest cozonac de Crăciun este complet delicios.", contextTranslation: "This Christmas cozonac is completely delicious." }
    ];

    quiz = [
      {
        id: "q1",
        question: "Unde are loc activitatea descrisă în lecție?",
        options: ["La o universitate publică", "La o unitate gastronomică primitoare", "Într-un birou de design", "În parcarea de la metrou"],
        correctAnswerIndex: 1,
        explanation: "The text starts with: 'Mă aflu la o unitate gastronomică primitoare...'",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "Ce aduce chelnerul zâmbitor la masa noastră?",
        options: ["Un bilet de tren", "Meniul zilei plin cu delicatese", "O revistă de modă", "O cheie de apartament"],
        correctAnswerIndex: 1,
        explanation: "The text states: 'ne aduce meniul zilei plin cu delicatese locale.'",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "Ce preparate apetisante sunt menționate ca opțiuni în meniu?",
        options: ["Pizza napoletană și burgeri", "Ciorbă de burtă, sarmale și mămăliguță", "Sushi și pește crud", "Fructe exotice de mare"],
        correctAnswerIndex: 1,
        explanation: "The second paragraph lists: 'ciorbă de burtă fierbinte până la sarmale delicioase și mămăliguță.'",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "Completează cuvântul lipsă: 'Savurăm fiecare înghițitură din acest ____ tradițional.'",
        options: ["mic dejun", "pachet de post", "prânz", "bilet"],
        correctAnswerIndex: 2,
        explanation: "The text uses 'prânz' (lunch) in: 'Savurăm fiecare înghițitură din acest prânz tradițional.'",
        type: "fill-in-the-blank"
      }
    ];

  } else if (category === "Travel & Tourism") {
    paragraphs = [
      {
        romanian: `Sunt entuziasmat să particip la călătoria noastă pentru: "${safeTitle}". Călătoria în România reprezintă un mod ideal de relaxare și descoperire culturală. Îmi pregătesc bagajul cu atenție, având la îndemână actele de identitate, harta orașului și aparatul foto.`,
        english: `I am excited to participate in our journey for: "${title}". Traveling in Romania represents an ideal way of relaxation and cultural discovery. I prepare my luggage carefully, having close at hand my identity documents, the city map, and the camera.`
      },
      {
        romanian: "Căutăm indicii despre cele mai rapide trasee turistice sau mijloace de transport disponibile. Fie că rezervăm o cursă rapidă cu Bolt, cumpărăm o cartelă de metrou sau un bilet CFR gării locale, explorarea aduce momente magice și pline de aventură.",
        english: "We look for clues about the fastest tourist routes or available means of transport. Whether we book a fast ride with Bolt, buy a metro card, or a CFR train ticket at the local station, exploration brings magic and adventurous moments."
      },
      {
        romanian: "Poposim în cele din urmă la destinația visată unde admirăm castele impunătoare, parcuri umbroase sau peisaje montane din Munții Carpați. Întrebăm trecătorii direcții în română pentru a exersa limba locală. Oamenii sunt încântați de eforturile noastre.",
        english: "We finally halt at our dreamed destination where we admire imposing castles, shady parks, or mountain landscapes from the Carpathian Mountains. We ask passersby for directions in Romanian to practice the local language. People are delighted by our efforts."
      }
    ];

    vocabulary = [
      { romanian: "călătorie", english: "journey / travel", context: "O călătorie lungă începe cu un singur pas.", contextTranslation: "A long journey begins with a single step." },
      { romanian: "bagaj", english: "luggage", context: "Bagajul de mână este destul de ușor.", contextTranslation: "The hand luggage is quite light." },
      { romanian: "destinație", english: "destination", context: "Destinația noastră finală este Brașov.", contextTranslation: "Our final destination is Brașov." },
      { romanian: "harta orașului", english: "city map", context: "Avem nevoie de harta orașului pentru a găsi piața.", contextTranslation: "We need the city map to find the square." },
      { romanian: "trasee", english: "routes", context: "Munții Bucegi au trasee montane minunate.", contextTranslation: "The Bucegi Mountains have wonderful mountain routes." },
      { romanian: "direcții", english: "directions", context: "Te rog să ne ceri direcții dacă ne pierdem.", contextTranslation: "Please ask for directions if we get lost." }
    ];

    quiz = [
      {
        id: "q1",
        question: "Cum reprezintă călătoria în România în opinia naratorului?",
        options: ["O mare pierdere de timp", "Un mod ideal de relaxare și descoperire", "Ceva extrem de obositor", "O călătorie pur administrativă"],
        correctAnswerIndex: 1,
        explanation: "The text says: 'Călătoria în România reprezintă un mod ideal de relaxare și descoperire culturală.'",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "Ce lucruri își pregătește naratorul în bagaj?",
        options: ["Mâncare gata preparată", "Actele de identitate, harta orașului și aparatul foto", "Doar haine groase", "Un dicționar uriaș de gramatică"],
        correctAnswerIndex: 1,
        explanation: "The text mentions: 'având la îndemână actele de identitate, harta orașului și aparatul foto.'",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "Cum reacționează românii când le întrebăm direcții în limba română?",
        options: ["Sunt supărați și pleacă", "Oamenii sunt încântați de eforturile noastre", "Nu doresc să răspundă deloc", "Sunt indiferenți"],
        correctAnswerIndex: 1,
        explanation: "The final paragraph mentions: 'Oamenii sunt încântați de eforturile noastre.'",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "Completează cuvântul lipsă: 'Poposim în cele din urmă la ____ visată unde admirăm castele.'",
        options: ["grădina", "școala", "destinația", "clădirea"],
        correctAnswerIndex: 2,
        explanation: "The line corresponds to: 'Poposim în cele din urmă la destinația visată...'",
        type: "fill-in-the-blank"
      }
    ];

  } else if (category === "Culture & Customs") {
    paragraphs = [
      {
        romanian: `Tradițiile românești sunt de o bogăție spirituală remarcabilă, potrivite excelent pentru subiectul nostru de interes: "${safeTitle}". Sărbătorile îmbină obiceiurile păgâne antice cu cele creștine, generând festivaluri pitorești.`,
        english: `Romanian traditions are of a remarkable spiritual richness, perfectly suited for our topic of interest: "${title}". The holidays blend ancient pagan customs with Christian ones, generating picturesque festivals.`
      },
      {
        romanian: "Fie că este vorba despre oferirea mărțișoarelor pe întâi martie, dansul energic al horei la o nuntă autohtonă sau pregătirea cozonacilor pufoși proaspeți în familie, cultura oferă o adevărată identitate națională.",
        english: "Whether it's about offering mărțișoare on March 1st, dancing the energetic hora at a local wedding, or preparing fluffy fresh cozonaci in the family, the culture offers a true national identity."
      },
      {
        romanian: "Participarea activă la aceste evenimente folclorice ne permite să înțelegem mai bine faimosul 'dor' românesc. Acest cuvânt unic descrie dorința profundă și nostalgia pentru casă, familie sau persoana iubită.",
        english: "Active participation in these folkloric events allows us to understand the famous Romanian 'dor' better. This unique word describes a deep longing and nostalgia for home, family, or the beloved person."
      }
    ];

    vocabulary = [
      { romanian: "tradiții", english: "traditions", context: "Tradițiile de Crăciun sunt păstrate cu sfințenie.", contextTranslation: "Christmas traditions are kept sacredly." },
      { romanian: "mărțișor", english: "traditional spring amulet", context: "De mărțișor cumpărăm fire roșii și albe.", contextTranslation: "On mărțișor we buy red and white threads." },
      { romanian: "cozonac", english: "traditional sweet bread", context: "Mirosul de cozonac cald umple casa de sărbători.", contextTranslation: "The smell of warm cozonac fills the house on holidays." },
      { romanian: "clătite / gogoși", english: "pancakes / donuts", context: "Bunica ne face gogoși pudrate cu zahăr.", contextTranslation: "Grandma makes us donuts powdered with sugar." },
      { romanian: "folclorice", english: "folkloric", context: "Spectacolele folclorice au dansuri foarte rapide.", contextTranslation: "Folkloric shows have very fast dances." },
      { romanian: "dor", english: "longing / nostalgia (unique word)", context: "Mi-e dor de casa mea părintească.", contextTranslation: "I have a longing for my parental home." }
    ];

    quiz = [
      {
        id: "q1",
        question: "Cum sunt descrise tradițiile românești de către autor?",
        options: ["Sunt uitate de toată lumea", "Sunt de o bogăție spirituală remarcabilă", "Sunt greu de înțeles și ciudate", "Sunt identice cu cele vestice"],
        correctAnswerIndex: 1,
        explanation: "The text explicitly states: 'Tradițiile românești sunt de o bogăție spirituală remarcabilă.'",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "Ce îmbină sărbătorile românești?",
        options: ["Matematica și biologia", "Obiceiurile păgâne antice cu cele creștine", "Fotbalul și gătitul", "Arta modernă și sculpturile abstracte"],
        correctAnswerIndex: 1,
        explanation: "The text says: 'Sărbătorile îmbină obiceiurile păgâne antice cu cele creștine.'",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "Ce sentiment profund românesc este menționat în ultima secțiune?",
        options: ["Frica de cutremure", "Dorul românesc", "Ura de iarnă", "Nostalgia pentru mare"],
        correctAnswerIndex: 1,
        explanation: "The text discusses understanding 'mai bine faimosul dor românesc.'",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "Completează cuvântul lipsă: 'sau pregătirea ____ pufoși proaspeți în familie.'",
        options: ["salamilor", "castraveților", "cozonacilor", "covrigilor"],
        correctAnswerIndex: 2,
        explanation: "The text mentions: 'sau pregătirea cozonacilor pufoși proaspeți in familie.'",
        type: "fill-in-the-blank"
      }
    ];

  } else if (category === "Work & Professional") {
    paragraphs = [
      {
        romanian: `Planurile de carieră și relațiile de muncă în sectorul românesc reprezintă puncte cheie în activitatea: "${safeTitle}". Atât în marile companii IT cât și în birourile administrative locale din România, cunoașterea vocabularului adecvat este indispensabilă.`,
        english: `Career plans and working relations in the Romanian sector represent key points in our activity: "${title}". Both in large IT companies and in local administrative offices in Romania, knowing the appropriate vocabulary is indispensable.`
      },
      {
        romanian: "Participăm la ședințe profesionale destinate performanței sau negociem contracte de colaborare comerciale. Ne prezentăm experiența anterioară în cadrul unui interviu de angajare riguros, arătând dedicare deplină și seriozitate maximă.",
        english: "We participate in professional meetings dedicated to performance or negotiate commercial collaboration contracts. We present our previous experience during a rigorous job interview, showing full dedication and maximum seriousness."
      },
      {
        romanian: "O comunicare transparentă cu partenerii locali și colegii de echipă consolidează afacerile. Învățăm cum să redactăm scrisori de intenție corporative, să deschidem conturi corporate la bănci sau să gestionăm taxele corect prin portalul digital ANAF.",
        english: "Transparent communication with local partners and team members consolidates business. We learn how to draft corporate cover letters, open corporate bank accounts, or manage taxes correctly through the ANAF digital portal."
      }
    ];

    vocabulary = [
      { romanian: "angajare", english: "employment / hiring", context: "Procesul de angajare a durat trei săptămâni.", contextTranslation: "The hiring process took three weeks." },
      { romanian: "afaceri", english: "business", context: "El dorește să dezvolte o afacere de succes.", contextTranslation: "He wants to develop a successful business." },
      { romanian: "ședință", english: "meeting", context: "Avem o ședință importantă cu managerul la ora zece.", contextTranslation: "We have an important meeting with the manager at ten o'clock." },
      { romanian: "taxe", english: "taxes", context: "Firmele plătesc taxe la bugetul de stat.", contextTranslation: "Companies pay taxes to the state budget." },
      { romanian: "interviu", english: "interview", context: "Interviul a decurs excelent și politicos.", contextTranslation: "The interview went excellently and politely." },
      { romanian: "colaborare", english: "collaboration / partnership", context: "Mulțumim pentru colaborarea strânsă din acest an.", contextTranslation: "Thank you for the close collaboration this year." }
    ];

    quiz = [
      {
        id: "q1",
        question: "Despre ce sector este vorba în textul profesional?",
        options: ["Sectorul medical", "Sectorul de carieră și relații de muncă din România", "Sectorul agricol tradițional", "Sectorul muzeal din Sibiu"],
        correctAnswerIndex: 1,
        explanation: "The text starts by introducing: 'Planurile de carieră și relațiile de muncă în sectorul românesc...'",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "Unde ne prezentăm experiența anterioară cu dedicare?",
        options: ["În parc", "În fața vecinilor din bloc", "În cadrul unui interviu de angajare riguros", "La restaurantul de sarmale"],
        correctAnswerIndex: 2,
        explanation: "The narrator says: 'Ne prezentăm experiența anterioară în cadrul unui interviu de angajare riguros...'",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "Cum putem gestiona taxele în mod corect?",
        options: ["Trimițând o scrisoare poștală", "Prin portalul digital ANAF", "Ascunzând documentele importante", "Sunând un taximetrist privat"],
        correctAnswerIndex: 1,
        explanation: "Paragraph three mentions: 'să gestionăm taxele corect prin portalul digital ANAF.'",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "Completează cuvântul lipsă: 'O comunicare transparentă cu ____ locali și colegii de echipă consolidează afacerile.'",
        options: ["copiii", "vecinii", "partenerii", "părinții"],
        correctAnswerIndex: 2,
        explanation: "The text line is: 'O comunicare transparentă cu partenerii locali...'",
        type: "fill-in-the-blank"
      }
    ];

  } else {
    // Elegant, highly cohesive General Template
    paragraphs = [
      {
        romanian: `Fiecare zi în România aduce noi oportunități minunate de învățare și evoluție practică, perfecte pentru subiectul nostru: "${safeTitle}". Cunoașterea limbii ne oferă acces direct la inima comunității locale și ne descrie frumusețea vieții zilnice.`,
        english: `Each day in Romania brings wonderful new opportunities for learning and practical evolution, perfect for our topic: "${title}". Knowing the language offers us direct access to the heart of the local community and describes to us the beauty of daily life.`
      },
      {
        romanian: `Prin intermediul exercițiilor propuse în această lecție din categoria "${category || 'Zilnică'}", învățăm expresii autentice folosite la metrou, piețe alimentare, birouri sau terase. Obținem mai multă fluență gramaticală și ne adaptăm stilului interactiv de comunicare.`,
        english: `Through the exercises proposed in this lesson from the "${category || 'Daily'}" category, we learn authentic expressions used on the metro, food markets, offices, or terraces. We obtain more grammatical fluency and adapt to the interactive style of communication.`
      },
      {
        romanian: "Fiecare efort pe care îl facem acum construiește o punte de încredere și cunoaștere. Suntem bucuroși să practicăm cu Niran, ghidul nostru de încredere, și să ne îmbunătățim continuu nivelul de limbă, de la vocabular de bază până la fraze nuanțate.",
        english: "Each effort we make now builds a bridge of confidence and knowledge. We are happy to practice with Niran, our trusted guide, and continuously improve our language level, from basic vocabulary to nuanced phrasings."
      }
    ];

    vocabulary = [
      { romanian: "oportunitate", english: "opportunity", context: "Fiecare zi de practică este o oportunitate rară.", contextTranslation: "Every day of practice is a rare opportunity." },
      { romanian: "învățare", english: "learning", context: "Aplicația face procesul de învățare extrem de distractiv.", contextTranslation: "The app makes the learning process extremely fun." },
      { romanian: "fluență", english: "fluency", context: "Practicarea zilnică îmbunătățește fluența în vorbire.", contextTranslation: "Daily practice improves speaking fluency." },
      { romanian: "încredere", english: "confidence / trust", context: "Am multă încredere în capacitățile mele noi.", contextTranslation: "I have a lot of confidence in my new capabilities." },
      { romanian: "ghid", english: "guide", context: "Niran este un ghid excelent pentru gramatica limbii române.", contextTranslation: "Niran is an excellent guide for Romanian grammar." },
      { romanian: "îmbunătățim", english: "we improve", context: "La fiecare pas ne îmbunătățim accentul pronunțat.", contextTranslation: "At each step we improve our pronounced accent." }
    ];

    quiz = [
      {
        id: "q1",
        question: "Ce aduce fiecare zi în România în opinia autorului?",
        options: ["Multe dificultăți greu de rezolvat", "Noi oportunități minunate de învățare și evoluție", "Vreme ploioasă și mohorâtă", "O simplă rutină repetitivă"],
        correctAnswerIndex: 1,
        explanation: "The narrative begins: 'Fiecare zi în România aduce noi oportunități minunate de învățare și evoluție practică...'",
        type: "multiple-choice"
      },
      {
        id: "q2",
        question: "La ce ne oferă acces direct cunoașterea limbii române?",
        options: ["La contul bancar al altcuiva", "La inima comunității locale", "Numai la clădirile oficiale", "La un site web plictisitor"],
        correctAnswerIndex: 1,
        explanation: "The narrative says: 'Cunoașterea limbii ne oferă acces direct la inima comunității locale...'",
        type: "multiple-choice"
      },
      {
        id: "q3",
        question: "Cu cine suntem bucuroși să practicăm în fiecare lecție interactivă?",
        options: ["Cu un agent imobiliar străin", "Cu Niran, ghidul nostru de încredere", "Cu colegi de birou nemulțumiți", "Cu un taximetrist grăbit"],
        correctAnswerIndex: 1,
        explanation: "The text states: 'Suntem bucuroși să practicăm cu Niran, ghidul nostru de încredere.'",
        type: "multiple-choice"
      },
      {
        id: "q4",
        question: "Completează cuvântul lipsă: 'Fiecare efort pe care îl facem acum construiește o punte de ____ și cunoaștere.'",
        options: ["temere", "încredere", "siguranță", "mândrie"],
        correctAnswerIndex: 1,
        explanation: "The text says: 'construiește o punte de încredere și cunoaștere.'",
        type: "fill-in-the-blank"
      }
    ];
  }

  // Common additional questions to complete exactly 8 questions
  quiz.push(
    {
      id: "q5",
      question: `Ce nivel CEFR de limbă este indicat pentru această activitate specială?`,
      options: ["Nivelul C1 avansat academic", `Nivelul recomandat: ${level || 'A1/A2'}`, "Nivelul nativ de vorbitor", "Fără un nivel specific"],
      correctAnswerIndex: 1,
      explanation: `The difficulty level is specified as: ${level || 'A1/A2'}.`,
      type: "multiple-choice"
    },
    {
      id: "q6",
      question: "Care este scopul pe termen mediu al acestor exerciții lingvistice interactive?",
      options: ["Să copiem texte lungi", "Să obținem fluență și încredere pas cu pas", "Să cumpărăm cărți grele de gramatică", "Să memorăm dicționare întregi"],
      correctAnswerIndex: 1,
      explanation: "The text emphasizes learning step-by-step and obtaining more grammatical fluency.",
      type: "multiple-choice"
    },
    {
      id: "q7",
      question: "De unde începem îmbunătățirea nivelului de limbă?",
      options: ["De la fraze de afaceri direct", "De la vocabular de bază până la fraze nuanțate", "Numai de la reguli vechi", "Fără exerciții de citire"],
      correctAnswerIndex: 1,
      explanation: "The narrative states we improve 'de la vocabular de bază până la fraze nuanțate.'",
      type: "multiple-choice"
    },
    {
      id: "q8",
      question: "Completează cuvântul lipsă: 'Cunoașterea limbii ne oferă acces direct la inima ____ locale.'",
      options: ["clădirii", "asociației", "comunității", "gării"],
      correctAnswerIndex: 2,
      explanation: "The correct keyword is 'comunității' (community).",
      type: "fill-in-the-blank"
    }
  );

  return {
    id: id || "sc-fallback",
    romanianText,
    englishText,
    paragraphs,
    vocabulary,
    quiz
  };
}
