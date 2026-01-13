// Shared Resume CSS Generator
// Single source of truth for all resume styling

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
  };
  return fontMap[fontFamily] || "'Times New Roman', Times, serif";
}

export function generateResumeCSS(rendering: RenderingConfig): string {
  const fontFamily = getFontFamilyCSS(rendering.fontFamily);
  const fontSize = rendering.fontSize || 11;
  const lineHeight = rendering.lineHeight || 1.15;
  const bulletMargin = rendering.density === 'COMPACT' ? '0' : '1px';

  return `
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
      color: #000;
      background: white;
    }
    
    .resume-page {
      width: 8.5in;
      min-height: 11in;
      max-height: 11in;
      padding: 0.5in 0.6in;
      background: white;
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
    }
    
    /* Header */
    .resume-header,
    .header {
      text-align: center;
      margin-bottom: 4px;
    }
    
    .resume-name,
    .name {
      font-size: 24pt;
      font-weight: bold;
      margin: 0;
      letter-spacing: 0.5px;
    }
    
    /* Contact */
    .resume-contact,
    .contact {
      text-align: center;
      font-size: 9.5pt;
      margin-bottom: 8px;
    }
    
    .resume-contact a,
    .contact a {
      color: #0066cc;
      text-decoration: none;
    }
    
    a {
      color: #0066cc;
    }
    
    .separator {
      margin: 0 6px;
      color: #666;
    }
    
    /* Sections */
    .resume-section,
    .section {
      margin-bottom: 6px;
    }
    
    .section-header {
      font-size: 11pt;
      font-weight: bold;
      margin: 0 0 2px 0;
      padding-bottom: 1px;
      border-bottom: 1px solid #000;
      text-transform: none;
    }
    
    /* Skills */
    .skills-content,
    .skills-content-inline {
      margin-top: 3px;
      text-align: left;
    }
    
    .skill-label {
      font-weight: bold;
    }
    
    .skill-items {
      font-weight: normal;
    }
    
    /* Experience */
    .experience-item {
      margin-bottom: 8px;
    }
    
    .experience-item:last-child {
      margin-bottom: 4px;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }
    
    .experience-title {
      font-weight: bold;
    }
    
    .experience-company {
      font-weight: normal;
    }
    
    .experience-date {
      font-weight: normal;
      text-align: right;
      font-size: 10pt;
    }
    
    /* Bullets */
    .bullet-list {
      margin: 0;
      padding-left: 18px;
      list-style-type: disc;
    }
    
    .bullet-list li {
      margin-bottom: ${bulletMargin};
      padding-left: 2px;
      text-align: left;
      hyphens: none;
      -webkit-hyphens: none;
      -ms-hyphens: none;
      word-break: normal;
      overflow-wrap: break-word;
      text-wrap: pretty;
    }
    
    /* Projects */
    .project-item {
      margin-bottom: 6px;
    }
    
    .project-item:last-child {
      margin-bottom: 4px;
    }
    
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }
    
    .project-name {
      font-weight: bold;
    }
    
    .project-link {
      font-size: 10pt;
    }
    
    .project-link a {
      color: #0066cc;
      text-decoration: none;
    }
    
    /* Education */
    .education-item {
      margin-bottom: 2px;
    }
    
    .education-school {
      font-weight: bold;
    }
    
    .education-degree {
      font-weight: normal;
    }
  `;
}

export const GOOGLE_FONTS_LINK = 'https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,700;1,400&display=swap';
