// Bold Text Formatting Utility
// Converts markdown-style **text** to bold formatting

import React from 'react';

/**
 * Converts **text** markdown syntax to <strong>text</strong> HTML tags.
 * Also escapes HTML to prevent XSS attacks.
 */
export function parseBoldMarkdown(text: string): string {
    // First escape HTML special characters (except for our bold markers)
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    // Then convert **text** to <strong>text</strong>
    return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/**
 * Renders text with **bold** markdown as React elements.
 * Returns an array of React nodes with <strong> elements for bold text.
 */
export function renderBoldText(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        // Add the bold text
        parts.push(
            React.createElement('strong', { key: key++ }, match[1])
        );
        lastIndex = regex.lastIndex;
    }

    // Add remaining text after last match
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    // If no matches found, return original text as single element
    if (parts.length === 0) {
        return [text];
    }

    return parts;
}
