'use client';

import React from 'react';
import './resume-styles.css';
import { ResumeJSON, Experience, Project, Education, SkillGroup } from '@/types/resume';

interface ResumePreviewProps {
    data: ResumeJSON;
    scale?: number;
}

function formatDateRange(start: string, end: string | null): string {
    const endStr = end ? end : 'Present';
    return `${start} - ${endStr}`;
}

export default function ResumePreview({ data, scale = 1 }: ResumePreviewProps) {
    const { basics, sections, rendering } = data;
    const densityClass = `density-${rendering.density.toLowerCase()}`;

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
                    <header className="resume-header">
                        <h1 className="resume-name">{basics.name}</h1>
                    </header>

                    {/* Contact Line */}
                    <div className="resume-contact">
                        <a href={`mailto:${basics.email}`}>{basics.email}</a>
                        {basics.links.map((link, idx) => (
                            <React.Fragment key={idx}>
                                <span className="separator">|</span>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.label}
                                </a>
                            </React.Fragment>
                        ))}
                        <span className="separator">|</span>
                        <span>{basics.phone}</span>
                    </div>

                    {/* Skills Section */}
                    <section className="resume-section">
                        <h2 className="section-header">{sections.skills.heading}</h2>
                        <div className="skills-content-inline">
                            {sections.skills.groups.map((group: SkillGroup, idx: number) => (
                                <span key={idx}>
                                    <span className="skill-label">{group.label}:</span>{' '}
                                    <span className="skill-items">{group.items.join(', ')}</span>
                                    {idx < sections.skills.groups.length - 1 && ' '}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Experience Section */}
                    <section className="resume-section">
                        <h2 className="section-header">Experience</h2>
                        {sections.experience.map((exp: Experience, idx: number) => (
                            <div className="experience-item" key={idx}>
                                <div className="experience-header">
                                    <span>
                                        <span className="experience-title">{exp.title}</span>
                                        <span className="experience-company">, {exp.company} - {exp.location}</span>
                                    </span>
                                    <span className="experience-date">
                                        {formatDateRange(exp.start, exp.end)}
                                    </span>
                                </div>
                                <ul className="bullet-list">
                                    {exp.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    {/* Projects Section */}
                    <section className="resume-section">
                        <h2 className="section-header">Projects</h2>
                        {sections.projects.map((proj: Project, idx: number) => (
                            <div className="project-item" key={idx}>
                                <div className="project-header">
                                    <span className="project-name">{proj.name}</span>
                                    {proj.link && (
                                        <span className="project-link">
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer">
                                                Github
                                            </a>
                                        </span>
                                    )}
                                </div>
                                <ul className="bullet-list">
                                    {proj.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    {/* Education Section */}
                    <section className="resume-section">
                        <h2 className="section-header">Education</h2>
                        {sections.education.map((edu: Education, idx: number) => (
                            <div className="education-item" key={idx}>
                                <span className="education-school">{edu.school}</span>
                                <span> - </span>
                                <span className="education-degree">{edu.degree}</span>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
}
