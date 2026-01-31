import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured, checkConnection } from '../lib/supabase';

export const SupabaseStatus: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error' | 'unconfigured'>('loading');

    useEffect(() => {
        const checkStatus = async () => {
            if (!isSupabaseConfigured()) {
                setStatus('unconfigured');
                return;
            }
            const isConnected = await checkConnection();
            setStatus(isConnected ? 'connected' : 'error');
        };
        checkStatus();
    }, []);

    if (status === 'connected') {
        return (
            <div className="flex items-center space-x-2 px-2 py-1 opacity-50">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-black mono uppercase tracking-widest text-emerald-600">Cloud Synced</span>
            </div>
        );
    }

    const statusConfig = {
        unconfigured: {
            label: 'STORAGE LOCAL ONLY',
            color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            description: 'Missing Supabase credentials in .env.local. Data will not sync.'
        },
        error: {
            label: 'CONNECTION FAILURE',
            color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
            description: 'Connected to Supabase but database unreachable. Check RLS and Table names.'
        },
        loading: {
            label: 'SYNCING...',
            color: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
            description: 'Verifying system connection...'
        }
    };

    const currentConfig = statusConfig[status] || statusConfig.unconfigured;

    return (
        <div className={`mx-4 mb-6 p-4 rounded-2xl border ${currentConfig.color} animate-pulse-subtle`}>
            <div className="flex items-center space-x-2 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'loading' ? 'bg-sky-500' : status === 'error' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                <span className="text-[10px] font-black mono uppercase tracking-widest">{currentConfig.label}</span>
            </div>
            <p className="text-[9px] font-medium opacity-80 leading-tight uppercase mono">{currentConfig.description}</p>
        </div>
    );
};
