
/**
 * Replaces the last n spaces in a string with non-breaking spaces (&nbsp;)
 * to prevent "widows" or "orphans" (short single lines at the end of a block).
 * 
 * @param text The input text
 * @param minWords The number of words to keep together at the end (default: 3)
 * @returns The text with non-breaking spaces
 */
export function preventWidows(text: string, minWords: number = 2): string {
    if (!text) return text;

    // Split text into words, preserving spaces is tricky with simple split.
    // Better to find the last N occurrences of spaces.

    const words = text.split(' ');

    if (words.length <= minWords) {
        return text; // Text is too short, just return it
    }

    // Take the main part of the sentence
    const mainPart = words.slice(0, -minWords).join(' ');

    // Take the last part (widow prevention part) and join with non-breaking spaces
    // We use \u00A0 for non-breaking space character (invisible in JS strings but works in HTML/React)
    const widowPart = words.slice(-minWords).join('\u00A0');

    return `${mainPart} ${widowPart}`;
}
