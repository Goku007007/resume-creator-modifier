// Russell Format CSS Generator
// Exact match to the LaTeX Russell CV class template
// Margins: 0.8cm left/right, 0.7cm top/bottom

import { RenderingConfig } from '@/types/resume';

export function getFontFamilyCSS(fontFamily: string): string {
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

export function generateResumeCSSRussell(rendering: RenderingConfig): string {
  // Use user's font size settings
  const fontFamily = getFontFamilyCSS(rendering.fontFamily || 'Source Sans Pro');
  const fontSize = rendering.fontSize || 10;
  const lineHeight = rendering.lineHeight || 1.15;
  const bulletMargin = '0'; // Match preview behavior

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

  // Only import Computer Modern fonts if they're being used (saves ~500KB in PDF size)
  const isComputerModern = rendering.fontFamily.startsWith('Computer Modern');
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
    
    @page {
      size: letter;
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
    
    /* Russell page margins: 0.4in left/right, 0.35in top/bottom */
    .resume-page.format-russell {
      width: 8.5in;
      min-height: 11in;
      max-height: 11in;
      padding: 0.35in 0.4in;
      background: white;
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
    }
    
    /* Header - Centered, Bold Name */
    .format-russell .resume-header {
      text-align: center;
      margin-bottom: 1mm;
    }
    
    .format-russell .resume-name {
      font-size: ${nameSize}pt;
      font-weight: bold;
      margin: 0;
      letter-spacing: 0.3px;
    }
    
    /* Location line - italic, gray */
    .format-russell .resume-location {
      text-align: center;
      font-size: ${dateSize}pt;
      font-style: italic;
      color: #999;
      margin: 1mm 0;
      display: block;
      width: 100%;
    }
    
    /* Contact - single line with pipe separators */
    .format-russell .resume-contact {
      text-align: center;
      font-size: ${dateSize}pt;
      margin-bottom: 2mm;
    }
    
    .format-russell .resume-contact a {
      color: #0066cc !important;
      text-decoration: none;
    }
    
    .format-russell .resume-contact a:hover {
      text-decoration: underline;
    }
    
    .format-russell .separator {
      margin: 0 8px;
      color: #414141;
    }
    
    /* Section styling */
    .format-russell .resume-section {
      margin-bottom: 1.4mm;
    }

    /* Summary - Left aligned, bold title, normal text */
    .format-russell .summary-section {
      text-align: left;
      margin-bottom: 2mm;
      margin-top: 0mm;
    }

    .format-russell .summary-title {
      font-weight: bold;
      font-size: 1.2em;
      margin-bottom: 1mm;
    }

    .format-russell .summary-content {
      font-size: ${fontSize}pt;
    }
    
    /* Section header - uppercase, gray line */
    .format-russell .section-header {
      font-size: ${titleSize}pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 1.5mm 0;
      padding-bottom: 1px;
      border-bottom: 0.5pt solid #414141;
      color: #000;
    }
    
    /* Skills - Two column table */
    .format-russell .skills-table {
      margin-top: 1.5mm;
      width: 100%;
    }
    
    .format-russell .skills-row {
      display: flex;
      margin-bottom: 0.5mm;
      font-size: ${fontSize}pt;
    }
    
    .format-russell .skill-label {
      font-weight: 600;
      min-width: 180px;
      flex-shrink: 0;
    }
    
    .format-russell .skill-items {
      font-weight: 400;
      flex: 1;
    }
    
    /* Experience */
    .format-russell .experience-item {
      margin-bottom: 2mm;
    }
    
    .format-russell .experience-item:last-child {
      margin-bottom: 1mm;
    }
    
    .format-russell .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.5mm;
    }
    
    .format-russell .experience-title-line {
      font-size: ${titleSize}pt;
    }
    
    .format-russell .experience-company {
      font-weight: bold;
    }
    
    .format-russell .comma {
      font-weight: normal;
    }
    
    .format-russell .experience-position {
      font-style: italic;
      font-weight: normal;
    }
    
    .format-russell .location-separator {
      margin: 0 4px;
      color: #414141;
    }
    
    .format-russell .experience-location {
      font-style: italic;
      font-weight: normal;
    }
    
    .format-russell .experience-date {
      font-size: ${dateSize}pt;
      font-style: italic;
      font-weight: normal;
      text-align: right;
      flex-shrink: 0;
    }

    .format-russell .experience-description {
      font-style: normal;
      margin-bottom: 0.5mm;
    }
    
    /* Bullets - matching LaTeX cvitems */
    .format-russell .bullet-list {
      margin: 0;
      padding-left: 16px;
      list-style-type: disc;
    }
    
    .format-russell .bullet-list li {
      margin-bottom: ${bulletMargin};
      padding-left: 2px;
      text-align: left;
      font-size: ${fontSize}pt;
      line-height: 1.3;
      hyphens: none;
      word-break: normal;
      text-wrap: pretty;
    }
    
    /* Education - table row format */
    .format-russell .education-table {
      margin-top: 1.5mm;
    }
    
    .format-russell .education-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1mm;
      font-size: ${titleSize}pt;
    }
    
    .format-russell .education-content {
      flex: 1;
    }
    
    .format-russell .education-school {
      font-weight: bold;
    }
    
    .format-russell .education-degree {
      font-style: italic;
      font-weight: normal;
    }
    
    .format-russell .education-date {
      font-size: ${dateSize}pt;
      color: #666;
      flex-shrink: 0;
    }
    
    /* Projects */
    .format-russell .project-item {
      margin-bottom: 2mm;
    }
    
    .format-russell .project-item:last-child {
      margin-bottom: 1mm;
    }
    
    .format-russell .project-header {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 0.5mm;
    }
    
    .format-russell .project-name {
      font-weight: bold;
      font-size: ${titleSize}pt;
    }
    
    .format-russell .project-link {
      font-size: ${fontSize}pt;
      color: #0066cc !important;
      text-decoration: none;
      margin-left: 4px;
    }
    
    .format-russell .project-link:hover {
      text-decoration: underline;
    }
    
    /* Links in general */
    .format-russell a {
      color: #0066cc;
    }
  `;
}

export const GOOGLE_FONTS_LINK_RUSSELL = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap';
