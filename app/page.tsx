'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ResumePreview from '@/components/ResumePreview/ResumePreview';
import EditorPanel from '@/components/EditorPanel/EditorPanel';
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher';
import JsonPatchModal from '@/components/JsonPatchModal/JsonPatchModal';
import PreviewToolbar from '@/components/PreviewToolbar/PreviewToolbar';
import FullscreenPreviewModal from '@/components/FullscreenPreviewModal/FullscreenPreviewModal';
import { ResumeJSON, DEFAULT_RESUME } from '@/types/resume';
import { applyResumePatch } from '@/lib/patch';

import { lintResume, LintResult } from '@/lib/linter';

interface Profile {
  id: string;
  name: string;
}

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeJSON>(DEFAULT_RESUME);
  const [resumeName, setResumeName] = useState('');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [patchError, setPatchError] = useState<string | null>(null);
  const [lintResults, setLintResults] = useState<LintResult[]>([]);
  // Score removed per user request
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [isExporting, setIsExporting] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(0.85);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [scrollTarget, setScrollTarget] = useState<{ section: string; field?: string; index?: number; subIndex?: number; ts: number } | null>(null);

  const handlePreviewSectionClick = (section: string, field?: string, index?: number, subIndex?: number) => {
    setScrollTarget({ section, field, index, subIndex, ts: Date.now() });
  };
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle section focus - highlight corresponding preview section
  const handleSectionFocus = useCallback((section: string) => {
    // Clear any existing timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    setHighlightedSection(section);
    // Auto-clear after 2 seconds
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedSection(null);
    }, 2000);
  }, []);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Run linter when resume data changes
  useEffect(() => {
    const results = lintResume(resumeData);
    setLintResults(results);
  }, [resumeData]);

  // Auto-save REMOVED. Only set unsaved status.
  useEffect(() => {
    if (!currentProfileId || isLoading) return;
    setSaveStatus('unsaved');
  }, [resumeData, currentProfileId, isLoading]);

  const loadProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      const data = await response.json();
      setProfiles(data);

      if (data.length > 0) {
        await loadProfile(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfile = async (id: string) => {
    try {
      const response = await fetch(`/api/profiles?id=${id}`);
      const data = await response.json();
      setCurrentProfileId(id);
      setResumeData(data.content);
      setResumeName(data.content.profileMeta.resumeName);
      setSaveStatus('saved');
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const saveProfile = async (id: string, data: ResumeJSON) => {
    setSaveStatus('saving');
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id, data }),
      });
      setSaveStatus('saved');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveStatus('error');
    }
  };

  const handleProfileSwitch = (id: string) => {
    loadProfile(id);
  };

  const handleProfileCreate = async () => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', name: 'New Profile' }),
      });
      const data = await response.json();
      await loadProfiles();
      await loadProfile(data.id);
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  };

  const handleProfileSaveAs = async (name: string) => {
    try {
      // Create new profile
      const createRes = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', name }),
      });
      const newData = await createRes.json();

      // Save current content to the new profile
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id: newData.id, data: resumeData }),
      });

      await loadProfiles();
      await loadProfile(newData.id);
    } catch (error) {
      console.error('Failed to save as profile:', error);
    }
  };

  const handleReset = () => {
    if (currentProfileId) {
      loadProfile(currentProfileId);
    }
  };

  const handleProfileDuplicate = async () => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate', id: currentProfileId }),
      });
      const data = await response.json();
      await loadProfiles();
      await loadProfile(data.id);
    } catch (error) {
      console.error('Failed to duplicate profile:', error);
    }
  };

  const handleProfileRename = async (name: string) => {
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rename', id: currentProfileId, name }),
      });
      await loadProfiles();
    } catch (error) {
      console.error('Failed to rename profile:', error);
    }
  };

  const handleProfileDelete = async () => {
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: currentProfileId }),
      });
      await loadProfiles();
    } catch (error) {
      console.error('Failed to delete profile:', error);
    }
  };

  const handleResumeChange = useCallback((newData: ResumeJSON) => {
    setResumeData(newData);
  }, []);

  const handleResumeNameChange = (name: string) => {
    setResumeName(name);
    setResumeData((prev) => ({
      ...prev,
      profileMeta: { ...prev.profileMeta, resumeName: name },
    }));
  };

  const handleApplyPatch = (patch: object, mode: 'merge' | 'patch') => {
    const result = applyResumePatch(resumeData, patch, mode);
    if (result.success && result.result) {
      setResumeData(result.result);
      // Sync resumeName state if the patch updated it
      if (result.result.profileMeta?.resumeName) {
        setResumeName(result.result.profileMeta.resumeName);
      }
      setPatchError(null);
      setIsJsonModalOpen(false);
    } else {
      setPatchError(result.error || 'Failed to apply patch');
    }
  };


  const handleDownload = async () => {
    if (isExporting) return; // Prevent double-clicks

    setIsExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: resumeData, format: 'pdf' }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeName || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Resume Modifier</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={resumeName}
              onChange={(e) => handleResumeNameChange(e.target.value)}
              placeholder="Resume Name"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white w-64 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${saveStatus === 'saved' ? 'bg-green-500/10 text-green-400' :
              saveStatus === 'saving' ? 'bg-yellow-500/10 text-yellow-400' :
                saveStatus === 'error' ? 'bg-red-500/10 text-red-400' :
                  'bg-orange-500/10 text-orange-400'
              }`}>
              {saveStatus === 'saved' && (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>All changes saved</span>
                </>
              )}
              {saveStatus === 'saving' && (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Save failed</span>
                </>
              )}
              {saveStatus === 'unsaved' && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                  <span>Unsaved changes</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Button */}
          <button
            onClick={() => setShowSaveConfirm(true)}
            disabled={saveStatus === 'saved' || saveStatus === 'saving'}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${saveStatus === 'unsaved'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            title="Save changes to current profile"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-800 hover:bg-red-900/30 border border-gray-600 hover:border-red-500/50 rounded-lg px-3 py-1.5 text-sm text-gray-300 hover:text-red-400 transition-all font-medium"
            title="Reset to original saved state"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>

          {/* Format selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Format:</span>
            <select
              value={resumeData.rendering.format || 'classic'}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                rendering: { ...prev.rendering, format: e.target.value as 'classic' | 'russell' }
              }))}
              className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="classic">Classic</option>
              <option value="russell">Russell</option>
            </select>
          </div>

          {/* Font selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Font:</span>
            <select
              value={resumeData.rendering.fontFamily}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                rendering: { ...prev.rendering, fontFamily: e.target.value }
              }))}
              className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Garamond">EB Garamond</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Calibri">Calibri</option>
              <option value="Geist Mono">Geist Mono</option>
              <option value="Andale Mono">Andale Mono</option>
            </select>
          </div>

          {/* Font size selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Size:</span>
            <select
              value={resumeData.rendering.fontSize || 10.5}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                rendering: { ...prev.rendering, fontSize: parseFloat(e.target.value) }
              }))}
              className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="9">9pt</option>
              <option value="9.5">9.5pt</option>
              <option value="10">10pt</option>
              <option value="10.5">10.5pt</option>
              <option value="11">11pt</option>
              <option value="11.5">11.5pt</option>
              <option value="12">12pt</option>
            </select>
          </div>

          {/* Line spacing selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Spacing:</span>
            <input
              type="number"
              min="0.8"
              max="2.0"
              step="0.05"
              value={resumeData.rendering.lineHeight || 1.35}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                rendering: { ...prev.rendering, lineHeight: parseFloat(e.target.value) }
              }))}
              className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white w-16 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* JSON Patch button */}
          <button
            onClick={() => setIsJsonModalOpen(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors"
          >
            <span>{ }</span>
            <span>JSON</span>
          </button>

          {/* Profile Switcher */}
          <ProfileSwitcher
            profiles={profiles}
            currentProfileId={currentProfileId}
            onSwitch={handleProfileSwitch}
            onCreate={handleProfileCreate}
            onSaveAs={handleProfileSaveAs}
            onDuplicate={handleProfileDuplicate}
            onRename={handleProfileRename}
            onDelete={handleProfileDelete}
          />

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 ${isExporting
              ? 'bg-blue-600/50 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isExporting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Lint warnings bar */}
      {lintResults.length > 0 && (
        <div className="bg-yellow-900/50 border-b border-yellow-700 px-4 py-2">
          <div className="flex items-center gap-4 overflow-x-auto">
            {lintResults.slice(0, 3).map((result, idx) => (
              <div key={idx} className={`flex items-center gap-2 text-sm whitespace-nowrap ${result.severity === 'error' ? 'text-red-400' :
                result.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                <span>{result.severity === 'error' ? '⚠' : result.severity === 'warning' ? '!' : 'ℹ'}</span>
                <span>{result.message}</span>
              </div>
            ))}
            {lintResults.length > 3 && (
              <span className="text-sm text-gray-400">+{lintResults.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane - Resume Preview with Toolbar */}
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          <PreviewToolbar
            zoom={previewZoom}
            onZoomChange={setPreviewZoom}
            onFitWidth={() => {
              // Calculate fit width based on container width
              if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.clientWidth - 48; // 24px padding each side
                const pageWidth = 612; // 8.5" * 72 dpi
                const fitZoom = containerWidth / pageWidth;
                setPreviewZoom(Math.min(fitZoom, 1)); // Cap at 100%
              }
            }}
            onFullscreen={() => setIsFullscreenOpen(true)}
          />
          <div ref={previewContainerRef} className="flex-1 overflow-auto bg-gray-800">
            <ResumePreview
              data={resumeData}
              scale={previewZoom}
              highlightedSection={highlightedSection}
              onSectionClick={handlePreviewSectionClick}
            />
          </div>
        </div>

        {/* Right Pane - Editor */}
        <div className="w-1/2 overflow-hidden">
          <EditorPanel
            data={resumeData}
            onChange={handleResumeChange}
            onSectionFocus={handleSectionFocus}
            scrollTarget={scrollTarget}
          />
        </div>
      </main>

      {/* JSON Patch Modal */}
      <JsonPatchModal
        isOpen={isJsonModalOpen}
        onClose={() => {
          setIsJsonModalOpen(false);
          setPatchError(null);
        }}
        onApply={handleApplyPatch}
        currentData={resumeData}
        error={patchError}
      />

      {/* Fullscreen Preview Modal */}
      <FullscreenPreviewModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        data={resumeData}
      />

      {/* Save Confirmation Dialog */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-4 shadow-2xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Save Changes?</h3>
            <p className="text-gray-300 mb-4">
              This will <span className="text-orange-400 font-medium">overwrite</span> the current profile
              "<span className="text-white font-medium">{profiles.find(p => p.id === currentProfileId)?.name}</span>".
            </p>
            <p className="text-gray-400 text-sm mb-6">
              💡 Use <strong>"Save As"</strong> in the profile menu to keep the original and create a new profile instead.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSaveConfirm(false)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSaveConfirm(false);
                  if (currentProfileId) saveProfile(currentProfileId, resumeData);
                }}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Yes, Overwrite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
