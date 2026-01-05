'use client';

import React from 'react';

interface PreviewToolbarProps {
    zoom: number;
    onZoomChange: (zoom: number) => void;
    onFitWidth: () => void;
    onFullscreen: () => void;
}

const ZOOM_PRESETS = [50, 75, 85, 100, 125, 150];
const MIN_ZOOM = 25;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;

export default function PreviewToolbar({
    zoom,
    onZoomChange,
    onFitWidth,
    onFullscreen,
}: PreviewToolbarProps) {
    const zoomPercent = Math.round(zoom * 100);

    const handleZoomIn = () => {
        const newZoom = Math.min(MAX_ZOOM, zoomPercent + ZOOM_STEP);
        onZoomChange(newZoom / 100);
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(MIN_ZOOM, zoomPercent - ZOOM_STEP);
        onZoomChange(newZoom / 100);
    };

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'fit') {
            onFitWidth();
        } else {
            onZoomChange(parseInt(value) / 100);
        }
    };

    return (
        <div className="flex items-center justify-between bg-gray-900 border-b border-gray-700 px-3 py-2">
            {/* Left side - Zoom controls */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Preview</span>

                <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600">
                    {/* Zoom out button */}
                    <button
                        onClick={handleZoomOut}
                        disabled={zoomPercent <= MIN_ZOOM}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-l-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Zoom out"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>

                    {/* Zoom percentage dropdown */}
                    <select
                        value={zoomPercent}
                        onChange={handlePresetChange}
                        className="bg-transparent text-gray-300 text-xs font-medium px-2 py-1 border-x border-gray-600 focus:outline-none cursor-pointer min-w-[70px] text-center appearance-none"
                    >
                        {ZOOM_PRESETS.map((preset) => (
                            <option key={preset} value={preset} className="bg-gray-800">
                                {preset}%
                            </option>
                        ))}
                        {!ZOOM_PRESETS.includes(zoomPercent) && (
                            <option value={zoomPercent} className="bg-gray-800">
                                {zoomPercent}%
                            </option>
                        )}
                        <option value="fit" className="bg-gray-800">Fit width</option>
                    </select>

                    {/* Zoom in button */}
                    <button
                        onClick={handleZoomIn}
                        disabled={zoomPercent >= MAX_ZOOM}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-r-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Zoom in"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Quick preset buttons */}
                <button
                    onClick={onFitWidth}
                    className="text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-2.5 py-1.5 transition-colors"
                    title="Fit to width"
                >
                    Fit
                </button>
            </div>

            {/* Right side - Fullscreen button */}
            <button
                onClick={onFullscreen}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-2.5 py-1.5 transition-colors"
                title="Open fullscreen preview"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Fullscreen</span>
            </button>
        </div>
    );
}
