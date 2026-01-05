'use client';

import React, { useEffect, useCallback } from 'react';
import ResumePreview from '@/components/ResumePreview/ResumePreview';
import { ResumeJSON } from '@/types/resume';

interface FullscreenPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ResumeJSON;
}

export default function FullscreenPreviewModal({
    isOpen,
    onClose,
    data,
}: FullscreenPreviewModalProps) {
    const [zoom, setZoom] = React.useState(1);

    // Handle escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-950/95 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-900 border-b border-gray-700 px-4 py-3">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-white">Full Preview</h2>

                    {/* Zoom controls */}
                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg border border-gray-600 px-2">
                        <button
                            onClick={() => setZoom(z => Math.max(0.25, z - 0.1))}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="text-sm text-gray-300 font-medium min-w-[50px] text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    {/* Quick zoom buttons */}
                    <div className="flex gap-1">
                        {[0.5, 0.75, 1, 1.25, 1.5].map((z) => (
                            <button
                                key={z}
                                onClick={() => setZoom(z)}
                                className={`px-2 py-1 text-xs rounded transition-colors ${zoom === z
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                            >
                                {z * 100}%
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 transition-colors"
                >
                    <span className="text-sm">Close</span>
                    <span className="text-xs text-gray-500">ESC</span>
                </button>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-auto flex justify-center p-8 bg-gray-800">
                <div className="shadow-2xl">
                    <ResumePreview data={data} scale={zoom} />
                </div>
            </div>
        </div>
    );
}
