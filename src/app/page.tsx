"use client";
import React, { useState, useEffect } from "react";
import OptionsSelector from "./OptionsSelector";
import Spinner from "./spinner";
import CompletionScreen from "./CompletionScreen";
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
  const [completed, setCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ question: string; answer: string }[]>([]);

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
      setUserAnswers([]);
    } else {
      alert("No questions available");
    }
  };

  const handleNext = (selectedAnswer?: string) => {
    const finalAnswer = selectedAnswer ?? answer;
    if (finalAnswer.trim() === "") return;

    if (currentQuestion) {
      setUserAnswers((prev) => [...prev, { question: currentQuestion.question, answer: finalAnswer }]);
    }

    setAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      saveAnswers();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setUserAnswers((prev) => prev.slice(0, -1));
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectAndNext = (option: string) => {
    setAnswer(option);
    handleNext(option);
  };

  const saveAnswers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/save-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: userAnswers }),
      });
      if (!response.ok) throw new Error("Failed to save answers");
      await response.json();
    } catch (error) {
      console.error("Failed to save answers:", error);
    } finally {
      setStarted(false);
      setCurrentQuestionIndex(0);
      setCompleted(true);
    }
  };

  if (loading) return <Spinner />;
  if (!questions.length) return <Spinner />;

  return (
    <div className="home">
      {completed ? (
        <CompletionScreen />
      ) : !started ? (
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
