// German Format CSS Generator
// Optimized for German HR conventions and A4 page size
// Margins: 0.8cm left/right, 0.7cm top/bottom

import { RenderingConfig } from '@/types/resume';

export function getFontFamilyCSSGerman(fontFamily: string): string {
  const fontMap: Record<string, string> = {
    'Times New Roman': "'Times New Roman', Times, serif",
    'Georgia': "Georgia, 'Times New Roman', serif",
    'Garamond': "'EB Garamond', Garamond, serif",
    'Arial': "Arial, Helvetica, sans-serif",
    'Helvetica': "Helvetica, Arial, sans-serif",
    'Calibri': "Carlito, Calibri, sans-serif",
    'Geist Mono': "'Geist Mono', 'Andale Mono', 'Courier New', monospace",
    'Andale Mono': "'Andale Mono', 'Courier New', monospace",
    'Computer Modern': "'Computer Modern Serif', serif",
    'Computer Modern Thick1': "'Computer Modern Serif', serif",
    'Computer Modern Thick2': "'Computer Modern Serif', serif",
    'Computer Modern Thick3': "'Computer Modern Serif', serif",
    'Computer Modern Concrete': "'Computer Modern Concrete', serif",
    'Source Sans Pro': "'Source Sans 3', 'Source Sans Pro', Arial, sans-serif",
  };
  return fontMap[fontFamily] || "'Source Sans 3', 'Source Sans Pro', Arial, sans-serif";
}

