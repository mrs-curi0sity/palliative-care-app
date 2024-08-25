// src/components/Learn.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, increment } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

function Learn() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsCollection = collection(db, 'questions');
        const questionSnapshot = await getDocs(questionsCollection);
        const questionList = questionSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionList);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const updateProgress = async (isCorrect) => {
    if (!auth.currentUser) return;

    const userProgressRef = doc(db, 'userProgress', auth.currentUser.uid);
    const categoryProgressRef = doc(userProgressRef, 'categories', currentQuestion.category);

    await setDoc(userProgressRef, { userId: auth.currentUser.uid }, { merge: true });
    
    await setDoc(categoryProgressRef, {
      totalQuestions: increment(1),
      correctAnswers: increment(isCorrect ? 1 : 0)
    }, { merge: true });
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    setShowResult(true);
    updateProgress(selectedAnswer === currentQuestion.correctAnswer);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (questions.length === 0) {
    return <div>Laden der Fragen...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = [currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers];
  const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

  return (
    <div className="learn-container">
      <h1>Lernmodus</h1>
      <div className="question">
        <div className="question-text">{currentQuestion.question}</div>
        <div className="question-info">
          <span>Kategorie: {currentQuestion.category}</span>
          <span>Punkte: {currentQuestion.points}</span>
        </div>
      </div>
      <ul className="answer-list">
        {shuffledAnswers.map((answer, index) => (
          <li key={index}>
            <button 
              className={`answer-button ${selectedAnswer === answer ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(answer)}
            >
              {answer}
            </button>
          </li>
        ))}
      </ul>
      {!showResult && (
        <button className="submit-button" onClick={handleSubmit} disabled={!selectedAnswer}>
          Antwort überprüfen
        </button>
      )}
      {showResult && (
        <div className={`result ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>
          {selectedAnswer === currentQuestion.correctAnswer ? (
            <p>Richtig! Sie haben {currentQuestion.points} Punkte erhalten.</p>
          ) : (
            <p>Falsch. Die richtige Antwort ist: {currentQuestion.correctAnswer}</p>
          )}
          {currentQuestionIndex < questions.length - 1 && (
            <button className="next-button" onClick={handleNextQuestion}>Nächste Frage</button>
          )}
        </div>
      )}
    </div>
  );
}

export default Learn;