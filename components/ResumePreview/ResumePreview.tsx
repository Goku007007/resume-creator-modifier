'use client';

import React from 'react';
import './resume-styles.css';
import { ResumeJSON, Experience, Project, Education, SkillGroup } from '@/types/resume';

interface ResumePreviewProps {
    data: ResumeJSON;
    scale?: number;
    scale?: number;
    highlightedSection?: string | null;
    onSectionClick?: (section: string, field?: string, index?: number, subIndex?: number) => void;
}

function formatDateRange(start: string, end: string | null): string {
    const endStr = end ? end : 'Present';
    return `${start} - ${endStr}`;
}

export default function ResumePreview({ data, scale = 1, highlightedSection, onSectionClick }: ResumePreviewProps) {
    const { basics, sections, rendering } = data;
    const densityClass = `density-${rendering.density.toLowerCase()}`;

    // Helper to request scroll to editor section/field
    const handleSectionClick = (e: React.MouseEvent, sectionId: string, field?: string, index?: number, subIndex?: number) => {
        e.stopPropagation();
        onSectionClick?.(sectionId, field, index, subIndex);
    };

    // Helper to get highlight class for a section
    const getHighlightClass = (section: string) =>
        highlightedSection === section ? 'section-highlighted' : '';

    // Map font names to proper CSS font-family strings
    const getFontFamily = (font: string): string => {
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
        return fontMap[font] || font;
    };

    return (
        <div className="resume-preview-container">
            <div
                className="resume-preview-wrapper"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            >
                <div
                    className={`resume-page ${densityClass}`}
                    id="resume-content"
                    style={{
                        fontFamily: getFontFamily(rendering.fontFamily),
                        fontSize: `${rendering.fontSize || 11}pt`,
                        lineHeight: rendering.lineHeight || 1.15
                    }}
                >
                    {/* Header */}
                    <header
                        className={`resume-header ${getHighlightClass('contact')}`}
                        data-section="contact"
                        onClick={(e) => handleSectionClick(e, 'basics', 'name')}
                        title="Edit Contact Info"
                    >
                        <h1 className="resume-name">{basics.name}</h1>
                    </header>

                    {/* Contact Line */}
                    <div
                        className={`resume-contact ${getHighlightClass('contact')}`}
                        data-section="contact"
                        onClick={(e) => handleSectionClick(e, 'basics')}
                        title="Edit Contact Info"
                    >
                        <a href={`mailto:${basics.email}`} onClick={(e) => handleSectionClick(e, 'basics', 'email')}>{basics.email}</a>
                        {basics.links.map((link, idx) => (
                            <React.Fragment key={idx}>
                                <span className="separator">|</span>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => handleSectionClick(e, 'basics', 'links', idx, 0)} // Using subIndex 0 for label/url roughly
                                >
                                    {link.label}
                                </a>
                            </React.Fragment>
                        ))}
                        <span className="separator">|</span>
                        <span onClick={(e) => handleSectionClick(e, 'basics', 'phone')}>{basics.phone}</span>
                    </div>

                    {/* Skills Section */}
                    <section
                        className={`resume-section ${getHighlightClass('skills')}`}
                        data-section="skills"
                        onClick={(e) => handleSectionClick(e, 'skills')}
                        title="Edit Skills"
                    >
                        <h2 className="section-header">{sections.skills.heading}</h2>
                        <div className="skills-content-inline">
                            {sections.skills.groups.map((group: SkillGroup, idx: number) => (
                                <span key={idx}>
                                    <span className="skill-label" onClick={(e) => handleSectionClick(e, 'skills', 'label', idx)}>{group.label}:</span>{' '}
                                    <span className="skill-items" onClick={(e) => handleSectionClick(e, 'skills', 'items', idx)}>{group.items.join(', ')}</span>
                                    {idx < sections.skills.groups.length - 1 && ' '}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Experience Section */}
                    <section
                        className={`resume-section ${getHighlightClass('experience')}`}
                        data-section="experience"
                        onClick={(e) => handleSectionClick(e, 'experience')}
                        title="Edit Experience"
                    >
                        <h2 className="section-header">Experience</h2>
                        {sections.experience.map((exp: Experience, idx: number) => (
                            <div className="experience-item" key={idx}>
                                <div className="experience-header">
                                    <span>
                                        <span className="experience-title" onClick={(e) => handleSectionClick(e, 'experience', 'title', idx)}>{exp.title}</span>
                                        <span className="experience-company" onClick={(e) => handleSectionClick(e, 'experience', 'company', idx)}>, {exp.company} - {exp.location}</span>
                                    </span>
                                    <span className="experience-date" onClick={(e) => handleSectionClick(e, 'experience', 'start', idx)}>
                                        {formatDateRange(exp.start, exp.end)}
                                    </span>
                                </div>
                                <ul className="bullet-list">
                                    {exp.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx} onClick={(e) => handleSectionClick(e, 'experience', 'bullets', idx, bIdx)}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    {/* Projects Section */}
                    <section
                        className={`resume-section ${getHighlightClass('projects')}`}
                        data-section="projects"
                        onClick={(e) => handleSectionClick(e, 'projects')}
                        title="Edit Projects"
                    >
                        <h2 className="section-header">Projects</h2>
                        {sections.projects.map((proj: Project, idx: number) => (
                            <div className="project-item" key={idx}>
                                <div className="project-header">
                                    <span className="project-name" onClick={(e) => handleSectionClick(e, 'projects', 'name', idx)}>{proj.name}</span>
                                    {proj.link && (
                                        <span className="project-link">
                                            <a
                                                href={proj.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => handleSectionClick(e, 'projects', 'link', idx)}
                                            >
                                                Github
                                            </a>
                                        </span>
                                    )}
                                </div>
                                <ul className="bullet-list">
                                    {proj.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx} onClick={(e) => handleSectionClick(e, 'projects', 'bullets', idx, bIdx)}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    {/* Education Section */}
                    <section
                        className={`resume-section ${getHighlightClass('education')}`}
                        data-section="education"
                        onClick={(e) => handleSectionClick(e, 'education')}
                        title="Edit Education"
                    >
                        <h2 className="section-header">Education</h2>
                        {sections.education.map((edu: Education, idx: number) => (
                            <div className="education-item" key={idx}>
                                <span className="education-school" onClick={(e) => handleSectionClick(e, 'education', 'school', idx)}>{edu.school}</span>
                                <span> - </span>
                                <span className="education-degree" onClick={(e) => handleSectionClick(e, 'education', 'degree', idx)}>{edu.degree}</span>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
}
