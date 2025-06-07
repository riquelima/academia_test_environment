import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TagInputProps {
  id: string;
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  error?: string;
}

const TagInput: React.FC<TagInputProps> = ({ id, label, value, onChange, suggestions = [], placeholder, error }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const updateFilteredSuggestions = useCallback((currentInput: string) => {
    const lowerInput = currentInput.toLowerCase();
    let newFiltered: string[];

    if (currentInput) {
      newFiltered = suggestions
        .filter(suggestion => suggestion.toLowerCase().includes(lowerInput) && !value.includes(suggestion))
        .slice(0, 7);
    } else {
      newFiltered = suggestions
        .filter(suggestion => !value.includes(suggestion))
        .slice(0, 10);
    }
    
    setFilteredSuggestions(newFiltered);
    setIsSuggestionsOpen(newFiltered.length > 0);
    setActiveIndex(-1);
  }, [suggestions, value]);

  useEffect(() => {
    if (isSuggestionsOpen || inputValue) {
      updateFilteredSuggestions(inputValue);
    }
  }, [inputValue, suggestions, value, updateFilteredSuggestions, isSuggestionsOpen]);
  
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isSuggestionsOpen && e.target.value) {
        updateFilteredSuggestions(e.target.value);
    } else if (!e.target.value) {
        updateFilteredSuggestions('');
    }
  };

  const handleInputFocus = () => {
    updateFilteredSuggestions(inputValue);
  };

  const addTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
    setIsSuggestionsOpen(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isSuggestionsOpen && activeIndex > -1 && filteredSuggestions[activeIndex]) {
          addTag(filteredSuggestions[activeIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue);
        }
        break;
      case 'Backspace':
        if (!inputValue && value.length > 0) {
          removeTag(value[value.length - 1]);
          setIsSuggestionsOpen(false);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isSuggestionsOpen || filteredSuggestions.length === 0) {
          updateFilteredSuggestions(inputValue); 
        }
        if (filteredSuggestions.length > 0) { 
             setActiveIndex(prev => (prev + 1) % filteredSuggestions.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isSuggestionsOpen && filteredSuggestions.length > 0) {
          setActiveIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        }
        break;
      case 'Escape':
        setIsSuggestionsOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">{label}</label>
      <div className="relative">
        <div 
            className="flex flex-wrap gap-2 p-2.5 bg-gray-50 dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-lg items-center min-h-[46px]"
            onClick={() => inputRef.current?.focus()}
        >
          {value.map(tag => (
            <span key={tag} className="flex items-center bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange text-xs font-semibold px-2.5 py-1 rounded-full border border-brand-orange/30 dark:border-brand-orange/40">
              {tag}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeTag(tag);}}
                className="ml-1.5 text-brand-orange hover:text-orange-700 dark:hover:text-orange-300 text-sm font-bold"
                aria-label={`Remover ${tag}`}
              >
                &times;
              </button>
            </span>
          ))}
          <input
            id={id}
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-grow p-0.5 bg-transparent text-dark-text dark:text-light-text outline-none placeholder-medium-text-light dark:placeholder-medium-text text-sm min-w-[100px]"
            autoComplete="off"
          />
        </div>
        {isSuggestionsOpen && filteredSuggestions.length > 0 && (
          <ul 
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-light-bg-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                onClick={() => addTag(suggestion)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`p-2 text-sm cursor-pointer hover:bg-brand-orange/10 dark:hover:bg-brand-orange/20 ${index === activeIndex ? 'bg-brand-orange/20 dark:bg-brand-orange/30 text-brand-orange' : 'text-dark-text dark:text-light-text'}`}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TagInput;