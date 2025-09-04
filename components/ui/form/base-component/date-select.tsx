import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  isValid,
  parse,
} from 'date-fns';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

type DateSize = 'sm' | 'md' | 'lg';

interface DateSelectProps {
  label?: string;
  size?: DateSize;
  value?: string; // ISO format date (e.g. 2025-07-24)
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  onChange?: (date: string | null) => void;
}

const sizeClasses = {
  sm: 'text-sm py-2 px-3',
  md: 'text-base py-2.5 px-4',
  lg: 'text-lg py-3 px-5',
};

export const DateSelect: React.FC<DateSelectProps> = ({
  label,
  size = 'md',
  value,
  minDate,
  maxDate,
  disabled = false,
  onChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? parseISO(value) : new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? parseISO(value) : null);
  const [inputValue, setInputValue] = useState(value ? value : '');

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const handleSelectDate = (date: Date) => {
    if (disabled) return;
    setSelectedDate(date);
    const iso = format(date, 'yyyy-MM-dd');
    setInputValue(iso);
    onChange?.(iso);
    setShowCalendar(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const parsed = parse(val, 'yyyy-MM-dd', new Date());
    if (isValid(parsed)) {
      setSelectedDate(parsed);
      setCurrentMonth(parsed);
      onChange?.(format(parsed, 'yyyy-MM-dd'));
    } else {
      onChange?.(null); // Nếu không hợp lệ thì clear value
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    setInputValue('');
    onChange?.(null);
  };

  const isDisabled = (date: Date) => {
    if (minDate && date < parseISO(minDate)) return true;
    if (maxDate && date > parseISO(maxDate)) return true;
    return false;
  };

  return (
    <div className="flex flex-col space-y-1 relative w-64">
      {label && <label className="form-label">{label}</label>}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="YYYY-MM-DD"
          disabled={disabled}
          onClick={() => !disabled && setShowCalendar((p) => !p)}
          className={`input-field pr-10 ${sizeClasses[size]} ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
        />
        {inputValue && !disabled && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-app-red-DEFAULT transition cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            {CloseIcon}
          </span>
        )}
      </div>

      {showCalendar && !disabled && (
        <div className="absolute top-full mt-2 w-72 bg-neutral-800 rounded-xl shadow-lg border border-neutral-700 p-4 z-50">
          <div className="flex justify-between items-center mb-4">
            <button
              className="p-1 hover:bg-neutral-700 rounded"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              {ChevronLeftIcon}
            </button>
            <span className="text-neutral-200 font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
            <button
              className="p-1 hover:bg-neutral-700 rounded"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              {ChevronRightIcon}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm text-neutral-400">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2 text-center">
            {days.map((day) => {
              const selected = selectedDate && isSameDay(day, selectedDate);
              const today = isToday(day);
              const disabledDay = isDisabled(day);
              return (
                <button
                  key={day.toString()}
                  disabled={disabledDay}
                  onClick={() => handleSelectDate(day)}
                  className={`p-2 rounded-full transition ${
                    selected
                      ? 'bg-app-blue-DEFAULT text-white'
                      : today
                      ? 'border border-app-blue-light text-neutral-100'
                      : isSameMonth(day, currentMonth)
                      ? 'text-neutral-200 hover:bg-neutral-700'
                      : 'text-neutral-500'
                  } ${disabledDay ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Showcase
export const DateSelectShowcase = () => {
  const [date, setDate] = useState<string | null>(null);

  return (
    <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-700 space-y-4 w-80">
      <DateSelect
        label="Pick a date"
        value={date || undefined}
        onChange={(val) => setDate(val)}
        minDate="2025-01-01"
        maxDate="2025-12-31"
      />
      <p className="text-neutral-400 text-sm">Selected Date: {date || 'None'}</p>
    </div>
  );
};
