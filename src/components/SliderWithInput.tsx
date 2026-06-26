import React, { useState, useEffect } from 'react';
import { TenureUnit } from '../types';
import { formatIndianCurrency, formatIndianWord } from '../utils/calculatorMath';

interface SliderWithInputProps {
  idPrefix: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  isCurrency?: boolean;
  isPercent?: boolean;
  isTenure?: boolean;
  tenureUnit?: TenureUnit;
}

export default function SliderWithInput({
  idPrefix,
  label,
  value,
  min,
  max,
  step,
  onChange,
  isCurrency = false,
  isPercent = false,
  isTenure = false,
  tenureUnit = 'YEARS',
}: SliderWithInputProps) {
  // Local state to manage the text typed by the user, avoiding formatting glitches during typing
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Sync state when external value changes (e.g., slider drag)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString());
    }
  }, [value, isFocused]);

  // Clean raw digits/decimals
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    
    // Allow typing only numbers and at most one decimal point (for interest rates)
    const sanitized = raw.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimals
    const parts = sanitized.split('.');
    const cleanValue = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    
    setInputValue(cleanValue);

    const parsed = parseFloat(cleanValue);
    if (!isNaN(parsed)) {
      // Allow updates to parent even while typing if within bounds or temporary states
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    let parsed = parseFloat(inputValue);
    
    if (isNaN(parsed)) {
      parsed = min;
    } else if (parsed < min) {
      parsed = min;
    } else if (parsed > max) {
      parsed = max;
    }
    
    // Round to step if necessary
    const rounded = Math.round(parsed / step) * step;
    const clampedRounded = Math.min(max, Math.max(min, Number(rounded.toFixed(2))));
    
    onChange(clampedRounded);
    setInputValue(clampedRounded.toString());
  };

  const handleFocus = () => {
    setIsFocused(true);
    // When focusing, show raw number for easy backspacing and modification
    setInputValue(value.toString());
  };

  // Human readable labels
  const getDisplayMin = () => {
    if (isCurrency) return formatIndianWord(min);
    if (isPercent) return `${min}%`;
    return `${min} ${tenureUnit === 'YEARS' ? 'Y' : 'M'}`;
  };

  const getDisplayMax = () => {
    if (isCurrency) return formatIndianWord(max);
    if (isPercent) return `${max}%`;
    return `${max} ${tenureUnit === 'YEARS' ? 'Y' : 'M'}`;
  };

  // Get current word helper underneath the field
  const getWordHelper = () => {
    if (isCurrency && value >= 1000) {
      return formatIndianWord(value);
    }
    return '';
  };

  return (
    <div className="flex flex-col space-y-3 pb-5 border-b border-slate-100 last:border-b-0 last:pb-0" id={`slider-group-${idPrefix}`}>
      {/* Label and Input Header */}
      <div className="flex flex-row justify-between items-center gap-4">
        <label className="text-sm font-sans font-semibold text-slate-700 select-none">
          {label}
        </label>
        
        {/* Customized Numeric Input Box */}
        <div 
          className={`relative flex items-center bg-emerald-50/40 rounded-lg px-3 py-1.5 border-2 transition-all duration-200 w-36 md:w-44 ${
            isFocused ? 'border-groww-green bg-white shadow-sm shadow-emerald-50' : 'border-transparent hover:border-slate-200'
          }`}
        >
          {isCurrency && (
            <span className="text-sm font-sans font-bold text-groww-green mr-1.5 select-none">
              ₹
            </span>
          )}
          
          <input
            id={`input-${idPrefix}`}
            type="text"
            inputMode={isPercent ? 'decimal' : 'numeric'}
            value={
              isFocused
                ? inputValue
                : isCurrency
                ? new Intl.NumberFormat('en-IN').format(value)
                : value
            }
            onChange={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full bg-transparent font-mono font-bold text-slate-800 text-sm md:text-base outline-none text-right"
          />
          
          {isPercent && (
            <span className="text-sm font-sans font-bold text-groww-green ml-1 select-none">
              %
            </span>
          )}
          
          {isTenure && (
            <span className="text-xs font-sans font-bold text-slate-500 ml-1.5 uppercase select-none">
              {tenureUnit === 'YEARS' ? 'Yr' : 'Mo'}
            </span>
          )}
        </div>
      </div>

      {/* Synchronized Custom Slider Bar */}
      <div className="relative flex flex-col space-y-1">
        <input
          id={`range-slider-${idPrefix}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onChange(val);
          }}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-150"
          style={{
            background: `linear-gradient(to right, #00D09C 0%, #00D09C ${
              ((value - min) / (max - min)) * 100
            }%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`,
          }}
        />

        {/* Footnotes for min, max, and descriptive word helper */}
        <div className="flex flex-row justify-between text-[11px] font-sans font-medium text-slate-400 select-none">
          <span>{getDisplayMin()}</span>
          {getWordHelper() && (
            <span className="text-groww-green font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              {getWordHelper()}
            </span>
          )}
          <span>{getDisplayMax()}</span>
        </div>
      </div>
    </div>
  );
}
