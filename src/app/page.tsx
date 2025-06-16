"use client";
import React, { useState, useEffect } from "react";
import OptionsSelector from "./OptionsSelector";
import Spinner from "./spinner";
import CompletionScreen from "./CompletionScreen";
import "./page.css";

interface Option {
  text: string;
  value: number;
}

interface Question {
  question: string;
  options?: Option[];
  category?: string;
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<Option | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [resultCategory, setResultCategory] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<
    { question: string; answer: string; value: number; category?: string | null }[]
  >([]);

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
      setAnswer(null);
      setUserAnswers([]);
      setResultCategory(null);
    } else {
      alert("No questions available");
    }
  };

  const handleNext = (selectedAnswer?: Option) => {
    const finalAnswer = selectedAnswer ?? answer;
    if (!finalAnswer) return;

    if (currentQuestion) {
      setUserAnswers((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          answer: finalAnswer.text,
          value: finalAnswer.value,
          category: currentQuestion.category ?? null,
        },
      ]);
    }

    setAnswer(null);

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

  const handleSelectAndNext = (option: Option) => {
    setAnswer(option);
    handleNext(option);
  };

  const saveAnswers = async () => {
    const categoryScores: Record<string, number> = {};

    for (const ans of userAnswers) {
      if (!ans.category || ans.value === undefined) continue;
      categoryScores[ans.category] = (categoryScores[ans.category] || 0) + ans.value;
    }

    const dominantCategory =
      Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unknown";

    setResultCategory(dominantCategory);

    try {
      const response = await fetch("http://localhost:8000/api/save-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: userAnswers,
          result: dominantCategory,
          timestamp: new Date().toISOString(),
        }),
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
  if (!questions.length) return <div>No questions found</div>;

  return (
    <div className="home">
      {completed ? (
        <CompletionScreen resultCategory={resultCategory} />
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
            <p className="question">
              {currentQuestion?.question.trim().endsWith("?")
                ? currentQuestion.question
                : `${currentQuestion?.question}?`}
            </p>
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
                    value={answer?.text ?? ""}
                    onChange={(e) =>
                      setAnswer({
                        text: e.target.value,
                        value: 0,
                      })
                    }
                    placeholder="Type your answer..."
                  />
                  <button
                    className="next-button"
                    onClick={() => handleNext()}
                    disabled={!answer?.text.trim()}
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
