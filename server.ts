import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { SCENARIOS } from "./src/data/topics.js";
import { PREBUILT_SCENARIOS } from "./src/data/prebuilt.js";
import { generateFallbackContent } from "./src/data/fallback.js";

const PORT = 3000;

// Lazy initialization of Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in the Secrets panel in the AI Studio UI.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

function generateFallbackScenario(catalogItem: any) {
  const title = catalogItem.title;
  const roTitle = catalogItem.romanianTitle;
  const level = catalogItem.level;
  const category = catalogItem.category;
  const description = catalogItem.description;

  const p1_ro = `Bun venit la lecția practică despre „${roTitle}” (${title}). Acest modul de studiu este conceput special pentru nivelul de dificultate ${level} din categoria ${category}.`;
  const p1_en = `Welcome to the practical lesson about "${roTitle}" (${title}). This study module is designed specifically for difficulty level ${level} in the ${category} category.`;

  const p2_ro = `Pentru a stăpâni această situație din viața de zi cu zi în România: ${description}. Învățarea cuvintelor noi și a tiparelor corecte de gramatică ne oferă încredere în conversațiile reale.`;
  const p2_en = `To master this real-life situation in Romania: ${description}. Learning new words and correct grammar patterns gives us confidence in real conversations.`;

  const p3_ro = `Profesorul tău Niran ne sfătuiește să exersăm regulat în fiecare zi. Repetarea cuvintelor cheie și finalizarea acestui exercițiu ne garantează progresul lingvistic rapid și sigur!`;
  const p3_en = `Your tutor Niran advises us to practice regularly every day. Repeating key words and completing this exercise guarantees our rapid and secure linguistic progress!`;

  const romanianText = `${p1_ro}\n\n${p2_ro}\n\n${p3_ro}`;
  const englishText = `${p1_en}\n\n${p2_en}\n\n${p3_en}`;

  const paragraphs = [
    { romanian: p1_ro, english: p1_en },
    { romanian: p2_ro, english: p2_en },
    { romanian: p3_ro, english: p3_en }
  ];

  const vocabulary = [
    {
      romanian: "mulțumesc",
      english: "thank you",
      context: "Îți mulțumesc foarte mult pentru ajutorul acordat în această lecție.",
      contextTranslation: "Thank you very much for the assistance provided in this lesson."
    },
    {
      romanian: "exercițiu",
      english: "exercise",
      context: "Acest exercițiu interactiv ne ajută să consolidăm timpurile verbelor.",
      contextTranslation: "This interactive exercise helps us consolidate verb tenses."
    },
    {
      romanian: "limba română",
      english: "Romanian language",
      context: "Limba română este frumoasă și plină de expresii calde.",
      contextTranslation: "The Romanian language is beautiful and full of warm expressions."
    },
    {
      romanian: "încredere",
      english: "confidence / trust",
      context: "Exersarea zilnică de roluri îți oferă multă încredere.",
      contextTranslation: "Daily role-playing practice gives you a lot of confidence."
    },
    {
      romanian: "zi de zi",
      english: "day by day / daily",
      context: "Progresăm în conversație zi de zi prin cursul lui Niran.",
      contextTranslation: "We progress in conversation day by day through Niran's course."
    },
    {
      romanian: "bineînțeles",
      english: "of course / naturally",
      context: "Bineînțeles, învățarea gramaticii este esențială aici.",
      contextTranslation: "Of course, learning grammar is essential here."
    }
  ];

  const quiz = [
    {
      id: "q1",
      question: `Care este traducerea corectă în limba engleză pentru titlul românesc „${roTitle}”?`,
      options: [title, "Good morning tea", "Buying traditional bread", "Asking directions"],
      correctAnswerIndex: 0,
      explanation: `The Romanian title „${roTitle}” translates directly to the English title "${title}".`,
      type: "multiple-choice"
    },
    {
      id: "q2",
      question: `La ce nivel de dificultate CEFR este clasificată această temă de studiu?`,
      options: ["A1 Beginner", "A2 Elementary", "B1 Intermediate", `Nivelul ${level}`],
      correctAnswerIndex: 3,
      explanation: `This scenario falls under the curriculum difficulty of ${level}.`,
      type: "multiple-choice"
    },
    {
      id: "q3",
      question: "Ce înseamnă adjectivul sau substantivul „încredere” în limba engleză?",
      options: ["Morning coffee", "Confidence / trust", "Metro station card", "Traditional pretzel"],
      correctAnswerIndex: 1,
      explanation: "„Încredere” translates to „confidence” or „trust” in English.",
      type: "multiple-choice"
    },
    {
      id: "q4",
      question: `Care este categoria principală a acestui modul „${title}”?`,
      options: ["Sports", "Business", "Politics", category],
      correctAnswerIndex: 3,
      explanation: `According to the lesson headers, this is classified inside the ${category} category.`,
      type: "multiple-choice"
    },
    {
      id: "q5",
      question: "Completează spațiul liber: „Limba română este frumoasă și plină de ____ calde.”",
      options: ["pâine", "expresii", "mașini", "magazine"],
      correctAnswerIndex: 1,
      explanation: "From the vocabulary section context sentence: „Limba română este frumoasă și plină de expresii calde.”",
      type: "fill-in-the-blank"
    },
    {
      id: "q6",
      question: "Completează propoziția: „Ne bucurăm să exersăm limba română în fiecare ____.”",
      options: ["zi", "cafea", "tren", "metrou"],
      correctAnswerIndex: 0,
      explanation: "„În fiecare zi” translates to „every day” and fits perfectly.",
      type: "fill-in-the-blank"
    },
    {
      id: "q7",
      question: "Ce ne recomandă profesorul tău virtual Niran să facem pentru a avea succes?",
      options: ["Să vorbim doar în engleză", "Să dormim mai mult", "Să exersăm regulat în fiecare zi", "Să cumpărăm covrigi"],
      correctAnswerIndex: 2,
      explanation: "From the narrative block: „Profesorul tău Niran ne sfătuiește să exersăm regulat în fiecare zi.”",
      type: "multiple-choice"
    },
    {
      id: "q8",
      question: "Cum traducem substantivul „exercițiu” în limba engleză?",
      options: ["Street market", "Exercise", "Subway route", "Colleague meal"],
      correctAnswerIndex: 1,
      explanation: "The Romanian word „exercițiu” correlates to „exercise” in English.",
      type: "multiple-choice"
    }
  ];

  return {
    id: catalogItem.id,
    romanianText,
    englishText,
    paragraphs,
    vocabulary,
    quiz
  };
}

