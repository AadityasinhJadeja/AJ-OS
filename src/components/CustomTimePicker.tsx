import React, { useState, useRef, useEffect } from 'react';

interface CustomTimePickerProps {
    value: string; // HH:MM format
    onChange: (time: string) => void;
    label?: string;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState(() => {
        if (!value) return 12;
        const [h] = value.split(':');
        let hour = parseInt(h);
        if (hour === 0) return 12;
        if (hour > 12) return hour - 12;
        return hour;
    });
    const [minutes, setMinutes] = useState(() => {
        if (!value) return 0;
        const [, m] = value.split(':');
        return parseInt(m);
    });
    const [period, setPeriod] = useState<'AM' | 'PM'>(() => {
        if (!value) return 'PM';
        const [h] = value.split(':');
        return parseInt(h) >= 12 ? 'PM' : 'AM';
    });

    const hoursRef = useRef<HTMLDivElement>(null);
    const minutesRef = useRef<HTMLDivElement>(null);

    const formatDisplayTime = (timeStr: string) => {
        if (!timeStr) return 'Select time';
        const [h, m] = timeStr.split(':');
        let hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        if (hour === 0) hour = 12;
        if (hour > 12) hour -= 12;
        return `${hour}:${m} ${ampm}`;
    };

    const handleApply = () => {
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 = hours + 12;
        if (period === 'AM' && hours === 12) hour24 = 0;

        const timeStr = `${String(hour24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        onChange(timeStr);
        setIsOpen(false);
    };

    const scrollToSelected = () => {
        setTimeout(() => {
            if (hoursRef.current) {
                const selectedHour = hoursRef.current.querySelector('[data-selected="true"]');
                if (selectedHour) {
                    selectedHour.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
            }
            if (minutesRef.current) {
                const selectedMinute = minutesRef.current.querySelector('[data-selected="true"]');
                if (selectedMinute) {
                    selectedMinute.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
            }
        }, 50);
    };

    useEffect(() => {
        if (isOpen) {
            scrollToSelected();
        }
    }, [isOpen]);

    return (
        <div className={`relative ${isOpen ? 'z-50' : 'z-auto'}`}>
            {label && (
                <label className="block text-[9px] font-black text-zinc-500 uppercase mono tracking-[0.2em] px-1 mb-2">
                    {label}
                </label>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-50 border border-amber-500/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all font-medium text-main text-left flex items-center justify-between group hover:border-amber-500/40 hover:bg-slate-100/50"
            >
                <span className={value ? 'text-main' : 'text-zinc-600'}>
                    {formatDisplayTime(value)}
                </span>
                <svg
                    className={`w-4 h-4 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Time Picker Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Picker */}
                    <div className="absolute z-50 mt-2 w-72 glass-card rounded-2xl border border-amber-500/10 shadow-xl shadow-amber-900/5 p-5 animate-slide-up bg-white">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <div className="text-3xl font-black text-amber-400 mono tracking-tight">
                                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
                                <span className="text-lg ml-2 text-amber-500">{period}</span>
                            </div>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mt-1">Select Time</p>
                        </div>

                        {/* Time Selectors */}
                        <div className="flex gap-2 mb-4">
                            {/* Hours */}
                            <div className="flex-1">
                                <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-2 text-center">Hour</p>
                                <div
                                    ref={hoursRef}
                                    className="h-40 overflow-y-auto custom-scrollbar bg-slate-50 rounded-xl border border-zinc-100"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                        <button
                                            key={h}
                                            type="button"
                                            data-selected={hours === h}
                                            onClick={() => setHours(h)}
                                            className={`w-full py-2.5 text-center text-sm font-bold transition-all ${hours === h
                                                ? 'bg-amber-500 text-white shadow-lg'
                                                : 'text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400'
                                                }`}
                                        >
                                            {String(h).padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Minutes */}
                            <div className="flex-1">
                                <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-2 text-center">Minute</p>
                                <div
                                    ref={minutesRef}
                                    className="h-40 overflow-y-auto custom-scrollbar bg-slate-50 rounded-xl border border-zinc-100"
                                >
                                    {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            data-selected={minutes === m}
                                            onClick={() => setMinutes(m)}
                                            className={`w-full py-2.5 text-center text-sm font-bold transition-all ${minutes === m
                                                ? 'bg-amber-500 text-white shadow-lg'
                                                : 'text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400'
                                                }`}
                                        >
                                            {String(m).padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* AM/PM */}
                            <div className="w-16">
                                <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-2 text-center">Period</p>
                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPeriod('AM')}
                                        className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${period === 'AM'
                                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                                            : 'bg-slate-50 text-zinc-500 hover:bg-sky-500/10 hover:text-sky-600 border border-zinc-100'
                                            }`}
                                    >
                                        AM
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPeriod('PM')}
                                        className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${period === 'PM'
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                            : 'bg-slate-50 text-zinc-500 hover:bg-indigo-500/10 hover:text-indigo-600 border border-zinc-100'
                                            }`}
                                    >
                                        PM
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Select */}
                        <div className="mb-4">
                            <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-2">Quick Select</p>
                            <div className="grid grid-cols-4 gap-1.5">
                                {[
                                    { label: '9 AM', h: 9, m: 0, p: 'AM' as const },
                                    { label: '12 PM', h: 12, m: 0, p: 'PM' as const },
                                    { label: '3 PM', h: 3, m: 0, p: 'PM' as const },
                                    { label: '6 PM', h: 6, m: 0, p: 'PM' as const },
                                ].map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => {
                                            setHours(preset.h);
                                            setMinutes(preset.m);
                                            setPeriod(preset.p);
                                        }}
                                        className="py-2 bg-white/5 hover:bg-purple-500/10 text-zinc-400 hover:text-purple-400 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-white/5 hover:border-purple-500/20"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('');
                                    setIsOpen(false);
                                }}
                                className="flex-1 py-2.5 bg-slate-50 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-zinc-100 hover:border-rose-200"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={handleApply}
                                className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
