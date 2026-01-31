
import React, { useState, useEffect } from 'react';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose, onAction }) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const commands = [
    { key: 'd', label: 'Go Home', action: 'dashboard' },
    { key: 'c', label: 'Log Daily Activity', action: 'daily' },
    { key: 'i', label: 'Capture Quick Idea', action: 'ideas' },
    { key: 'b', label: 'Capture Discovery', action: 'discoveries' },
    { key: 'n', label: 'Network / Contacts', action: 'contacts' },
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(input.toLowerCase()) ||
    c.key.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-slate-950/40 backdrop-blur-2xl transition-all animate-show duration-300">
      <div className="w-full max-w-xl glass-panel !bg-slate-900/60 border border-white/5 rounded-[3rem] shadow-[0_0_150px_rgba(0,0,0,0.8)] overflow-hidden animate-slide-up">
        <div className="flex items-center px-10 border-b border-white/5 bg-white/[0.02]">
          <span className="text-sky-500/50 mono text-[10px] font-black mr-6 uppercase tracking-[0.3em]">Operator &gt;</span>
          <input
            autoFocus
            className="flex-1 bg-transparent py-8 text-lg outline-none placeholder:text-slate-700 tracking-tight font-heading font-black text-white"
            placeholder="Execute protocol..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered.length > 0) {
                onAction(filtered[0].action);
                onClose();
              }
            }}
          />
          <span className="text-[9px] text-slate-500 mono px-3 py-1.5 border border-white/5 rounded-xl bg-white/[0.02] font-black uppercase tracking-widest">ESC_Cancel</span>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
          {filtered.map((cmd) => (
            <button
              key={cmd.key}
              onClick={() => {
                onAction(cmd.action);
                onClose();
              }}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/[0.03] rounded-[2rem] transition-all text-sm group relative overflow-hidden"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-sky-500 scale-y-0 group-hover:scale-y-100 transition-transform"></div>
              <span className="text-slate-400 font-bold tracking-tight group-hover:text-white transition-colors">{cmd.label}</span>
              <div className="flex items-center space-x-3">
                <span className="text-[9px] text-slate-600 mono uppercase font-black tracking-widest group-hover:text-sky-500/40 transition-colors">Invoke_Seq:</span>
                <span className="text-[10px] text-slate-200 bg-slate-950/60 px-3 py-1.5 rounded-xl mono border border-white/5 group-hover:text-sky-400 group-hover:border-sky-500/20 transition-all font-black shadow-inner tracking-widest">{cmd.key.toUpperCase()}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-16 text-center space-y-3">
              <div className="w-12 h-[1px] bg-slate-800 mx-auto"></div>
              <p className="text-slate-600 text-[10px] mono uppercase font-black tracking-[0.4em]">No_Valid_Sequence</p>
              <p className="text-slate-800 text-[9px] mono uppercase font-bold">System_Awaiting_Authorized_Input</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
