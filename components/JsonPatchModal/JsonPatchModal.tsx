'use client';

import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';

interface JsonPatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (json: object, mode: 'merge' | 'patch') => void;
    currentData: object;
    error?: string | null;
}

export default function JsonPatchModal({
    isOpen,
    onClose,
    onApply,
    currentData,
    error,
}: JsonPatchModalProps) {
    const [jsonInput, setJsonInput] = useState('');
    const [mode, setMode] = useState<'merge' | 'patch'>('merge');
    const [localError, setLocalError] = useState<string | null>(null);

    const handleApply = useCallback(() => {
        try {
            const parsed = JSON.parse(jsonInput);
            setLocalError(null);
            onApply(parsed, mode);
        } catch (e) {
            setLocalError(`Invalid JSON: ${(e as Error).message}`);
        }
    }, [jsonInput, mode, onApply]);

    const loadCurrentData = () => {
        setJsonInput(JSON.stringify(currentData, null, 2));
    };

    const loadExamplePatch = () => {
        const example = [
            {
                op: 'replace',
                path: '/sections/skills/groups/0/items',
                value: ['Python', 'TypeScript', 'SQL', 'Go'],
            },
            {
                op: 'add',
                path: '/sections/experience/0/bullets/-',
                value: 'New bullet point added via JSON Patch',
            },
        ];
        setJsonInput(JSON.stringify(example, null, 2));
        setMode('patch');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Apply JSON Patch</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
                        ×
                    </button>
                </div>

                {/* Mode selector */}
                <div className="flex gap-4 px-6 py-3 border-b border-gray-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="mode"
                            value="merge"
                            checked={mode === 'merge'}
                            onChange={() => setMode('merge')}
                            className="accent-blue-500"
                        />
                        <span className="text-sm text-gray-300">Merge Patch (simple object merge)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="mode"
                            value="patch"
                            checked={mode === 'patch'}
                            onChange={() => setMode('patch')}
                            className="accent-blue-500"
                        />
                        <span className="text-sm text-gray-300">JSON Patch (RFC 6902)</span>
                    </label>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 px-6 py-2 border-b border-gray-800">
                    <button
                        onClick={loadCurrentData}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded"
                    >
                        Load Current Data
                    </button>
                    <button
                        onClick={loadExamplePatch}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded"
                    >
                        Load Example Patch
                    </button>
                </div>

                {/* Editor with Skeleton Loading (P1-4) */}
                <div className="flex-1 min-h-0">
                    <Editor
                        height="400px"
                        defaultLanguage="json"
                        value={jsonInput}
                        onChange={(value) => setJsonInput(value || '')}
                        theme="vs-dark"
                        loading={
                            <div className="h-[400px] bg-gray-800 animate-pulse flex flex-col p-4 gap-2">
                                {/* Skeleton lines to simulate code */}
                                {[...Array(15)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-3 items-center"
                                        style={{ opacity: 1 - (i * 0.04) }}
                                    >
                                        <div className="w-8 h-4 bg-gray-700 rounded" />
                                        <div
                                            className="h-4 bg-gray-700 rounded"
                                            style={{ width: `${Math.random() * 40 + 30}%` }}
                                        />
                                    </div>
                                ))}
                                <div className="flex-1 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">Loading editor...</span>
                                </div>
                            </div>
                        }
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                        }}
                    />
                </div>

                {/* Error display */}
                {(error || localError) && (
                    <div className="px-6 py-2 bg-red-900/50 border-t border-red-700">
                        <p className="text-sm text-red-300">{error || localError}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
                    <div className="text-xs text-gray-500">
                        {mode === 'merge' ? (
                            <span>Paste a partial JSON object to merge with current data</span>
                        ) : (
                            <span>Paste an array of RFC 6902 operations (add, remove, replace, move, copy)</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                            Apply Patch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
