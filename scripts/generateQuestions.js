// scripts/generateQuestions.js
const { Configuration, OpenAIApi } = require("openai");
const admin = require('firebase-admin');
const serviceAccount = require('../path/to/your/serviceAccountKey.json');

// Initialisieren Sie Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Konfigurieren Sie die OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const topics = [
  "Schmerzmanagement in der Palliativpflege",
  "Kommunikation mit Patienten am Lebensende",
  "Ethische Entscheidungsfindung in der Palliativmedizin",
  "Symptomkontrolle in der Palliativversorgung",
  "Psychosoziale Aspekte der Palliativpflege"
  // Fügen Sie weitere Themen hinzu
];

async function generateAndSaveQuestions() {
  for (const topic of topics) {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Generiere 5 Multiple-Choice-Fragen auf Deutsch zum Thema "${topic}" im Bereich Palliativpflege. Für jede Frage:
        1. Formuliere die Frage
        2. Gib eine korrekte Antwort an
        3. Gib drei falsche Antworten an
        4. Ordne die Frage einer spezifischen Kategorie zu (z.B. "Medizinisches Wissen", "Kommunikation", "Ethik", etc.)
        5. Weise der Frage einen Schwierigkeitsgrad zu (1 für leicht, 2 für mittel, 3 für schwer)
        
        Formatiere die Ausgabe als JSON-Objekt mit den Feldern: question, correctAnswer, incorrectAnswers (Array), category, difficulty.`,
        max_tokens: 2000,
        temperature: 0.7,
      });

      const questions = JSON.parse(response.data.choices[0].text);

      // Speichern Sie jede Frage in Firestore
      for (const question of questions) {
        await db.collection('questions').add({
          ...question,
          topic,
          points: question.difficulty * 10, // Einfache Punkteberechnung basierend auf dem Schwierigkeitsgrad
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      console.log(`Generiert und gespeichert: 5 Fragen zum Thema: ${topic}`);
    } catch (error) {
      console.error(`Fehler beim Generieren von Fragen zum Thema ${topic}:`, error);
    }
  }
}

generateAndSaveQuestions().then(() => {
  console.log('Alle Fragen wurden generiert und gespeichert.');
  process.exit(0);
}).catch(error => {
  console.error('Fehler bei der Hauptausführung:', error);
  process.exit(1);
});