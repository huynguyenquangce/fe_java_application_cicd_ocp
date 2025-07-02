
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, PlusCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SymptomInputProps {
  selectedSymptoms: string[];
  onAddSymptom: (symptom: string) => void;
  onRemoveSymptom: (symptom: string) => void;
  suggestedSymptoms?: string[];
}

const SymptomInput: React.FC<SymptomInputProps> = ({
  selectedSymptoms,
  onAddSymptom,
  onRemoveSymptom,
  suggestedSymptoms = []
}) => {
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Common symptoms for suggestions if none provided
  const defaultSymptoms = [
    "Headache", "Fever", "Cough", "Sore throat", "Fatigue",
    "Nausea", "Back pain", "Shortness of breath", "Dizziness",
    "Chest pain", "Abdominal pain", "Joint pain", "Rash", "Chills"
  ];
  
  const allSuggestions = suggestedSymptoms.length > 0 ? suggestedSymptoms : defaultSymptoms;
  
  // Filtered suggestions based on input
  const filteredSuggestions = allSuggestions.filter(
    symptom => 
      symptom.toLowerCase().includes(inputValue.toLowerCase()) && 
      !selectedSymptoms.includes(symptom)
  );
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddSymptom(inputValue.trim());
    }
  };
  
  const handleAddSymptom = (symptom: string) => {
    if (symptom.trim() && !selectedSymptoms.includes(symptom)) {
      onAddSymptom(symptom);
      setInputValue('');
      inputRef.current?.focus();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Focus the input when clicking on the selected symptoms container
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };
  
  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  
  return (
    <div className="space-y-2">
      <div 
        className={`border ${focused ? 'border-primary ring-1 ring-primary' : 'border-input'} rounded-md px-3 py-2 min-h-[80px] flex flex-wrap gap-2 items-start cursor-text transition-colors`}
        onClick={handleContainerClick}
      >
        {selectedSymptoms.map((symptom, i) => (
          <Badge key={i} variant="secondary" className="px-3 py-1 animate-fade-in">
            {symptom}
            <button
              className="ml-2 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSymptom(symptom);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={selectedSymptoms.length ? "Add another symptom" : "Type a symptom and press Enter"}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            className="border-0 shadow-none pl-8 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
      
      {/* Suggestions */}
      {focused && inputValue && filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {filteredSuggestions.slice(0, 5).map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleAddSymptom(suggestion)}
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              {suggestion}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Common symptoms */}
      {focused && !inputValue && (
        <div className="space-y-2 animate-fade-in">
          <div className="text-xs text-muted-foreground">Common symptoms:</div>
          <div className="flex flex-wrap gap-2">
            {defaultSymptoms.slice(0, 8)
              .filter(symptom => !selectedSymptoms.includes(symptom))
              .map((symptom) => (
                <Badge
                  key={symptom}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => handleAddSymptom(symptom)}
                >
                  <PlusCircle className="mr-1 h-3 w-3" />
                  {symptom}
                </Badge>
              ))
            }
          </div>
        </div>
      )}
      
      {selectedSymptoms.length > 0 && (
        <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
          <div>{selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected</div>
          <button
            className="hover:text-foreground transition-colors"
            onClick={() => {
              selectedSymptoms.forEach(s => onRemoveSymptom(s));
              inputRef.current?.focus();
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default SymptomInput;
