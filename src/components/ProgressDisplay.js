// src/components/ProgressDisplay.js
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function ProgressDisplay() {
  const [progress, setProgress] = useState({});
  const auth = getAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!auth.currentUser) return;

      const progressSnapshot = await getDocs(collection(db, `userProgress/${auth.currentUser.uid}/categories`));
      const progressData = {};
      progressSnapshot.forEach(doc => {
        const data = doc.data();
        progressData[doc.id] = {
          percentage: (data.correctAnswers / data.totalQuestions) * 100 || 0,
          totalQuestions: data.totalQuestions
        };
      });
      setProgress(progressData);
    };

    fetchProgress();
  }, [auth.currentUser]);

  return (
    <div>
      <h2>Ihr Fortschritt</h2>
      {Object.entries(progress).map(([category, data]) => (
        <div key={category}>
          <h3>{category}</h3>
          <p>Korrekt beantwortet: {data.percentage.toFixed(2)}%</p>
          <p>Gesamtfragen: {data.totalQuestions}</p>
        </div>
      ))}
    </div>
  );
}

export default ProgressDisplay;