export function generateResumeCSSGerman(rendering: RenderingConfig): string {
  // Use user's font size settings
  const fontFamily = getFontFamilyCSSGerman(rendering.fontFamily || 'Source Sans Pro');
  const fontSize = rendering.fontSize || 10;
  const lineHeight = rendering.lineHeight || 1.15;
  const bulletMargin = '0';

  // Get text stroke for thick variants (simulates thicker text since CM font doesn't have intermediate weights)
  const textStrokeMap: Record<string, string> = {
    'Computer Modern Thick1': '0.05px currentColor',
    'Computer Modern Thick2': '0.1px currentColor',
    'Computer Modern Thick3': '0.15px currentColor',
  };
  const textStroke = textStrokeMap[rendering.fontFamily] || 'none';

  // Scale other sizes relative to base font
  const titleSize = Math.round(fontSize * 1.05 * 10) / 10;
  const dateSize = Math.round(fontSize * 0.9 * 10) / 10;
  const nameSize = Math.round(fontSize * 2 * 10) / 10;
  const authSize = Math.round(fontSize * 0.95 * 10) / 10;

  // Only import Computer Modern fonts if they're being used (saves ~500KB in PDF size)
  const isComputerModern = rendering.fontFamily?.startsWith('Computer Modern') ?? false;
  const fontImport = isComputerModern
    ? "@import url('https://cdn.jsdelivr.net/gh/bitmaks/cm-web-fonts@latest/fonts.css');"
    : '';

  return `

    ${fontImport}
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* A4 page size for German applications */
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      font-family: ${fontFamily};
      font-size: ${fontSize}pt;
      line-height: ${lineHeight};
      -webkit-text-stroke: ${textStroke};
      color: #000;
      background: white;
    }
    
    /* German page: A4 size (210mm × 297mm) */
    .resume-page.format-german {
      width: 210mm;
      min-height: 297mm;
      max-height: 297mm;
      padding: 7mm 8mm;
      background: white;
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
    }
    
    /* Header - Centered, Bold Name */
    .format-german .resume-header {
      text-align: center;
      margin-bottom: 1mm;
    }
    
    .format-german .resume-name {
      font-size: ${nameSize}pt;
      font-weight: bold;
      margin: 0;
      letter-spacing: 0.3px;
    }
    
    /* Work Authorization Line - German recruiters screen for this first */
    .format-german .work-authorization {
      text-align: center;
      font-size: ${authSize}pt;
      color: #444;
      margin: 1mm 0;
      font-style: italic;
    }
    
    /* Location line - italic, gray */
    .format-german .resume-location {
      text-align: center;
      font-size: ${dateSize}pt;
      font-style: italic;
      color: #999;
      margin: 1mm 0;
      display: block;
      width: 100%;
    }
    
    /* Contact - single line with pipe separators */
    .format-german .resume-contact {
      text-align: center;
      font-size: ${dateSize}pt;
      margin-bottom: 2mm;
    }
    
    .format-german .resume-contact a {
      color: #0066cc !important;
      text-decoration: none;
    }
    
    .format-german .resume-contact a:hover {
      text-decoration: underline;
    }
    
    .format-german .separator {
      margin: 0 8px;
      color: #414141;
    }
    
    /* Section styling */
    .format-german .resume-section {
      margin-bottom: 1.4mm;
    }

    /* Summary - Left aligned, bold title, normal text */
    .format-german .summary-section {
      text-align: left;
      margin-bottom: 2mm;
      margin-top: 0mm;
    }

    .format-german .summary-title {
      font-weight: bold;
      font-size: 1.2em;
      margin-bottom: 1mm;
    }

    .format-german .summary-content {
      font-size: ${fontSize}pt;
    }
    
    /* Section header - uppercase, gray line */
    .format-german .section-header {
      font-size: ${titleSize}pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 1.5mm 0;
      padding-bottom: 1px;
      border-bottom: 0.5pt solid #414141;
      color: #000;
    }
    
    /* Skills - Two column table */
    .format-german .skills-table {
      margin-top: 1.5mm;
      width: 100%;
    }
    
    .format-german .skills-row {
      display: flex;
      margin-bottom: 0.5mm;
      font-size: ${fontSize}pt;
    }
    
    .format-german .skill-label {
      font-weight: 600;
      min-width: 180px;
      flex-shrink: 0;
    }
    
    .format-german .skill-items {
      font-weight: 400;
      flex: 1;
    }
    
    /* Experience */
    .format-german .experience-item {
      margin-bottom: 2mm;
    }
    
    .format-german .experience-item:last-child {
      margin-bottom: 1mm;
    }
    
    .format-german .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.5mm;
    }
    
    .format-german .experience-title-line {
      font-size: ${titleSize}pt;
    }
    
    .format-german .experience-company {
      font-weight: bold;
    }
    
    .format-german .comma {
      font-weight: normal;
    }
    
    .format-german .experience-position {
      font-style: italic;
      font-weight: normal;
    }
    
    .format-german .location-separator {
      margin: 0 4px;
      color: #414141;
    }
    
    .format-german .experience-location {
      font-style: italic;
      font-weight: normal;
    }
    
    .format-german .experience-date {
      font-size: ${dateSize}pt;
      font-style: italic;
      font-weight: normal;
      text-align: right;
      flex-shrink: 0;
    }

    .format-german .experience-description {
      font-style: normal;
      margin-bottom: 0.5mm;
    }
    
    /* Bullets - consistent punctuation */
    .format-german .bullet-list {
      margin: 0;
      padding-left: 16px;
      list-style-type: disc;
    }
    
    .format-german .bullet-list li {
      margin-bottom: ${bulletMargin};
      padding-left: 2px;
      text-align: left;
      font-size: ${fontSize}pt;
      line-height: 1.3;
      hyphens: none;
      word-break: normal;
      text-wrap: pretty;
    }
    
    /* Education - German format with dates and location */
    .format-german .education-table {
      margin-top: 1.5mm;
    }
    
    .format-german .education-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1mm;
      font-size: ${titleSize}pt;
    }
    
    .format-german .education-content {
      flex: 1;
    }
    
    .format-german .education-school {
      font-weight: bold;
    }
    
    .format-german .education-degree {
      font-style: italic;
      font-weight: normal;
    }
    
    .format-german .education-location {
      font-style: italic;
      color: #666;
      margin-left: 4px;
    }
    
    .format-german .education-date {
      font-size: ${dateSize}pt;
      color: #666;
      flex-shrink: 0;
    }
    
    /* Projects - Explicit clickable links */
    .format-german .project-item {
      margin-bottom: 2mm;
    }
    
    .format-german .project-item:last-child {
      margin-bottom: 1mm;
    }
    
    .format-german .project-header {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 0.5mm;
    }
    
    .format-german .project-name {
      font-weight: bold;
      font-size: ${titleSize}pt;
    }
    
    /* German: Show full URL instead of just "GitHub" */
    .format-german .project-link {
      font-size: ${fontSize}pt;
      color: #0066cc !important;
      text-decoration: none;
      margin-left: 4px;
    }
    
    .format-german .project-link:hover {
      text-decoration: underline;
    }
    
    /* Languages Section - German format with CEFR levels */
    .format-german .languages-section {
      margin-top: 1.5mm;
    }
    
    .format-german .languages-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: ${fontSize}pt;
    }
    
    .format-german .language-item {
      display: inline-flex;
      gap: 4px;
    }
    
    .format-german .language-name {
      font-weight: 600;
    }
    
    .format-german .language-level {
      color: #666;
    }
    
    /* Links in general */
    .format-german a {
      color: #0066cc;
    }
  `;
}

export const GOOGLE_FONTS_LINK_GERMAN = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap';
