"use client";
import React from 'react';
import './OptionsSelector.css';

interface Option {
  text: string;
  value: number;
}

interface OptionsSelectorProps {
  options: Option[];
  selectedOption: Option | null;
  onSelectAndNext: (option: Option) => void;
}

const OptionsSelector: React.FC<OptionsSelectorProps> = ({
  options,
  selectedOption,
  onSelectAndNext
}) => {
  return (
    <div className="options-container">
      {options.map((option, index) => (
        <div
          key={index}
          className={`option ${selectedOption?.value === option.value ? 'selected' : ''}`}
          onClick={() => onSelectAndNext(option)}
        >
          {option.text}
        </div>
      ))}
    </div>
  );
};

export default OptionsSelector;
