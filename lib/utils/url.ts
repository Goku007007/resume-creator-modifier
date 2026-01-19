export function formatUrlForDisplay(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}
