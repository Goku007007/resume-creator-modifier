// Russell Format HTML Generator
// Exact match to the LaTeX Russell CV class template
// Section order is user-configurable (default: Skills → Experience → Projects → Education)

import { ResumeJSON, SectionKey } from '@/types/resume';
import { preventWidows } from '@/lib/utils/text';
import { parseBoldMarkdown } from '@/lib/utils/formatBoldText';
import { formatUrlForDisplay } from '@/lib/utils/url';
import { normalizeSectionOrder } from '@/lib/utils/sectionOrder';

function formatDateRange(start: string, end: string | null): string {
  return `${start} - ${end || 'Present'}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateResumeHTMLRussell(data: ResumeJSON): string {
  const { basics, sections } = data;

  // Header contact line - email | link labels | phone (matching user's desired format)
  const contactItems: string[] = [];
  if (basics.email) {
    contactItems.push(`<a href="mailto:${escapeHtml(basics.email)}">${escapeHtml(basics.email)}</a>`);
  }
  basics.links.forEach(link => {
    // Use formatted URL instead of link label (matching user's request)
    contactItems.push(`<a href="${escapeHtml(link.url)}">${escapeHtml(formatUrlForDisplay(link.url))}</a>`);
  });
  if (basics.phone) {
    contactItems.push(`<span>${escapeHtml(basics.phone)}</span>`);
  }
  const contactHtml = contactItems.join('<span class="separator">|</span>');

  // Experience with Position, Company | Location format (per user request)
  const experienceHtml = sections.experience
    .map(exp => `
      <div class="experience-item">
        <div class="experience-header">
          <span class="experience-title-line">
            <span class="experience-position">${escapeHtml(exp.title)}</span><span class="comma">,</span>
            <span class="experience-company">${escapeHtml(exp.company)}</span>
            <span class="location-separator">|</span>
            <span class="experience-location">${escapeHtml(exp.location)}</span>
          </span>
          <span class="experience-date">${formatDateRange(exp.start, exp.end)}</span>
        </div>
        ${exp.description ? `<div class="experience-description">${escapeHtml(exp.description)}</div>` : ''}
        <ul class="bullet-list">
          ${exp.bullets.map(bullet => `<li>${parseBoldMarkdown(preventWidows(bullet))}</li>`).join('')}
        </ul>
      </div>
    `)
    .join('');

  // Education with Degree, School | Location and Date (per user request)
  const educationHtml = sections.education
    .map(edu => `
      <div class="education-row">
        <span class="education-content">
          <span class="education-degree">${escapeHtml(edu.degree)}</span><span class="comma">,</span>
          <span class="education-school">${escapeHtml(edu.school)}</span>
        </span>
        ${edu.dates ? `<span class="education-date">${escapeHtml(edu.dates)}</span>` : ''}
      </div>
    `)
    .join('');

  // Skills in tabular format (matching LaTeX cvskill format)
  const skillsHtml = sections.skills.groups
    .map(group =>
      `<div class="skills-row">
                <span class="skill-label">${escapeHtml(group.label)}</span>
                <span class="skill-items">${group.items.map((item) => parseBoldMarkdown(item)).join(', ')}</span>
            </div>`
    )
    .join('');

  // Projects with title and link, then bullets (matching LaTeX cventry format)
  const projectsHtml = sections.projects
    .map(proj => `
      <div class="project-item">
        <div class="project-header">
          <span class="project-name">${escapeHtml(proj.name)}</span>
          ${proj.link ? `<a href="${escapeHtml(proj.link)}" class="project-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
        </div>
        <ul class="bullet-list">
          ${proj.bullets.map(bullet => `<li>${parseBoldMarkdown(preventWidows(bullet))}</li>`).join('')}
        </ul>
      </div>
    `)
    .join('');

  const sectionOrder = normalizeSectionOrder(data.rendering.sectionOrder, data.rendering.format, false);
  const sectionBlocks: Record<SectionKey, string> = {
    skills: `
      <section class="resume-section">
        <h2 class="section-header">SKILLS</h2>
        <div class="skills-table">
          ${skillsHtml}
        </div>
      </section>
    `,
    experience: `
      <section class="resume-section">
        <h2 class="section-header">EXPERIENCE</h2>
        ${experienceHtml}
      </section>
    `,
    projects: `
      <section class="resume-section">
        <h2 class="section-header">PROJECTS</h2>
        ${projectsHtml}
      </section>
    `,
    education: `
      <section class="resume-section">
        <h2 class="section-header">EDUCATION</h2>
        <div class="education-table">
          ${educationHtml}
        </div>
      </section>
    `,
    languages: '',
  };
  const orderedSectionsHtml = sectionOrder.map((key) => sectionBlocks[key] || '').join('');

  return `
    <div class="resume-page format-russell">
      <!-- Header -->
      <header class="resume-header">
        <h1 class="resume-name">${escapeHtml(basics.name)}</h1>
      </header>
      
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

      ${orderedSectionsHtml}
    </div>
  `;
}
