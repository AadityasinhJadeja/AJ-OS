import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CustomDatePickerProps {
    value: string; // YYYY-MM-DD format
    onChange: (date: string) => void;
    label?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(() => {
        const date = value ? new Date(value) : new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });
    const [position, setPosition] = useState({ top: 0, left: 0, ready: false });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(value) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Calculate position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const updatePosition = () => {
                if (!buttonRef.current) return;

                const rect = buttonRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                const calendarHeight = 420;
                const calendarWidth = 320;

                let top = rect.bottom + 8;
                let left = rect.left;

                // If calendar would go off-screen bottom, position it above the button
                if (top + calendarHeight > viewportHeight) {
                    top = Math.max(10, rect.top - calendarHeight - 8);
                }

                // If calendar would go off-screen right, align to right edge
                if (left + calendarWidth > viewportWidth) {
                    left = viewportWidth - calendarWidth - 16;
                }

                // Ensure left is never negative
                left = Math.max(10, left);

                setPosition({
                    top,
                    left,
                    ready: true
                });
            };

            // Calculate immediately
            updatePosition();

            // Recalculate on scroll/resize
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);

            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        } else {
            setPosition(prev => ({ ...prev, ready: false }));
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (number | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return 'Select date';
        const date = new Date(dateStr);
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const handleDateClick = (day: number) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const goToToday = () => {
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        onChange(todayStr);
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        setIsOpen(false);
    };

    const days = getDaysInMonth(currentMonth);

    // Calendar dropdown content - rendered via Portal
    const calendarDropdown = isOpen ? createPortal(
        <>
            {/* Backdrop - catches all clicks outside calendar */}
            <div
                className="fixed inset-0 bg-transparent"
                style={{ zIndex: 9998 }}
                onClick={() => setIsOpen(false)}
            />

            {/* Calendar Container */}
            <div
                ref={calendarRef}
                className="fixed bg-white rounded-2xl border border-slate-200 shadow-2xl p-4"
                style={{
                    zIndex: 9999,
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    width: '320px',
                    opacity: position.ready ? 1 : 0,
                    transform: position.ready ? 'translateY(0)' : 'translateY(-10px)',
                    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
                    maxHeight: 'calc(100vh - 40px)',
                    overflowY: 'auto'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-amber-500/10 rounded-lg transition-all text-zinc-400 hover:text-amber-500"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>

                    <button
                        type="button"
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-amber-500/10 rounded-lg transition-all text-zinc-400 hover:text-amber-500"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-wider py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        dayDate.setHours(0, 0, 0, 0);
                        const isToday = dayDate.getTime() === today.getTime();
                        const isSelected = selectedDate && dayDate.getTime() === selectedDate.getTime();
                        const isPast = dayDate < today;

                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleDateClick(day)}
                                className={`aspect-square rounded-lg text-sm font-bold transition-all ${isSelected
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                                    : isToday
                                        ? 'bg-sky-500/10 text-sky-600 border border-sky-500/30 font-black'
                                        : isPast
                                            ? 'text-zinc-300 hover:bg-zinc-50 hover:text-zinc-500'
                                            : 'text-zinc-700 hover:bg-emerald-50 hover:text-emerald-600'
                                    }`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
                    <button
                        type="button"
                        onClick={() => {
                            onChange('');
                            setIsOpen(false);
                        }}
                        className="text-xs font-bold text-zinc-400 hover:text-rose-500 transition-all uppercase tracking-wider"
                    >
                        Clear
                    </button>
                    <button
                        type="button"
                        onClick={goToToday}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20"
                    >
                        Today
                    </button>
                </div>
            </div>
        </>,
        document.body
    ) : null;

    return (
        <div className="relative">
            {label && (
                <label className="block text-[9px] font-black text-zinc-500 uppercase mono tracking-[0.2em] px-1 mb-2">
                    {label}
                </label>
            )}

            {/* Trigger Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-medium text-left flex items-center justify-between group hover:bg-slate-100/80 ${isOpen
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
            >
                <span className={value ? 'text-slate-800' : 'text-zinc-500'}>
                    {formatDisplayDate(value)}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'text-emerald-500 rotate-180' : 'text-slate-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </button>

            {/* Calendar rendered via Portal - outside of component hierarchy */}
            {calendarDropdown}
        </div>
    );
};
