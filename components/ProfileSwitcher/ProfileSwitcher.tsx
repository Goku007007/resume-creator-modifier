'use client';

import React from 'react';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';

interface ProfileSwitcherProps {
    profiles: { id: string; name: string }[];
    currentProfileId: string;
    onSwitch: (id: string) => void;
    onCreate: () => void;
    onDuplicate: () => void;
    onRename: (name: string) => void;
    onDelete: () => void;
}

export default function ProfileSwitcher({
    profiles,
    currentProfileId,
    onSwitch,
    onCreate,
    onDuplicate,
    onRename,
    onDelete,
}: ProfileSwitcherProps) {
    const [showMenu, setShowMenu] = React.useState(false);
    const [isRenaming, setIsRenaming] = React.useState(false);
    const [newName, setNewName] = React.useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    const currentProfile = profiles.find((p) => p.id === currentProfileId);

    const handleRename = () => {
        if (newName.trim()) {
            onRename(newName.trim());
            setIsRenaming(false);
            setNewName('');
        }
    };

    const handleDeleteConfirm = () => {
        onDelete();
        setShowDeleteConfirm(false);
        setShowMenu(false);
    };

    // Close menu on outside click
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (showMenu && !target.closest('.profile-switcher-container')) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    return (
        <>
            <div className="relative profile-switcher-container">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                    aria-haspopup="true"
                    aria-expanded={showMenu}
                >
                    <span className="text-gray-400">Profile:</span>
                    <span className="text-white">{currentProfile?.name || 'Select'}</span>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${showMenu ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {showMenu && (
                    <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 min-w-[220px] overflow-hidden">
                        {/* Profile list */}
                        <div className="py-2 border-b border-gray-700">
                            <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Switch Profile
                            </div>
                            {profiles.map((profile) => (
                                <button
                                    key={profile.id}
                                    onClick={() => {
                                        onSwitch(profile.id);
                                        setShowMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700 flex items-center justify-between transition-colors ${profile.id === currentProfileId ? 'bg-gray-700/50 text-blue-400' : 'text-gray-300'
                                        }`}
                                >
                                    <span>{profile.name}</span>
                                    {profile.id === currentProfileId && (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Management Actions */}
                        <div className="py-2 border-b border-gray-700">
                            <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Manage
                            </div>
                            <button
                                onClick={() => {
                                    onCreate();
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 transition-colors"
                            >
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Profile
                            </button>
                            <button
                                onClick={() => {
                                    onDuplicate();
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 transition-colors"
                            >
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Duplicate
                            </button>
                            <button
                                onClick={() => {
                                    setIsRenaming(true);
                                    setNewName(currentProfile?.name || '');
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 transition-colors"
                            >
                                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Rename
                            </button>
                        </div>

                        {/* Danger Zone */}
                        {profiles.length > 1 && (
                            <div className="py-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Profile
                                </button>
                            </div>
                        )}

                        {/* Rename input */}
                        {isRenaming && (
                            <div className="p-3 border-t border-gray-700">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRename();
                                        if (e.key === 'Escape') setIsRenaming(false);
                                    }}
                                    placeholder="New name..."
                                    autoFocus
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={handleRename}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded-lg font-medium transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsRenaming(false)}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-1.5 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Delete Profile"
                message={`Are you sure you want to delete "${currentProfile?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
