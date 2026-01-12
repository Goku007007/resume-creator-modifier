// Russell Format HTML Generator
// Exact match to the LaTeX Russell CV class template
// Section Order: Summary → Experience → Education → Skills → Projects

import { ResumeJSON } from '@/types/resume';

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
    // Use link label instead of full URL
    contactItems.push(`<a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`);
  });
  if (basics.phone) {
    contactItems.push(`<span>${escapeHtml(basics.phone)}</span>`);
  }
  const contactHtml = contactItems.join('<span class="separator">|</span>');

  // Experience with Company, Position | Location format (matching LaTeX)
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
        <ul class="bullet-list">
          ${exp.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}
        </ul>
      </div>
    `)
    .join('');

  // Education with School, Degree | Location and Date (matching LaTeX cvhonor format)
  const educationHtml = sections.education
    .map(edu => `
      <div class="education-row">
        <span class="education-content">
          <span class="education-school">${escapeHtml(edu.school)}</span><span class="comma">,</span>
          <span class="education-degree">${escapeHtml(edu.degree)}</span>
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
                <span class="skill-items">${escapeHtml(group.items.join(', '))}</span>
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
          ${proj.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}
        </ul>
      </div>
    `)
    .join('');

  // Russell format section order: Summary → Experience → Education → Skills → Projects
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
      
      <!-- Experience Section -->
      <section class="resume-section">
        <h2 class="section-header">EXPERIENCE</h2>
        ${experienceHtml}
      </section>
      
      <!-- Education Section -->
      <section class="resume-section">
        <h2 class="section-header">EDUCATION</h2>
        <div class="education-table">
          ${educationHtml}
        </div>
      </section>
      
      <!-- Skills Section -->
      <section class="resume-section">
        <h2 class="section-header">SKILLS</h2>
        <div class="skills-table">
          ${skillsHtml}
        </div>
      </section>
      
      <!-- Projects Section -->
      <section class="resume-section">
        <h2 class="section-header">PROJECTS</h2>
        ${projectsHtml}
      </section>
    </div>
  `;
}
