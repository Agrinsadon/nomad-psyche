"use client";
import React, { useState } from 'react';
import questions from './questions.json';
import './page.css';

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const handleStart = () => {
    setStarted(true);
  };

  const handleNext = () => {
    if (answer.trim() === "") return; // extra safety but now button is disabled
    console.log(`Answer to "${questions[currentQuestionIndex].question}": ${answer}`);
    setAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Thank you for completing the questions!");
      setStarted(false);
      setCurrentQuestionIndex(0);
    }
  };

  return (
      <div className="home">
        {!started ? (
            <button className="get-started-button" onClick={handleStart}>
              Get Started
            </button>
        ) : (
            <div
                key={currentQuestionIndex}  // triggers re-mount and fade-in animation
                className="question-container"
            >
              <p className="question">{questions[currentQuestionIndex].question}</p>
              <div className="input-container">
                <input
                    type="text"
                    className="answer-input"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer..."
                />
                <button
                    className="next-button"
                    onClick={handleNext}
                    disabled={answer.trim() === ""}
                >
                  Next
                </button>
              </div>
            </div>
        )}
      </div>
  );
}
