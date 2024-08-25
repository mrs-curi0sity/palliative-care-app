// scripts/generateQuestions.js
const OpenAI = require("openai");
const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

// Initialisieren Sie Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    for (let i = 0; i < 2; i++) {  // Schleife für 5 Fragen pro Thema
      try {
        console.log(`Generiere Frage ${i+1} für Thema: ${topic}`);
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",


            content: `Generiere 1 anspruchsvolle Multiple-Choice-Frage auf Deutsch zum Thema "${topic}" im Bereich Palliativpflege. Berücksichtige folgende Punkte:

            1. Die Frage sollte auf aktuellem medizinischem Fachwissen basieren und für Fachpersonal im Bereich Palliativpflege relevant sein.
            2. Formuliere die Frage präzise und fachlich korrekt.
            3. Gib eine korrekte Antwort an, die detailliert und wissenschaftlich fundiert ist.
            4. Gib drei falsche Antworten an, die plausibel klingen, aber fachlich inkorrekt sind.
            5. Ordne die Frage einer spezifischen Kategorie zu (z.B. "Schmerzmanagement", "Symptomkontrolle", "Ethische Entscheidungsfindung", "Kommunikation mit Patienten und Angehörigen", etc.)
            6. Weise der Frage einen Schwierigkeitsgrad zu (1 für Grundkenntnisse, 2 für fortgeschrittenes Wissen, 3 für Expertenwissen)
            
            Beziehe dich auf aktuelle Leitlinien und Best Practices in der Palliativpflege. Die Frage sollte das kritische Denken und die Anwendung von Fachwissen fördern.
            
            Formatiere die Ausgabe als JSON-Objekt mit den Feldern: question, correctAnswer, incorrectAnswers (Array), category, difficulty, explanation (eine kurze Erklärung zur richtigen Antwort).`
          }],
          temperature: 0.7,
        });

        console.log('OpenAI Antwort erhalten:', response.choices[0].message.content);

        const question = JSON.parse(response.choices[0].message.content);
        console.log('Geparste Frage:', question);

        // Speichern der Frage in Firestore
        try {
          await db.collection('questions').add({
            ...question,
            topic,
            points: question.difficulty * 10,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log('Frage erfolgreich gespeichert');
        } catch (error) {
          console.error('Fehler beim Speichern der Frage:', error);
        }
      } catch (error) {
        console.error(`Fehler beim Generieren der Frage ${i+1} zum Thema ${topic}:`, error);
      }
    }
    console.log(`Generiert und gespeichert: 2 Fragen zum Thema: ${topic}`);
  }
}

generateAndSaveQuestions().then(() => {
  console.log('Alle Fragen wurden generiert und gespeichert.');
  process.exit(0);
}).catch(error => {
  console.error('Fehler bei der Hauptausführung:', error);
  process.exit(1);
});