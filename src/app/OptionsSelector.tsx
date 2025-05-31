"use client";
import React from 'react';
import './OptionsSelector.css';

interface OptionsSelectorProps {
    options: string[];
    selectedOption: string;
    onSelect: (option: string) => void;
    onNext: () => void;
}

const OptionsSelector: React.FC<OptionsSelectorProps> = ({
     options,
     selectedOption,
     onSelect,
     onNext
    }) => {
    const handleOptionClick = (option: string) => {
        onSelect(option);
        onNext();  // Trigger next question immediately
    };

    return (
        <div className="options-container">
            {options.map((option, index) => (
                <div
                    key={index}
                    className={`option ${selectedOption === option ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(option)}
                >
                    {option}
                </div>
            ))}
        </div>
    );
};

export default OptionsSelector;
