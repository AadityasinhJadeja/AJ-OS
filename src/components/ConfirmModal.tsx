import React, { useState, useCallback, createContext, useContext } from 'react';

interface ConfirmModalState {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

interface ConfirmContextType {
    showConfirm: (message: string) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        // Fallback to native confirm if context not available
        return {
            showConfirm: (message: string) => Promise.resolve(window.confirm(message)),
        };
    }
    return context;
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalState, setModalState] = useState<ConfirmModalState>({
        isOpen: false,
        message: '',
        onConfirm: () => { },
        onCancel: () => { },
    });

    const showConfirm = useCallback((message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                message,
                onConfirm: () => {
                    setModalState(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setModalState(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                },
            });
        });
    }, []);

    return (
        <ConfirmContext.Provider value={{ showConfirm }}>
            {children}
            {modalState.isOpen && (
                <ConfirmModal
                    message={modalState.message}
                    onConfirm={modalState.onConfirm}
                    onCancel={modalState.onCancel}
                />
            )}
        </ConfirmContext.Provider>
    );
};

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300 px-4"
            onClick={onCancel}
        >
            <div
                className="bg-white border border-slate-200 rounded-[2rem] p-8 max-w-[400px] w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center">
                    {/* Icon Section */}
                    <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                    </div>

                    {/* Content Section */}
                    <h3
                        className="text-2xl font-black mb-3 tracking-tight"
                        style={{ color: '#0f172a', textTransform: 'none' }} // Override global uppercase and color
                    >
                        Confirm Deletion
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed mb-8 px-2">
                        {message || "Are you sure you want to delete this? This action will permanently remove the item and cannot be undone."}
                    </p>

                    {/* Actions Section */}
                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <span>Delete permanently</span>
                        </button>

                        <button
                            onClick={onCancel}
                            className="w-full py-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 font-bold rounded-2xl transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
