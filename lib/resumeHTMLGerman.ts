// German Format HTML Generator
// Optimized for German HR conventions
// Section Order: Summary → Skills → Experience → Projects → Education → Languages

import { ResumeJSON } from '@/types/resume';
import { preventWidows } from '@/lib/utils/text';
import { parseBoldMarkdown } from '@/lib/utils/formatBoldText';
import { formatUrlForDisplay } from '@/lib/utils/url';

function formatDateRange(start: string, end: string | null): string {
    return `${start} - ${end || 'Present'}`;
}

function formatEducationDateRange(startDate?: string, endDate?: string, dates?: string): string {
    // Use explicit start/end dates if available, otherwise fallback to dates field
    if (startDate && endDate) {
        return `${startDate} - ${endDate}`;
    }
    if (startDate) {
        return `${startDate} - Present`;
    }
    return dates || '';
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function generateResumeHTMLGerman(data: ResumeJSON): string {
    const { basics, sections } = data;

    // Header contact line - email | link formatted URLs | phone
    const contactItems: string[] = [];
    if (basics.email) {
        contactItems.push(`<a href="mailto:${escapeHtml(basics.email)}">${escapeHtml(basics.email)}</a>`);
    }
    basics.links.forEach(link => {
        // German format: Show full URL for explicit clickable links
        contactItems.push(`<a href="${escapeHtml(link.url)}">${escapeHtml(formatUrlForDisplay(link.url))}</a>`);
    });
    if (basics.phone) {
        contactItems.push(`<span>${escapeHtml(basics.phone)}</span>`);
    }
    const contactHtml = contactItems.join('<span class="separator">|</span>');

    // Work Authorization Line (German recruiters screen for this first)
    const workAuthHtml = basics.workAuthorization
        ? `<div class="work-authorization">${escapeHtml(basics.workAuthorization)}</div>`
        : '';

    // Skills in tabular format
    const skillsHtml = sections.skills.groups
        .map(group =>
            `<div class="skills-row">
        <span class="skill-label">${escapeHtml(group.label)}</span>
        <span class="skill-items">${escapeHtml(group.items.join(', '))}</span>
      </div>`
        )
        .join('');

    // Experience with Company, Position | Location format
    const experienceHtml = sections.experience
        .map(exp => `
      <div class="experience-item">
        <div class="experience-header">
          <span class="experience-title-line">
            <span class="experience-company">${escapeHtml(exp.company)}</span><span class="comma">,</span>
            <span class="experience-position">${escapeHtml(exp.title)}</span>
            <span class="location-separator">|</span>
            <span class="experience-location">${escapeHtml(exp.location)}</span>
          </span>
          <span class="experience-date">${formatDateRange(exp.start, exp.end)}</span>
        </div>
        ${exp.description ? `<div class="experience-description">${escapeHtml(exp.description)}</div>` : ''}
        <ul class="bullet-list">
          ${exp.bullets.map(bullet => `<li>${escapeHtml(preventWidows(bullet))}</li>`).join('')}
        </ul>
      </div>
    `)
        .join('');

    // Projects with explicit full URL links (German format requirement)
    const projectsHtml = sections.projects
        .map(proj => `
      <div class="project-item">
        <div class="project-header">
          <span class="project-name">${escapeHtml(proj.name)}</span>
          ${proj.link ? `<a href="${escapeHtml(proj.link)}" class="project-link" target="_blank" rel="noopener noreferrer">${escapeHtml(formatUrlForDisplay(proj.link))}</a>` : ''}
        </div>
        <ul class="bullet-list">
          ${proj.bullets.map(bullet => `<li>${escapeHtml(preventWidows(bullet))}</li>`).join('')}
        </ul>
      </div>
    `)
        .join('');

    // Education with city/country and explicit date range (German expects timelines)
    const educationHtml = sections.education
        .map(edu => `
      <div class="education-row">
        <span class="education-content">
          <span class="education-school">${escapeHtml(edu.school)}</span><span class="comma">,</span>
          <span class="education-degree">${escapeHtml(edu.degree)}</span>
          ${edu.location ? `<span class="education-location">(${escapeHtml(edu.location)})</span>` : ''}
        </span>
        ${formatEducationDateRange(edu.startDate, edu.endDate, edu.dates) ?
                `<span class="education-date">${escapeHtml(formatEducationDateRange(edu.startDate, edu.endDate, edu.dates))}</span>`
                : ''}
      </div>
    `)
        .join('');

    // Languages with CEFR proficiency levels
    const languagesHtml = sections.languages && sections.languages.length > 0
        ? `
      <section class="resume-section">
        <h2 class="section-header">LANGUAGES</h2>
        <div class="languages-list">
          ${sections.languages.map(lang => `
            <span class="language-item">
              <span class="language-name">${escapeHtml(lang.language)}:</span>
              <span class="language-level">${escapeHtml(lang.proficiency)}</span>
            </span>
          `).join('')}
        </div>
      </section>
    `
        : '';

    // German format section order: Summary → Skills → Experience → Projects → Education → Languages
    return `
    <div class="resume-page format-german">
      <!-- Header -->
      <header class="resume-header">
        <h1 class="resume-name">${escapeHtml(basics.name)}</h1>
      </header>
      
      <!-- Work Authorization Line (German recruiters screen for this first) -->
      ${workAuthHtml}
      
      <!-- Location Line -->
      ${basics.locationLine ? `<div class="resume-location">${escapeHtml(basics.locationLine)}</div>` : ''}
      
      <!-- Contact Info -->
      <div class="resume-contact">
        ${contactHtml}
      </div>

      <!-- Summary Section -->
      ${sections.summary?.visible && sections.summary?.content ? `
      <div class="summary-section">
        <div class="summary-content">${parseBoldMarkdown(sections.summary.content)}</div>
      </div>
      ` : ''}
      
      <!-- Skills Section -->
      <section class="resume-section">
        <h2 class="section-header">SKILLS</h2>
        <div class="skills-table">
          ${skillsHtml}
        </div>
      </section>
      
      <!-- Experience Section -->
      <section class="resume-section">
        <h2 class="section-header">EXPERIENCE</h2>
        ${experienceHtml}
      </section>
      
      <!-- Projects Section -->
      <section class="resume-section">
        <h2 class="section-header">PROJECTS</h2>
        ${projectsHtml}
      </section>
      
      <!-- Education Section -->
      <section class="resume-section">
        <h2 class="section-header">EDUCATION</h2>
        <div class="education-table">
          ${educationHtml}
        </div>
      </section>
      
      <!-- Languages Section (German format) -->
      ${languagesHtml}
    </div>
  `;
}
