import Ajv from 'ajv';
import { ResumeJSON } from '@/types/resume';

const ajv = new Ajv({ allErrors: true });

// JSON Schema for resume validation
const resumeSchema = {
    type: 'object',
    required: ['profileMeta', 'basics', 'sections', 'rendering'],
    properties: {
        profileMeta: {
            type: 'object',
            required: ['profileName', 'resumeName', 'updatedAt'],
            properties: {
                profileName: { type: 'string', minLength: 1 },
                resumeName: { type: 'string', minLength: 1 },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
        basics: {
            type: 'object',
            required: ['name', 'email', 'phone', 'links'],
            properties: {
                name: { type: 'string', minLength: 1 },
                email: { type: 'string', format: 'email' },
                phone: { type: 'string' },
                links: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['label', 'url'],
                        properties: {
                            label: { type: 'string', minLength: 1 },
                            url: { type: 'string' },
                        },
                    },
                },
                locationLine: { type: 'string' },
            },
        },
        sections: {
            type: 'object',
            required: ['skills', 'experience', 'projects', 'education'],
            properties: {
                skills: {
                    type: 'object',
                    required: ['heading', 'groups'],
                    properties: {
                        heading: { type: 'string' },
                        groups: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['label', 'items'],
                                properties: {
                                    label: { type: 'string', minLength: 1 },
                                    items: { type: 'array', items: { type: 'string' } },
                                },
                            },
                        },
                    },
                },
                experience: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['company', 'location', 'title', 'start', 'bullets'],
                        properties: {
                            company: { type: 'string', minLength: 1 },
                            location: { type: 'string' },
                            title: { type: 'string', minLength: 1 },
                            start: { type: 'string' },
                            end: { type: ['string', 'null'] },
                            bullets: { type: 'array', items: { type: 'string' } },
                            tech: { type: 'array', items: { type: 'string' } },
                        },
                    },
                },
                projects: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['name', 'bullets'],
                        properties: {
                            name: { type: 'string', minLength: 1 },
                            link: { type: 'string' },
                            bullets: { type: 'array', items: { type: 'string' } },
                        },
                    },
                },
                education: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['school', 'degree'],
                        properties: {
                            school: { type: 'string', minLength: 1 },
                            degree: { type: 'string', minLength: 1 },
                            dates: { type: 'string' },
                        },
                    },
                },
            },
        },
        rendering: {
            type: 'object',
            required: ['fontFamily', 'monoFontFamily', 'pageSize', 'density'],
            properties: {
                fontFamily: { type: 'string' },
                monoFontFamily: { type: 'string' },
                pageSize: { type: 'string', enum: ['LETTER', 'A4'] },
                density: { type: 'string', enum: ['COMPACT', 'NORMAL', 'SPACIOUS'] },
                sectionOrder: {
                    type: 'array',
                    items: { type: 'string', enum: ['skills', 'experience', 'projects', 'education', 'languages'] },
                },
            },
        },
    },
};

const validate = ajv.compile(resumeSchema);

export function validateResume(data: unknown): { valid: boolean; errors: string[] } {
    const valid = validate(data);
    if (valid) {
        return { valid: true, errors: [] };
    }

    const errors = (validate.errors || []).map((err) => {
        const path = err.instancePath || '/';
        return `${path}: ${err.message}`;
    });

    return { valid: false, errors };
}

export { resumeSchema };
