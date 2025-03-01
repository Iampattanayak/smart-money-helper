
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface CalculatorInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  showSlider?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  description?: string;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  prefix,
  suffix,
  className,
  showSlider = true,
  inputMode = 'numeric',
  placeholder,
  description,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  // Update input value when the parent value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const parsedValue = Number(newValue);
    if (!isNaN(parsedValue)) {
      // Ensure value is within min/max bounds
      const boundedValue = Math.min(Math.max(parsedValue, min), max);
      onChange(boundedValue);
    }
  };

  const handleSliderChange = (value: number[]) => {
    onChange(value[0]);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Format the number properly on blur
    const parsedValue = Number(inputValue);
    if (!isNaN(parsedValue)) {
      const boundedValue = Math.min(Math.max(parsedValue, min), max);
      onChange(boundedValue);
      setInputValue(boundedValue.toString());
    } else {
      setInputValue(value.toString());
    }
  };

  return (
    <div className={cn("mb-4", className)}>
      <div className="flex justify-between items-baseline mb-2">
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-foreground/80 transition-colors"
        >
          {label}
        </label>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
      
      <div className={cn(
        "relative rounded-md shadow-sm input-highlight",
        "bg-muted/50 border border-border/80",
        "transition-all duration-200",
        isFocused ? "ring-2 ring-primary/20 border-primary/50" : ""
      )}>
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-foreground/70 sm:text-sm">{prefix}</span>
          </div>
        )}
        
        <Input
          id={id}
          inputMode={inputMode}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={cn(
            "border-0 bg-transparent shadow-none h-10",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            prefix ? "pl-8" : "pl-3",
            suffix ? "pr-8" : "pr-3"
          )}
          placeholder={placeholder}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-foreground/70 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      
      {showSlider && (
        <div className="mt-2 px-1">
          <Slider
            defaultValue={[value]}
            value={[Number(value)]}
            min={min}
            max={max}
            step={step}
            onValueChange={handleSliderChange}
            className="my-2"
          />
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">{min}{suffix}</span>
            <span className="text-xs text-muted-foreground">{max}{suffix}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorInput;
