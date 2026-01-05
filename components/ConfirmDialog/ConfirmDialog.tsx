'use client';

import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'destructive' | 'warning' | 'default';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const confirmButtonClass = variant === 'destructive'
        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        : variant === 'warning'
            ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Icon */}
                {variant === 'destructive' && (
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                )}

                {/* Title */}
                <h2
                    id="confirm-dialog-title"
                    className="text-lg font-semibold text-white text-center mb-2"
                >
                    {title}
                </h2>

                {/* Message */}
                <p className="text-gray-400 text-center text-sm mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        autoFocus
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors ${confirmButtonClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
