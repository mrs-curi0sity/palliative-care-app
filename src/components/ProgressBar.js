// src/components/ProgressBar.js
import React from 'react';

const ProgressBar = ({ correct, incorrect, unseen }) => {
  const total = correct + incorrect + unseen;
  const correctPercentage = (correct / total) * 100;
  const incorrectPercentage = (incorrect / total) * 100;
  const unseenPercentage = (unseen / total) * 100;

  return (
    <div className="progress-bar">
      <div 
        className="progress-segment correct" 
        style={{width: `${correctPercentage}%`}}
        title={`${correct} richtig (${correctPercentage.toFixed(1)}%)`}
      ></div>
      <div 
        className="progress-segment incorrect" 
        style={{width: `${incorrectPercentage}%`}}
        title={`${incorrect} falsch (${incorrectPercentage.toFixed(1)}%)`}
      ></div>
      <div 
        className="progress-segment unseen" 
        style={{width: `${unseenPercentage}%`}}
        title={`${unseen} unbeantwortet (${unseenPercentage.toFixed(1)}%)`}
      ></div>
    </div>
  );
};

export default ProgressBar;