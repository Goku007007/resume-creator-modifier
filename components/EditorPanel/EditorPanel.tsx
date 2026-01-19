'use client';

import React from 'react';
import { ResumeJSON, SkillGroup, Experience, Project, Education, Link } from '@/types/resume';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';

interface EditorPanelProps {
    data: ResumeJSON;
    onChange: (data: ResumeJSON) => void;
    onSectionFocus?: (section: string) => void;
    scrollTarget?: { section: string; field?: string; index?: number; subIndex?: number; ts: number } | null;
}

// Reusable Accordion Section Component
interface AccordionSectionProps {
    id: string;
    title: string;
    icon: string;
    count?: number;
    summary: string;
    icon: string;
    count?: number;
    summary: string;
    isExpanded: boolean;
    onToggle: () => void;
    onAdd?: () => void;
    addLabel?: string;
    children: React.ReactNode;
}

// Professional SVG Icons
const SectionIcons = {
    contact: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    skills: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    ),
    experience: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    projects: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    education: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    ),
    summary: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
};

function AccordionSection({
    id,
    title,
    icon,
    count,
    summary,
    isExpanded,
    onToggle,
    onAdd,
    addLabel,
    children,
}: AccordionSectionProps) {
    return (
        <section id={`section-${id}`} className={`bg-gray-800/40 rounded-xl border ${isExpanded ? 'border-gray-700/80 shadow-sm' : 'border-gray-800/50'} overflow-hidden transition-all duration-200`}>
            {/* Accordion Header */}
            <div
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${isExpanded ? 'bg-gray-800/50' : 'hover:bg-gray-800/50'}`}
                onClick={onToggle}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Expand/Collapse Arrow */}
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>

                    {/* Icon + Title + Count */}
                    <div className="flex items-center gap-3">
                        <span className={`transition-colors ${isExpanded ? 'text-blue-400' : 'text-gray-400'}`}>
                            {SectionIcons[icon as keyof typeof SectionIcons] || icon}
                        </span>
                        <h3 className={`font-medium transition-colors ${isExpanded ? 'text-gray-100' : 'text-gray-300'}`}>
                            {title}
                        </h3>
                        {count !== undefined && (
                            <span className="text-xs text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">{count}</span>
                        )}
                    </div>

                    {/* Summary (when collapsed) */}
                    {!isExpanded && (
                        <span className="text-sm text-gray-500 truncate ml-2">{summary}</span>
                    )}
                </div>

                {/* Add Button */}
                {onAdd && addLabel && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd();
                        }}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-400/10 transition-colors flex items-center gap-1.5"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {addLabel}
                    </button>
                )}
            </div>

            {/* Accordion Content */}
            <div className={`transition-all duration-200 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-4 pb-4 space-y-3">
                    {children}
                </div>
            </div>
        </section>
    );
}

// Section IDs for navigation
const SECTIONS = [
    { id: 'basics', label: 'Contact', icon: 'contact' },
    { id: 'summary', label: 'Summary', icon: 'summary' },
    { id: 'skills', label: 'Skills', icon: 'skills' },
    { id: 'experience', label: 'Experience', icon: 'experience' },
    { id: 'projects', label: 'Projects', icon: 'projects' },
    { id: 'education', label: 'Education', icon: 'education' },
];

