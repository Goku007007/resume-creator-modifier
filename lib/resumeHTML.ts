// Shared Resume HTML Generator
// Single source of truth for resume HTML structure

import { ResumeJSON } from '@/types/resume';
import { preventWidows } from '@/lib/utils/text';
import { parseBoldMarkdown } from '@/lib/utils/formatBoldText';

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

export function generateResumeHTML(data: ResumeJSON): string {
  const { basics, sections } = data;

  const linksHtml = basics.links
    .map(link => `<span class="separator">|</span><a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`)
    .join('');

  const skillsHtml = sections.skills.groups
    .map((group, idx) =>
      `<span><span class="skill-label">${escapeHtml(group.label)}:</span> <span class="skill-items">${escapeHtml(group.items.join(', '))}</span>${idx < sections.skills.groups.length - 1 ? ' ' : ''}</span>`
    )
    .join('');

  const experienceHtml = sections.experience
    .map(exp => `
      <div class="experience-item">
        <div class="experience-header">
          <span><span class="experience-title">${escapeHtml(exp.title)}</span><span class="experience-company">, ${escapeHtml(exp.company)} - ${escapeHtml(exp.location)}</span></span>
          <span class="experience-date">${formatDateRange(exp.start, exp.end)}</span>
        </div>
        <ul class="bullet-list">
          ${exp.bullets.map(bullet => `<li>${escapeHtml(preventWidows(bullet))}</li>`).join('')}
        </ul>
      </div>
    `)
    .join('');

  const projectsHtml = sections.projects
    .map(proj => `
      <div class="project-item">
        <div class="project-header">
          <span class="project-name">${escapeHtml(proj.name)}</span>
          ${proj.link ? `<span class="project-link"><a href="${escapeHtml(proj.link)}">Github</a></span>` : ''}
        </div>
        <ul class="bullet-list">
          ${proj.bullets.map(bullet => `<li>${escapeHtml(preventWidows(bullet))}</li>`).join('')}
        </ul>
      </div>
    `)
    .join('');

  const educationHtml = sections.education
    .map(edu => `
      <div class="education-item">
        <span class="education-school">${escapeHtml(edu.school)}</span><span> - </span><span class="education-degree">${escapeHtml(edu.degree)}</span>
      </div>
    `)
    .join('');

  return `
    <div class="resume-page">
      <header class="resume-header">
        <h1 class="resume-name">${escapeHtml(basics.name)}</h1>
      </header>
      
      <div class="resume-contact">
        <a href="mailto:${escapeHtml(basics.email)}">${escapeHtml(basics.email)}</a>
        ${linksHtml}
        <span class="separator">|</span>
        <span>${escapeHtml(basics.phone)}</span>
      </div>
      
      ${sections.summary?.visible && sections.summary?.content ? `
      <div class="summary-section">
        <div class="summary-content">${parseBoldMarkdown(sections.summary.content)}</div>
      </div>
      ` : ''}

      <section class="resume-section">
        <h2 class="section-header">${escapeHtml(sections.skills.heading)}</h2>
        <div class="skills-content-inline">
          ${skillsHtml}
        </div>
      </section>
      
      <section class="resume-section">
        <h2 class="section-header">Experience</h2>
        ${experienceHtml}
      </section>
      
      <section class="resume-section">
        <h2 class="section-header">Projects</h2>
        ${projectsHtml}
      </section>
      
      <section class="resume-section">
        <h2 class="section-header">Education</h2>
        ${educationHtml}
      </section>
    </div>
  `;
}
