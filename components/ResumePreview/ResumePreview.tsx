'use client';

import React from 'react';
import './resume-styles.css';
import { ResumeJSON, Experience, Project, Education, SkillGroup, LanguageEntry, SectionKey } from '@/types/resume';
import { preventWidows } from '@/lib/utils/text';
import { renderBoldText } from '@/lib/utils/formatBoldText';
import { formatUrlForDisplay } from '@/lib/utils/url';
import { normalizeSectionOrder } from '@/lib/utils/sectionOrder';

interface ResumePreviewProps {
    data: ResumeJSON;
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
    const formatClass = rendering.format?.startsWith('russell')
        ? 'format-russell'
        : rendering.format?.startsWith('german')
            ? 'format-german'
            : 'format-classic';

    // Check for 2-page format
    const isTwoPage = rendering.format?.includes('2page') ?? false;
    const pageHeightStyle = isTwoPage
        ? (rendering.format?.startsWith('german') ? '594mm' : '22in')
        : (rendering.format?.startsWith('german') ? '297mm' : '11in');

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
            'Computer Modern': "'Computer Modern Serif', serif",
            'Computer Modern Thick1': "'Computer Modern Serif', serif",
            'Computer Modern Thick2': "'Computer Modern Serif', serif",
            'Computer Modern Thick3': "'Computer Modern Serif', serif",
            'Computer Modern Concrete': "'Computer Modern Concrete', serif",
        };
        return fontMap[font] || font;
    };

    // Get text stroke for thick variants (simulates thicker text since CM font doesn't have intermediate weights)
    const getTextStroke = (font: string): string | undefined => {
        const strokeMap: Record<string, string> = {
            'Computer Modern Thick1': '0.05px currentColor',
            'Computer Modern Thick2': '0.1px currentColor',
            'Computer Modern Thick3': '0.15px currentColor',
        };
        return strokeMap[font];
    };

    const hasLanguages = rendering.format?.startsWith('german') && (sections.languages?.length ?? 0) > 0;
    const sectionOrder = normalizeSectionOrder(rendering.sectionOrder, rendering.format, hasLanguages);

    const renderSkillsSection = () => {
        if (rendering.format?.startsWith('russell') || rendering.format?.startsWith('german')) {
            return (
                <section
                    className={`resume-section ${getHighlightClass('skills')}`}
                    data-section="skills"
                    onClick={(e) => handleSectionClick(e, 'skills')}
                    title="Edit Skills"
                >
                    <h2 className="section-header">SKILLS</h2>
                    <div className="skills-table">
                        {sections.skills.groups.map((group: SkillGroup, idx: number) => (
                            <div className="skills-row" key={idx}>
                                <span className="skill-label" onClick={(e) => handleSectionClick(e, 'skills', 'label', idx)}>{group.label}</span>
                                <span className="skill-items" onClick={(e) => handleSectionClick(e, 'skills', 'items', idx)}>
                                    {group.items.map((item, itemIdx) => (
                                        <React.Fragment key={itemIdx}>
                                            {renderBoldText(item)}
                                            {itemIdx < group.items.length - 1 ? ', ' : ''}
                                        </React.Fragment>
                                    ))}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            );
        }

        return (
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
                            <span className="skill-items" onClick={(e) => handleSectionClick(e, 'skills', 'items', idx)}>
                                {group.items.map((item, itemIdx) => (
                                    <React.Fragment key={itemIdx}>
                                        {renderBoldText(item)}
                                        {itemIdx < group.items.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))}
                            </span>
                            {idx < sections.skills.groups.length - 1 && ' '}
                        </span>
                    ))}
                </div>
            </section>
        );
    };

    const renderExperienceSection = () => (
        <section
            className={`resume-section ${getHighlightClass('experience')}`}
            data-section="experience"
            onClick={(e) => handleSectionClick(e, 'experience')}
            title="Edit Experience"
        >
            <h2 className="section-header">{(rendering.format?.startsWith('russell') || rendering.format?.startsWith('german')) ? 'EXPERIENCE' : 'Experience'}</h2>
            {sections.experience.map((exp: Experience, idx: number) => (
                <div className="experience-item" key={idx}>
                    <div className="experience-header">
                        {rendering.format?.startsWith('russell') ? (
                            // Russell format: Position, Company | Location
                            <span className="experience-title-line">
                                <span className="experience-position" onClick={(e) => handleSectionClick(e, 'experience', 'title', idx)}>{exp.title}</span>
                                <span className="comma">, </span>
                                <span className="experience-company" onClick={(e) => handleSectionClick(e, 'experience', 'company', idx)}>{exp.company}</span>
                                <span className="location-separator"> | </span>
                                <span className="experience-location" onClick={(e) => handleSectionClick(e, 'experience', 'location', idx)}>{exp.location}</span>
                            </span>
                        ) : rendering.format?.startsWith('german') ? (
                            // German format: Company, Position | Location
                            <span className="experience-title-line">
                                <span className="experience-company" onClick={(e) => handleSectionClick(e, 'experience', 'company', idx)}>{exp.company}</span>
                                <span className="comma">, </span>
                                <span className="experience-position" onClick={(e) => handleSectionClick(e, 'experience', 'title', idx)}>{exp.title}</span>
                                <span className="location-separator"> | </span>
                                <span className="experience-location" onClick={(e) => handleSectionClick(e, 'experience', 'location', idx)}>{exp.location}</span>
                            </span>
                        ) : (
                            // Classic format: Title, Company - Location
                            <span>
                                <span className="experience-title" onClick={(e) => handleSectionClick(e, 'experience', 'title', idx)}>{exp.title}</span>
                                <span className="experience-company" onClick={(e) => handleSectionClick(e, 'experience', 'company', idx)}>, {exp.company} - {exp.location}</span>
                            </span>
                        )}
                        <span className="experience-date" onClick={(e) => handleSectionClick(e, 'experience', 'start', idx)}>
                            {formatDateRange(exp.start, exp.end)}
                        </span>
                    </div>
                    {exp.description && (
                        <div
                            className="experience-description"
                            onClick={(e) => handleSectionClick(e, 'experience', 'description', idx)}
                        >
                            {exp.description}
                        </div>
                    )}
                    <ul className="bullet-list">
                        {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} onClick={(e) => handleSectionClick(e, 'experience', 'bullets', idx, bIdx)}>
                                {renderBoldText(preventWidows(bullet))}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );

    const renderProjectsSection = () => {
        if (rendering.format?.startsWith('german')) {
            return (
                <section
                    className={`resume-section ${getHighlightClass('projects')}`}
                    data-section="projects"
                    onClick={(e) => handleSectionClick(e, 'projects')}
                    title="Edit Projects"
                >
                    <h2 className="section-header">PROJECTS</h2>
                    {sections.projects.map((proj: Project, idx: number) => (
                        <div className="project-item" key={idx}>
                            <div className="project-header">
                                <span className="project-name" onClick={(e) => handleSectionClick(e, 'projects', 'name', idx)}>{proj.name}</span>
                                {proj.link && (
                                    <a
                                        href={proj.link}
                                        className="project-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => handleSectionClick(e, 'projects', 'link', idx)}
                                    >
                                        {formatUrlForDisplay(proj.link)}
                                    </a>
                                )}
                            </div>
                            <ul className="bullet-list">
                                {proj.bullets.map((bullet, bIdx) => (
                                    <li key={bIdx} onClick={(e) => handleSectionClick(e, 'projects', 'bullets', idx, bIdx)}>
                                        {renderBoldText(preventWidows(bullet))}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            );
        }

        if (rendering.format?.startsWith('russell')) {
            return (
                <section
                    className={`resume-section ${getHighlightClass('projects')}`}
                    data-section="projects"
                    onClick={(e) => handleSectionClick(e, 'projects')}
                    title="Edit Projects"
                >
                    <h2 className="section-header">PROJECTS</h2>
                    {sections.projects.map((proj: Project, idx: number) => (
                        <div className="project-item" key={idx}>
                            <div className="project-header">
                                <span className="project-name" onClick={(e) => handleSectionClick(e, 'projects', 'name', idx)}>{proj.name}</span>
                                {proj.link && (
                                    <a
                                        href={proj.link}
                                        className="project-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => handleSectionClick(e, 'projects', 'link', idx)}
                                    >
                                        GitHub
                                    </a>
                                )}
                            </div>
                            <ul className="bullet-list">
                                {proj.bullets.map((bullet, bIdx) => (
                                    <li key={bIdx} onClick={(e) => handleSectionClick(e, 'projects', 'bullets', idx, bIdx)}>
                                        {renderBoldText(preventWidows(bullet))}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            );
        }

        return (
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
                                <li key={bIdx} onClick={(e) => handleSectionClick(e, 'projects', 'bullets', idx, bIdx)}>
                                    {renderBoldText(preventWidows(bullet))}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        );
    };

    const renderEducationSection = () => {
        if (rendering.format?.startsWith('russell')) {
            return (
                <section
                    className={`resume-section ${getHighlightClass('education')}`}
                    data-section="education"
                    onClick={(e) => handleSectionClick(e, 'education')}
                    title="Edit Education"
                >
                    <h2 className="section-header">EDUCATION</h2>
                    <div className="education-table">
                        {sections.education.map((edu: Education, idx: number) => (
                            <div className="education-row" key={idx}>
                                <span className="education-content">
                                    <span className="education-degree" onClick={(e) => handleSectionClick(e, 'education', 'degree', idx)}>{edu.degree}</span>
                                    <span className="comma">, </span>
                                    <span className="education-school" onClick={(e) => handleSectionClick(e, 'education', 'school', idx)}>{edu.school}</span>
                                </span>
                                {edu.dates && <span className="education-date">{edu.dates}</span>}
                            </div>
                        ))}
                    </div>
                </section>
            );
        }

        if (rendering.format?.startsWith('german')) {
            return (
                <section
                    className={`resume-section ${getHighlightClass('education')}`}
                    data-section="education"
                    onClick={(e) => handleSectionClick(e, 'education')}
                    title="Edit Education"
                >
                    <h2 className="section-header">EDUCATION</h2>
                    <div className="education-table">
                        {sections.education.map((edu: Education, idx: number) => (
                            <div className="education-row" key={idx}>
                                <span className="education-content">
                                    <span className="education-school" onClick={(e) => handleSectionClick(e, 'education', 'school', idx)}>{edu.school}</span>
                                    <span className="comma">, </span>
                                    <span className="education-degree" onClick={(e) => handleSectionClick(e, 'education', 'degree', idx)}>{edu.degree}</span>
                                    {edu.location && <span className="education-location"> ({edu.location})</span>}
                                </span>
                                {(edu.startDate || edu.endDate || edu.dates) && (
                                    <span className="education-date">
                                        {edu.startDate && edu.endDate
                                            ? `${edu.startDate} - ${edu.endDate}`
                                            : edu.startDate
                                                ? `${edu.startDate} - Present`
                                                : edu.dates}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            );
        }

        return (
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
        );
    };

    const renderLanguagesSection = () => {
        if (!rendering.format?.startsWith('german') || !hasLanguages) {
            return null;
        }

        return (
            <section
                className={`resume-section ${getHighlightClass('languages')}`}
                data-section="languages"
                onClick={(e) => handleSectionClick(e, 'languages')}
                title="Edit Languages"
            >
                <h2 className="section-header">LANGUAGES</h2>
                <div className="languages-list">
                    {sections.languages?.map((lang: LanguageEntry, idx: number) => (
                        <span className="language-item" key={idx}>
                            <span className="language-name">{lang.language}:</span>
                            <span className="language-level">{lang.proficiency}</span>
                        </span>
                    ))}
                </div>
            </section>
        );
    };

    const sectionRenderers: Record<SectionKey, () => JSX.Element | null> = {
        skills: renderSkillsSection,
        experience: renderExperienceSection,
        projects: renderProjectsSection,
        education: renderEducationSection,
        languages: renderLanguagesSection,
    };

    return (
        <div className="resume-preview-container">
            <div
                className="resume-preview-wrapper"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            >
                <div
                    className={`resume-page ${densityClass} ${formatClass}`}
                    id="resume-content"
                    style={{
                        fontFamily: getFontFamily(rendering.fontFamily),
                        fontSize: `${rendering.fontSize || 11}pt`,
                        lineHeight: rendering.lineHeight || 1.15,
                        WebkitTextStroke: getTextStroke(rendering.fontFamily),
                        minHeight: pageHeightStyle,
                        maxHeight: isTwoPage ? 'none' : pageHeightStyle,
                        overflow: isTwoPage ? 'visible' : 'hidden',
                        // For 2-page formats: add padding at the page break point using CSS
                        ...(isTwoPage ? {
                            paddingBottom: rendering.format?.startsWith('german') ? '7mm' : rendering.format?.startsWith('russell') ? '0.35in' : '0.5in',
                        } : {})
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

                    {/* Work Authorization Line - German format only (recruiters screen for this first) */}
                    {rendering.format?.startsWith('german') && basics.workAuthorization && (
                        <div className="work-authorization">{basics.workAuthorization}</div>
                    )}

                    {/* Page Break Spacer for 2-page formats - creates actual margin gap */}
                    {isTwoPage && (
                        <div
                            className="page-break-spacer"
                            style={{
                                position: 'absolute',
                                top: rendering.format?.startsWith('german') ? 'calc(297mm - 7mm)' : rendering.format?.startsWith('russell') ? 'calc(11in - 0.35in)' : 'calc(11in - 0.5in)',
                                left: rendering.format?.startsWith('russell') ? '-0.4in' : rendering.format?.startsWith('german') ? '-8mm' : '-0.6in',
                                right: rendering.format?.startsWith('russell') ? '-0.4in' : rendering.format?.startsWith('german') ? '-8mm' : '-0.6in',
                                height: rendering.format?.startsWith('german') ? '14mm' : rendering.format?.startsWith('russell') ? '0.7in' : '1in',
                                background: '#f9fafb',
                                zIndex: 40,
                                display: 'flex',
                                flexDirection: 'column',
                                borderTop: '1px dashed #d1d5db',
                                borderBottom: '1px dashed #d1d5db',
                            }}
                        >
                            {/* Page 1 Bottom Margin */}
                            <div style={{
                                flex: 1,
                                background: '#f9fafb',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                paddingBottom: '4px',
                            }}>
                                <span style={{
                                    fontSize: '9px',
                                    color: '#9ca3af',
                                    fontWeight: 500,
                                }}>
                                    ▲ Page 1 Margin
                                </span>
                            </div>
                            {/* Page Break Visual Indicator */}
                            <div style={{
                                height: '20px',
                                background: '#e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <span style={{
                                    background: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                }}>
                                    Page Break
                                </span>
                            </div>
                            {/* Page 2 Top Margin */}
                            <div style={{
                                flex: 1,
                                background: '#f9fafb',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                paddingTop: '4px',
                            }}>
                                <span style={{
                                    fontSize: '9px',
                                    color: '#9ca3af',
                                    fontWeight: 500,
                                }}>
                                    Page 2 Margin ▼
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Location Line - Russell and German formats */}
                    {(rendering.format?.startsWith('russell') || rendering.format?.startsWith('german')) && basics.locationLine && (
                        <div className="resume-location">{basics.locationLine}</div>
                    )}

                    {/* Contact Line */}
                    <div
                        className={`resume-contact ${getHighlightClass('contact')}`}
                        data-section="contact"
                        onClick={(e) => handleSectionClick(e, 'basics')}
                        title="Edit Contact Info"
                    >
                        {rendering.format?.startsWith('russell') ? (
                            // Russell format: email | link formatted urls | phone
                            <>
                                <a href={`mailto:${basics.email}`} onClick={(e) => handleSectionClick(e, 'basics', 'email')}>{basics.email}</a>
                                {basics.links.map((link, idx) => (
                                    <React.Fragment key={idx}>
                                        <span className="separator">|</span>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => handleSectionClick(e, 'basics', 'links', idx, 0)}
                                        >
                                            {formatUrlForDisplay(link.url)}
                                        </a>
                                    </React.Fragment>
                                ))}
                                <span className="separator">|</span>
                                <span onClick={(e) => handleSectionClick(e, 'basics', 'phone')}>{basics.phone}</span>
                            </>
                        ) : (
                            // Classic format: email | link formatted urls | phone
                            <>
                                <a href={`mailto:${basics.email}`} onClick={(e) => handleSectionClick(e, 'basics', 'email')}>{basics.email}</a>
                                {basics.links.map((link, idx) => (
                                    <React.Fragment key={idx}>
                                        <span className="separator">|</span>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => handleSectionClick(e, 'basics', 'links', idx, 0)}
                                        >
                                            {formatUrlForDisplay(link.url)}
                                        </a>
                                    </React.Fragment>
                                ))}
                                <span className="separator">|</span>
                                <span onClick={(e) => handleSectionClick(e, 'basics', 'phone')}>{basics.phone}</span>
                            </>
                        )}
                    </div>

                    {/* Summary Section (Both formats) */}
                    {data.sections.summary?.visible && data.sections.summary?.content && (
                        <div
                            className="resume-section"
                            data-section="summary"
                            onClick={(e) => handleSectionClick(e, 'summary')}
                            title="Edit Summary"
                            style={{
                                marginBottom: '2mm',
                                marginTop: '0mm'
                            }}
                        >
                            <p style={{
                                textAlign: 'left',
                                margin: 0,
                                fontSize: '1em'
                            }}>
                                {renderBoldText(data.sections.summary.content)}
                            </p>
                        </div>
                    )}

                    {sectionOrder.map((key) => (
                        <React.Fragment key={key}>
                            {sectionRenderers[key]?.()}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
