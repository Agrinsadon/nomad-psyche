"use client";
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import "./CompletionScreen.css";

interface CompletionScreenProps {
  resultCategory: string | null;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ resultCategory }) => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [typedText, setTypedText] = useState("");

  const fullText = "Thank you for your answers!";

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setShowCheckmark(true);
    }, 500);

    const typeTimeout = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setTypedText((prev) => prev + fullText.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 80);
    }, 1000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(typeTimeout);
    };
  }, []);

  return (
    <div className="completion-container">
      <span className="thank-you-text">{typedText}</span>
      <div className={`checkmark ${showCheckmark ? "show" : ""}`}>
        {showCheckmark && <Check size={48} />}
      </div>

      {resultCategory && (
        <p className="result-category">
          You seem to relate most with: <strong>{resultCategory}</strong>
        </p>
      )}
    </div>
  );
};

export default CompletionScreen;
