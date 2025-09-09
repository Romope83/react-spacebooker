import React from 'react';

export default function Modal({ children, isOpen, onClose, title }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-light leading-none">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};