"use client";
import React from 'react';
import './OptionsSelector.css';

interface OptionsSelectorProps {
    options: string[];
    selectedOption: string;
    onSelectAndNext: (option: string) => void;
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
                    className={`option ${selectedOption === option ? 'selected' : ''}`}
                    onClick={() => onSelectAndNext(option)}
                >
                    {option}
                </div>
            ))}
        </div>
    );
};

export default OptionsSelector;