export default function EditorPanel({ data, onChange, onSectionFocus, scrollTarget }: EditorPanelProps) {
    const [activeSection, setActiveSection] = React.useState('basics');
    const [deleteConfirm, setDeleteConfirm] = React.useState<{ type: string; index: number; name: string } | null>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Track which sections are expanded (all expanded by default)
    const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
        basics: true,
        summary: true,
        skills: true,
        experience: true,
        projects: true,
        education: true,
    });

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    // Update active section on scroll
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const sections = SECTIONS.map(s => ({
                ...s,
                el: container.querySelector(`#section-${s.id}`) as HTMLElement
            })).filter(s => s.el);

            const scrollTop = container.scrollTop + 80; // Offset for sticky header

            for (let i = sections.length - 1; i >= 0; i--) {
                if (sections[i].el.offsetTop <= scrollTop) {
                    setActiveSection(sections[i].id);
                    break;
                }
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle scroll target changes from parent
    React.useEffect(() => {
        if (scrollTarget) {
            scrollToSection(scrollTarget.section);

            // Allow a small delay for section expansion animation before focusing field
            if (scrollTarget.field) {
                setTimeout(() => {
                    const idParts = ['input', scrollTarget.section];
                    if (typeof scrollTarget.index === 'number') idParts.push(scrollTarget.index.toString());
                    idParts.push(scrollTarget.field);
                    if (typeof scrollTarget.subIndex === 'number') idParts.push(scrollTarget.subIndex.toString());

                    const elementId = idParts.join('-');
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.focus();
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        }
    }, [scrollTarget]);

    const scrollToSection = (sectionId: string) => {
        const container = containerRef.current;
        const element = container?.querySelector(`#section-${sectionId}`);
        if (element && container) {
            // Auto-expand if collapsed
            if (!expandedSections[sectionId]) {
                setExpandedSections((prev) => ({ ...prev, [sectionId]: true }));
            }
            const offset = (element as HTMLElement).offsetTop - 60;
            container.scrollTo({ top: offset, behavior: 'smooth' });
            setActiveSection(sectionId);
        }
    };

    const updateBasics = (field: string, value: string) => {
        onChange({
            ...data,
            basics: { ...data.basics, [field]: value },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const updateLink = (index: number, field: keyof Link, value: string) => {
        const newLinks = [...data.basics.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        onChange({
            ...data,
            basics: { ...data.basics, links: newLinks },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const updateSkillGroup = (index: number, field: keyof SkillGroup, value: string | string[]) => {
        const newGroups = [...data.sections.skills.groups];
        if (field === 'items' && typeof value === 'string') {
            newGroups[index] = { ...newGroups[index], items: value.split(',').map((s) => s.trim()) };
        } else {
            newGroups[index] = { ...newGroups[index], [field]: value };
        }
        onChange({
            ...data,
            sections: { ...data.sections, skills: { ...data.sections.skills, groups: newGroups } },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const addSkillGroup = () => {
        const newGroups = [...data.sections.skills.groups, { label: 'New Category', items: [] }];
        onChange({
            ...data,
            sections: { ...data.sections, skills: { ...data.sections.skills, groups: newGroups } },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
        // Auto-expand skills section
        setExpandedSections((prev) => ({ ...prev, skills: true }));
    };

    const removeSkillGroup = (index: number) => {
        const newGroups = data.sections.skills.groups.filter((_, i) => i !== index);
        onChange({
            ...data,
            sections: { ...data.sections, skills: { ...data.sections.skills, groups: newGroups } },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const updateExperience = (index: number, field: keyof Experience, value: string | string[] | null) => {
        const newExp = [...data.sections.experience];
        newExp[index] = { ...newExp[index], [field]: value };
        onChange({
            ...data,
            sections: { ...data.sections, experience: newExp },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
        const newExp = [...data.sections.experience];
        const newBullets = [...newExp[expIndex].bullets];
        newBullets[bulletIndex] = value;
        newExp[expIndex] = { ...newExp[expIndex], bullets: newBullets };
        onChange({
            ...data,
            sections: { ...data.sections, experience: newExp },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const addBullet = (expIndex: number) => {
        const newExp = [...data.sections.experience];
        newExp[expIndex] = { ...newExp[expIndex], bullets: [...newExp[expIndex].bullets, ''] };
        onChange({
            ...data,
            sections: { ...data.sections, experience: newExp },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const removeBullet = (expIndex: number, bulletIndex: number) => {
        const newExp = [...data.sections.experience];
        newExp[expIndex] = {
            ...newExp[expIndex],
            bullets: newExp[expIndex].bullets.filter((_, i) => i !== bulletIndex),
        };
        onChange({
            ...data,
            sections: { ...data.sections, experience: newExp },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const addExperience = () => {
        const newExp: Experience = {
            company: 'New Company',
            location: 'Location',
            title: 'Title',
            start: 'Jan 2024',
            end: null,
            bullets: [''],
            tech: [],
        };
        onChange({
            ...data,
            sections: { ...data.sections, experience: [...data.sections.experience, newExp] },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
        // Auto-expand experience section
        setExpandedSections((prev) => ({ ...prev, experience: true }));
    };

    const removeExperience = (index: number) => {
        const newExp = data.sections.experience.filter((_, i) => i !== index);
        onChange({
            ...data,
            sections: { ...data.sections, experience: newExp },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
        const newProjects = [...data.sections.projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        onChange({
            ...data,
            sections: { ...data.sections, projects: newProjects },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const updateProjectBullet = (projIndex: number, bulletIndex: number, value: string) => {
        const newProjects = [...data.sections.projects];
        const newBullets = [...newProjects[projIndex].bullets];
        newBullets[bulletIndex] = value;
        newProjects[projIndex] = { ...newProjects[projIndex], bullets: newBullets };
        onChange({
            ...data,
            sections: { ...data.sections, projects: newProjects },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const addProjectBullet = (projIndex: number) => {
        const newProjects = [...data.sections.projects];
        newProjects[projIndex] = { ...newProjects[projIndex], bullets: [...newProjects[projIndex].bullets, ''] };
        onChange({
            ...data,
            sections: { ...data.sections, projects: newProjects },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const removeProjectBullet = (projIndex: number, bulletIndex: number) => {
        const newProjects = [...data.sections.projects];
        newProjects[projIndex] = {
            ...newProjects[projIndex],
            bullets: newProjects[projIndex].bullets.filter((_, i) => i !== bulletIndex),
        };
        onChange({
            ...data,
            sections: { ...data.sections, projects: newProjects },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const addProject = () => {
        const newProject: Project = { name: 'New Project', link: '', bullets: [''] };
        onChange({
            ...data,
            sections: { ...data.sections, projects: [...data.sections.projects, newProject] },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
        // Auto-expand projects section
        setExpandedSections((prev) => ({ ...prev, projects: true }));
    };

    const removeProject = (index: number) => {
        const newProjects = data.sections.projects.filter((_, i) => i !== index);
        onChange({
            ...data,
            sections: { ...data.sections, projects: newProjects },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const updateEducation = (index: number, field: keyof Education, value: string) => {
        const newEdu = [...data.sections.education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        onChange({
            ...data,
            sections: { ...data.sections, education: newEdu },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const updateSummary = (field: 'content' | 'heading' | 'visible', value: any) => {
        onChange({
            ...data,
            sections: {
                ...data.sections,
                summary: {
                    visible: true,
                    content: '',
                    ...data.sections.summary,
                    [field]: value
                }
            },
            profileMeta: { ...data.profileMeta, updatedAt: new Date().toISOString() },
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteConfirm) return;
        if (deleteConfirm.type === 'experience') {
            removeExperience(deleteConfirm.index);
        } else if (deleteConfirm.type === 'project') {
            removeProject(deleteConfirm.index);
        }
        setDeleteConfirm(null);
    };

    // Generate summaries for collapsed sections
    const getSummaries = () => ({
        basics: data.basics.name || 'No name set',
        summary: data.sections.summary?.heading || 'No summary set',
        skills: data.sections.skills.groups.map((g) => g.label).join(', ') || 'No skills added',
        experience: data.sections.experience.map((e) => `${e.title} @ ${e.company}`).slice(0, 2).join(', ') + (data.sections.experience.length > 2 ? '...' : '') || 'No experience added',
        projects: data.sections.projects.map((p) => p.name).slice(0, 3).join(', ') + (data.sections.projects.length > 3 ? '...' : '') || 'No projects added',
        education: data.sections.education.map((e) => e.school).join(', ') || 'No education added',
    });

    const summaries = getSummaries();

    return (
        <>
            <div className="h-full flex flex-col bg-gray-900 text-gray-100">
                {/* P1-1: Sticky Section Navigation */}
                <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 px-2 py-2">
                    <div className="flex gap-1">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${activeSection === section.id
                                    ? 'bg-gray-800 text-blue-400 border-gray-700/80 shadow-sm'
                                    : 'bg-transparent text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/40'
                                    }`}
                            >
                                <span>{SectionIcons[section.icon as keyof typeof SectionIcons]}</span>
                                <span>{section.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Contact Section */}
                    <AccordionSection
                        id="basics"
                        title="Contact Info"
                        icon="contact"
                        summary={summaries.basics}
                        isExpanded={expandedSections.basics}
                        onToggle={() => toggleSection('basics')}
                    >
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input
                                    id="input-basics-name"
                                    type="text"
                                    value={data.basics.name}
                                    onChange={(e) => updateBasics('name', e.target.value)}
                                    onFocus={() => onSectionFocus?.('contact')}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                                    <input
                                        id="input-basics-email"
                                        type="email"
                                        value={data.basics.email}
                                        onChange={(e) => updateBasics('email', e.target.value)}
                                        onFocus={() => onSectionFocus?.('contact')}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                                    <input
                                        id="input-basics-phone"
                                        type="text"
                                        value={data.basics.phone}
                                        onChange={(e) => updateBasics('phone', e.target.value)}
                                        onFocus={() => onSectionFocus?.('contact')}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            {data.basics.links.map((link, idx) => (
                                <div key={idx} className="grid grid-cols-3 gap-2">
                                    <input
                                        id={`input-basics-links-${idx}-label`}
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => updateLink(idx, 'label', e.target.value)}
                                        onFocus={() => onSectionFocus?.('contact')}
                                        placeholder="Label"
                                        className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                    <input
                                        id={`input-basics-links-${idx}-url`}
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => updateLink(idx, 'url', e.target.value)}
                                        onFocus={() => onSectionFocus?.('contact')}
                                        placeholder="URL"
                                        className="col-span-2 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </AccordionSection>

                    {/* Summary Section */}
                    <AccordionSection
                        id="summary"
                        title="Summary"
                        icon="summary"
                        summary={summaries.summary}
                        isExpanded={expandedSections.summary}
                        onToggle={() => toggleSection('summary')}
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={data.sections.summary?.visible ?? true}
                                        onChange={(e) => updateSummary('visible', e.target.checked)}
                                    />
                                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-2 text-sm text-gray-400">Include in resume</span>
                                </label>
                            </div>

                            {(data.sections.summary?.visible ?? true) && (
                                <>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Summary Content</label>
                                        <textarea
                                            value={data.sections.summary?.content || ''}
                                            onChange={(e) => updateSummary('content', e.target.value)}
                                            onFocus={() => onSectionFocus?.('summary')}
                                            placeholder="Write a brief professional summary..."
                                            rows={4}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Use **text** to bold words</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </AccordionSection>

                    {/* Skills Section */}
                    <AccordionSection
                        id="skills"
                        title="Skills"
                        icon="skills"
                        count={data.sections.skills.groups.length}
                        summary={summaries.skills}
                        isExpanded={expandedSections.skills}
                        onToggle={() => toggleSection('skills')}
                        onAdd={addSkillGroup}
                        addLabel="Add Group"
                    >
                        {data.sections.skills.groups.map((group, idx) => (
                            <div key={idx} className="group/card bg-gray-700/50 rounded p-3 relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        id={`input-skills-${idx}-label`}
                                        type="text"
                                        value={group.label}
                                        onChange={(e) => updateSkillGroup(idx, 'label', e.target.value)}
                                        onFocus={() => onSectionFocus?.('skills')}
                                        className="flex-1 bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                    <button
                                        onClick={() => removeSkillGroup(idx)}
                                        className="opacity-0 group-hover/card:opacity-100 transition-opacity text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10"
                                        title="Remove skill group"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <input
                                    id={`input-skills-${idx}-items`}
                                    type="text"
                                    value={group.items.join(', ')}
                                    onChange={(e) => updateSkillGroup(idx, 'items', e.target.value)}
                                    onFocus={() => onSectionFocus?.('skills')}
                                    placeholder="Skills (comma-separated)"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-300 placeholder-gray-600 transition-colors"
                                />
                            </div>
                        ))}
                        {data.sections.skills.groups.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No skill groups yet. Click "+ Add Group" to create one.</p>
                        )}
                    </AccordionSection>

                    {/* Experience Section */}
                    <AccordionSection
                        id="experience"
                        title="Experience"
                        icon="experience"
                        count={data.sections.experience.length}
                        summary={summaries.experience}
                        isExpanded={expandedSections.experience}
                        onToggle={() => toggleSection('experience')}
                        onAdd={addExperience}
                        addLabel="Add Job"
                    >
                        {data.sections.experience.map((exp, expIdx) => (
                            <div key={expIdx} className="group/exp bg-gray-800/40 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                                        {exp.title} @ {exp.company}
                                    </span>
                                    <button
                                        onClick={() => setDeleteConfirm({ type: 'experience', index: expIdx, name: `${exp.title} @ ${exp.company}` })}
                                        className="opacity-0 group-hover/exp:opacity-100 transition-opacity text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10"
                                        title="Remove experience"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input
                                        id={`input-experience-${expIdx}-title`}
                                        type="text"
                                        value={exp.title}
                                        onChange={(e) => updateExperience(expIdx, 'title', e.target.value)}
                                        onFocus={() => onSectionFocus?.('experience')}
                                        placeholder="Title"
                                        className="bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                    <input
                                        id={`input-experience-${expIdx}-company`}
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                                        onFocus={() => onSectionFocus?.('experience')}
                                        placeholder="Company"
                                        className="bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <input
                                        id={`input-experience-${expIdx}-location`}
                                        type="text"
                                        value={exp.location}
                                        onChange={(e) => updateExperience(expIdx, 'location', e.target.value)}
                                        placeholder="Location"
                                        className="bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                    <input
                                        id={`input-experience-${expIdx}-start`}
                                        type="text"
                                        value={exp.start}
                                        onChange={(e) => updateExperience(expIdx, 'start', e.target.value)}
                                        placeholder="Start"
                                        className="bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                    <input
                                        id={`input-experience-${expIdx}-end`}
                                        type="text"
                                        value={exp.end || ''}
                                        onChange={(e) => updateExperience(expIdx, 'end', e.target.value || null)}
                                        placeholder="End (or blank for Present)"
                                        className="bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        id={`input-experience-${expIdx}-description`}
                                        type="text"
                                        value={exp.description || ''}
                                        onChange={(e) => updateExperience(expIdx, 'description', e.target.value)}
                                        onFocus={() => onSectionFocus?.('experience')}
                                        placeholder="One-liner description (e.g., High-growth startup building AI platforms)"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bullets</span>
                                        <button
                                            onClick={() => addBullet(expIdx)}
                                            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            + Add Bullet
                                        </button>
                                    </div>
                                    {exp.bullets.map((bullet, bulletIdx) => (
                                        <div key={bulletIdx} className="group/bullet flex gap-2">
                                            <textarea
                                                id={`input-experience-${expIdx}-bullets-${bulletIdx}`}
                                                value={bullet}
                                                onChange={(e) => updateBullet(expIdx, bulletIdx, e.target.value)}
                                                onFocus={() => onSectionFocus?.('experience')}
                                                placeholder="Bullet point..."
                                                rows={2}
                                                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 resize-none text-gray-300 placeholder-gray-600 transition-colors"
                                            />
                                            <button
                                                onClick={() => removeBullet(expIdx, bulletIdx)}
                                                className="opacity-0 group-hover/bullet:opacity-100 transition-opacity text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 self-start"
                                                title="Remove bullet"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {data.sections.experience.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No experience yet. Click "+ Add Job" to add one.</p>
                        )}
                    </AccordionSection>

                    {/* Projects Section */}
                    <AccordionSection
                        id="projects"
                        title="Projects"
                        icon="projects"
                        count={data.sections.projects.length}
                        summary={summaries.projects}
                        isExpanded={expandedSections.projects}
                        onToggle={() => toggleSection('projects')}
                        onAdd={addProject}
                        addLabel="Add Project"
                    >
                        {data.sections.projects.map((proj, projIdx) => (
                            <div key={projIdx} className="group/proj bg-gray-800/40 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                                        {proj.name}
                                    </span>
                                    <button
                                        onClick={() => setDeleteConfirm({ type: 'project', index: projIdx, name: proj.name })}
                                        className="opacity-0 group-hover/proj:opacity-100 transition-opacity text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10"
                                        title="Remove project"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input
                                        id={`input-projects-${projIdx}-name`}
                                        type="text"
                                        value={proj.name}
                                        onChange={(e) => updateProject(projIdx, 'name', e.target.value)}
                                        onFocus={() => onSectionFocus?.('projects')}
                                        placeholder="Project Name"
                                        className="bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                    <input
                                        id={`input-projects-${projIdx}-link`}
                                        type="url"
                                        value={proj.link || ''}
                                        onChange={(e) => updateProject(projIdx, 'link', e.target.value)}
                                        onFocus={() => onSectionFocus?.('projects')}
                                        placeholder="GitHub Link"
                                        className="bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bullets</span>
                                        <button
                                            onClick={() => addProjectBullet(projIdx)}
                                            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            + Add Bullet
                                        </button>
                                    </div>
                                    {proj.bullets.map((bullet, bulletIdx) => (
                                        <div key={bulletIdx} className="group/pbullet flex gap-2">
                                            <textarea
                                                id={`input-projects-${projIdx}-bullets-${bulletIdx}`}
                                                value={bullet}
                                                onChange={(e) => updateProjectBullet(projIdx, bulletIdx, e.target.value)}
                                                onFocus={() => onSectionFocus?.('projects')}
                                                placeholder="Bullet point..."
                                                rows={2}
                                                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 resize-none text-gray-300 placeholder-gray-600 transition-colors"
                                            />
                                            <button
                                                onClick={() => removeProjectBullet(projIdx, bulletIdx)}
                                                className="opacity-0 group-hover/pbullet:opacity-100 transition-opacity text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 self-start"
                                                title="Remove bullet"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {data.sections.projects.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No projects yet. Click "+ Add Project" to add one.</p>
                        )}
                    </AccordionSection>

                    {/* Education Section */}
                    <AccordionSection
                        id="education"
                        title="Education"
                        icon="education"
                        count={data.sections.education.length}
                        summary={summaries.education}
                        isExpanded={expandedSections.education}
                        onToggle={() => toggleSection('education')}
                    >
                        {data.sections.education.map((edu, eduIdx) => (
                            <div key={eduIdx} className="bg-gray-800/40 rounded-lg p-3 border border-gray-800">
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        id={`input-education-${eduIdx}-school`}
                                        type="text"
                                        value={edu.school}
                                        onChange={(e) => updateEducation(eduIdx, 'school', e.target.value)}
                                        onFocus={() => onSectionFocus?.('education')}
                                        placeholder="School"
                                        className="bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                    <input
                                        id={`input-education-${eduIdx}-degree`}
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(eduIdx, 'degree', e.target.value)}
                                        onFocus={() => onSectionFocus?.('education')}
                                        placeholder="Degree"
                                        className="bg-gray-900/50 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-gray-200 placeholder-gray-600 transition-colors"
                                    />
                                </div>
                            </div>
                        ))}
                        {data.sections.education.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No education entries yet.</p>
                        )}
                    </AccordionSection>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm !== null}
                title={`Delete ${deleteConfirm?.type === 'experience' ? 'Experience' : 'Project'}`}
                message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirm(null)}
            />
        </>
    );
}
