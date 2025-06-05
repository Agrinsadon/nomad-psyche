"use client";

import React, { useState, useEffect } from "react";
import OptionsSelector from "./OptionsSelector";
import Spinner from "./spinner";
import "./page.css";

interface Question {
  question: string;
  options?: string[];
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("http://localhost:8000/api/questions");
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const currentQuestion: Question | undefined = questions[currentQuestionIndex];

  const handleStart = () => {
    if (questions.length > 0) {
      setStarted(true);
      setCurrentQuestionIndex(0);
      setAnswer("");
    } else {
      alert("No questions available");
    }
  };

  const handleNext = (selectedAnswer?: string) => {
    const finalAnswer = selectedAnswer ?? answer;
    if (finalAnswer.trim() === "") return;
    console.log(`Answer to "${currentQuestion?.question}": ${finalAnswer}`);
    setAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Thank you for completing the questions!");
      setStarted(false);
      setCurrentQuestionIndex(0);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectAndNext = (option: string) => {
    setAnswer(option);
    handleNext(option);
  };

  if (loading) return <Spinner />;

  if (!questions.length)
    return <div>No questions found in the database.</div>;

  return (
    <div className="home">
      {!started ? (
        <button className="get-started-button" onClick={handleStart}>
          Get Started
        </button>
      ) : (
        <>
          <button
            className="back-button"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
          >
            ←
          </button>

          <div key={currentQuestionIndex} className="question-container">
            <p className="question">{currentQuestion?.question}</p>
            <div className="input-container">
              {currentQuestion?.options ? (
                <OptionsSelector
                  options={currentQuestion.options}
                  selectedOption={answer}
                  onSelectAndNext={handleSelectAndNext}
                />
              ) : (
                <>
                  <input
                    type="text"
                    className="answer-input"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer..."
                  />
                  <button
                    className="next-button"
                    onClick={() => handleNext()}
                    disabled={answer.trim() === ""}
                  >
                    Next
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