async function callGeminiWithRetry(
  prompt: string,
  schema: any,
  systemInstruction?: string
): Promise<any> {
  const ai = getGemini();
  const models = ["gemini-3.5-flash", "gemini-2.5-flash"];
  let lastError: any = null;

  for (const modelName of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Calling Gemini API (model: ${modelName}, attempt: ${attempt})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: schema,
          }
        });

        const responseText = response.text;
        if (responseText) {
          return JSON.parse(responseText.trim());
        }
        throw new Error("Empty response received from Gemini");
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err.message || err);
        console.warn(`Attempt ${attempt} with model ${modelName} encountered error: ${errMsg}`);
        
        // Handle rate limit (429) or temporary server error (503/500/504)
        if (attempt < 3 && (errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("UNAVAILABLE") || errMsg.includes("RESOURCE_EXHAUSTED"))) {
          const delay = attempt * 800;
          console.log(`Waiting ${delay}ms before next attempt...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed after multiple retries and model fallbacks");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route - Get all topics headers
  app.get("/api/scenarios", (req, res) => {
    try {
      res.json(SCENARIOS);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route - Get specific scenario content (prebuilt or AI dynamic)
  app.get("/api/scenario/:id", async (req, res) => {
    const scenarioId = req.params.id;
    const targetLanguage = (req.query.targetLanguage as string) || "Romanian";
    const sourceLanguage = (req.query.sourceLanguage as string) || "English";
    
    try {
      // 1. Check if scenario is pre-built (only applicable for standard Romanian in English)
      if (targetLanguage.toLowerCase() === "romanian" && sourceLanguage.toLowerCase() === "english") {
        if (PREBUILT_SCENARIOS[scenarioId]) {
          return res.json({
            source: "prebuilt",
            content: PREBUILT_SCENARIOS[scenarioId]
          });
        }
      }

      // 2. Find matching scenario in catalog
      const catalogItem = SCENARIOS.find((item) => item.id === scenarioId);
      if (!catalogItem) {
        return res.status(404).json({ error: `Scenario ${scenarioId} not found in catalog` });
      }

      // 3. Otherwise, generate content using Gemini with automatic retries and JSON schema
      const schema = {
        type: Type.OBJECT,
        properties: {
          romanianText: { type: Type.STRING },
          englishText: { type: Type.STRING },
          paragraphs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                romanian: { type: Type.STRING },
                english: { type: Type.STRING }
              },
              required: ["romanian", "english"]
            }
          },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                romanian: { type: Type.STRING },
                english: { type: Type.STRING },
                context: { type: Type.STRING },
                contextTranslation: { type: Type.STRING }
              },
              required: ["romanian", "english", "context", "contextTranslation"]
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                type: { type: Type.STRING }
              },
              required: ["id", "question", "options", "correctAnswerIndex", "type"]
            }
          }
        },
        required: ["romanianText", "englishText", "paragraphs", "vocabulary", "quiz"]
      };

      const prompt = `
        You are a multilingual AI curriculum generator. Generate a parallel study lesson for learning "${targetLanguage}" using "${sourceLanguage}" as the translation/support language.

        TOPIC CONTEXT:
        - Topic: "${catalogItem.title}"
        - Category: "${catalogItem.category}"
        - Level: "${catalogItem.level}"
        - Goal: "${catalogItem.description}"
        
        DIRECTIONS:
        1. "romanianText": A cohesive narrative story or conversational dialogue in native ${targetLanguage} illustrating the topic context. Word count: 120-250 words.
        2. "englishText": Correspondent exact translation of the text in ${sourceLanguage}.
        3. "paragraphs": Split the narrative into logical paragraphs, with { "romanian": "(paragraph in ${targetLanguage})", "english": "(translation in ${sourceLanguage})" } for each.
        4. "vocabulary": Extract 6 to 10 key terms/phrases from the text. Under "romanian" place the phrase in ${targetLanguage}, and under "english" place its translation in ${sourceLanguage}. Provide "context" in ${targetLanguage} and "contextTranslation" in ${sourceLanguage}.
        5. "quiz": Provide exactly 8 multiple-choice or fill-in-the-blank comprehension/grammar questions based on the scenario. Output "question" (in either ${targetLanguage} or ${sourceLanguage}), 4 plausible "options", "correctAnswerIndex", and detailed "explanation" in ${sourceLanguage}.
        
        IMPORTANT: Map "${targetLanguage}" content into JSON keys named "romanian" / "romanianText" and "${sourceLanguage}" content into JSON keys named "english" / "englishText" for system compatibility.
      `;

      const generatedContent = await callGeminiWithRetry(prompt, schema);
      
      // Append scenario ID to generated content
      generatedContent.id = scenarioId;

      res.json({
        source: "ai",
        content: generatedContent
      });

    } catch (error: any) {
      console.warn("Error fetching or generating scenario with Gemini:", error);
      
      if (targetLanguage.toLowerCase() === "romanian") {
        console.warn("Activating offline premium fallback for Romanian.");
        const catalogItem = SCENARIOS.find((item) => item.id === scenarioId);
        if (catalogItem) {
          try {
            const fallbackContent = generateFallbackContent(catalogItem);
            return res.json({
              source: "offline_fallback",
              content: fallbackContent
            });
          } catch (fallbackError: any) {
            console.error("Critical fallback failed:", fallbackError);
          }
        }
      }
      
      // If not Romanian or fallback fails, return the error so the UI shows it instead of showing Romanian for Dutch
      res.status(500).json({ error: "Failed to generate AI content. Please ensure you have set your GEMINI_API_KEY in the AI Studio Settings to learn languages other than Romanian." });
    }
  });

  // API Route - AI Tutor Chat and correction
  app.post("/api/chat", async (req, res) => {
    const { scenarioTitle, userLevel, messages, targetLanguage = "Romanian", sourceLanguage = "English" } = req.body;

    if (!scenarioTitle || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing required fields: scenarioTitle, userLevel, or messages" });
    }

    try {
      // Format conversation history for system prompt context
      const formattedHistory = messages.map(m => `${m.sender === 'user' ? 'Learner' : 'Niran (AI Tutor)'}: ${m.text}`).join("\n");

      const systemInstruction = `You are Niran, a friendly, encouraging, and highly helpful language tutor. You specialize in teaching "${targetLanguage}" using "${sourceLanguage}" as the translation/explanation support language. The user is doing an interactive roleplay speaking practice based on the scenario "${scenarioTitle}". Maintain this persona in native "${targetLanguage}" matching the user's level "${userLevel || 'A1/A2'}", providing helpful grammar corrections and translations in "${sourceLanguage}".`;

      const promptMsg = `
        The user is practicing the target language "${targetLanguage}" using support language "${sourceLanguage}" for this scenario: "${scenarioTitle}".
        Their CEFR level: "${userLevel || 'A1/A2'}".
        
        Analyze the full conversation history. Read the learner's last message, and formulate a reply.
        
        ROLEPLAY DIRECTIONS:
        1. Keep your reply friendly, positive, and conversational.
        2. Align your "${targetLanguage}" vocabulary complexity and sentence structures to the learner's CEFR level (${userLevel}).
        3. Keep the conversation going! Ask a natural, follow-up question in "${targetLanguage}" related to the scenario context.
        4. CRITICAL GRAMMAR SERVICE: Review the learner's last message in "${targetLanguage}". If they made any spelling, conjugation, case, or phrasing mistakes, provide a gentle, polite correction inside the "correction" field. Keep this note short and educational (explain the rule briefly in 1-2 sentences in "${sourceLanguage}"). If their message was completely correct, leave "correction" empty or null.
        5. "englishTranslation": Provide a friendly translation or hint in "${sourceLanguage}" for what you just said in "${targetLanguage}", so that if they feel stuck they can learn from it.
        
        Return your response in JSON format according to the schema.
        
        CONVERSATION HISTORY:
        ${formattedHistory}
      `;

      const schema = {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: `Your conversational response in ${targetLanguage}` },
          correction: { type: Type.STRING, description: `Polite correction of the user's last message in ${sourceLanguage} if any error is found` },
          englishTranslation: { type: Type.STRING, description: `Translation of your response in ${sourceLanguage}` }
        },
        required: ["text", "correction", "englishTranslation"]
      };

      const reply = await callGeminiWithRetry(promptMsg, schema, systemInstruction);
      res.json(reply);

    } catch (error: any) {
      console.warn("AI Roleplay Tutor Error, activating elegant local fallback response:", error);
      res.json({
        text: `I apologize, I'm temporarily handling a lot of students! Let's continue practicing ${targetLanguage}! Can you write another sentence about ${scenarioTitle}?`,
        correction: `Language Tip: In ${targetLanguage}, express yourself simply first to practice structure.`,
        englishTranslation: "Excuse me, I am temporarily requested by many students, but we continue! Please add a new message or ask me a question."
      });
    }
  });

  // API Route - AI Vocabulary Generator for Essentials
  app.post("/api/generate-vocab", async (req, res) => {
    const { targetLanguage = "Romanian", sourceLanguage = "English", category = "Noun", startIndex = 50 } = req.body;

    try {
      const prompt = `
        You are a highly precise, native language lexicographer.
        Generate exactly 10 high-frequency vocabulary words for studying "${targetLanguage}" explained in "${sourceLanguage}".
        
        CRITERIA:
        1. These words should be ranked around #${startIndex} to #${startIndex + 15} in everyday conversation frequency.
        2. They MUST belong to the category "${category}" (values can be: Noun, Verb, Adjective, Expression, Slang).
        3. Make sure the spelling is 100% correct in native "${targetLanguage}".
        4. "ipa": Provide the International Phonetic Alphabet (IPA) representation of the word's pronunciation in "${targetLanguage}".
        5. "sentence": Provide a simple, beautiful, everyday example sentence in native "${targetLanguage}" containing the word, appropriate for a beginner/intermediate student.
        6. "sentenceTranslation": Provide the accurate translation of that sentence in "${sourceLanguage}".

        Return your output strictly as a JSON object matching the requested schema.
      `;

      const schema = {
        type: Type.OBJECT,
        properties: {
          words: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                translation: { type: Type.STRING },
                category: { type: Type.STRING },
                ipa: { type: Type.STRING },
                sentence: { type: Type.STRING },
                sentenceTranslation: { type: Type.STRING }
              },
              required: ["word", "translation", "category", "ipa", "sentence", "sentenceTranslation"]
            }
          }
        },
        required: ["words"]
      };

      const result = await callGeminiWithRetry(prompt, schema);
      res.json(result);

    } catch (error: any) {
      console.warn("AI Vocabulary Generation Error, returning premium local simulated fallbacks:", error);
      
      // Dynamic simulated fallback words in case of key limits/network error
      const mockFallbacks = [
        { word: `${category.toLowerCase()}_${startIndex + 1}`, translation: `meaning_${startIndex + 1}`, category, ipa: "/.../", sentence: "Example sentence.", sentenceTranslation: "Example sentence translation." },
        { word: `${category.toLowerCase()}_${startIndex + 2}`, translation: `meaning_${startIndex + 2}`, category, ipa: "/.../", sentence: "Example sentence.", sentenceTranslation: "Example sentence translation." },
        { word: `${category.toLowerCase()}_${startIndex + 3}`, translation: `meaning_${startIndex + 3}`, category, ipa: "/.../", sentence: "Example sentence.", sentenceTranslation: "Example sentence translation." }
      ];
      res.json({ words: mockFallbacks });
    }
  });

  // Hot module replacement handles mounting Vite dev server, other routes serve production static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Learn with Niran server is booting on http://localhost:${PORT}`);
  });
}

startServer();
