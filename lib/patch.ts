import { applyPatch, Operation } from 'fast-json-patch';
import { ResumeJSON } from '@/types/resume';

// Deep merge for merge patch (RFC 7386)
export function mergePatch<T extends object>(target: T, patch: Partial<T>): T {
    const result = { ...target };

    for (const key in patch) {
        const patchValue = patch[key];

        if (patchValue === null) {
            // null means delete the key
            delete (result as Record<string, unknown>)[key];
        } else if (
            typeof patchValue === 'object' &&
            !Array.isArray(patchValue) &&
            patchValue !== null &&
            typeof result[key] === 'object' &&
            !Array.isArray(result[key]) &&
            result[key] !== null
        ) {
            // Recursively merge nested objects
            (result as Record<string, unknown>)[key] = mergePatch(
                result[key] as object,
                patchValue as object
            );
        } else {
            // Replace value
            (result as Record<string, unknown>)[key] = patchValue;
        }
    }

    return result;
}

// Apply RFC 6902 JSON Patch
export function applyJsonPatch<T>(document: T, operations: Operation[]): T {
    const result = applyPatch(JSON.parse(JSON.stringify(document)), operations, true, false);
    return result.newDocument as T;
}

// Validate JSON Patch operations
export function validatePatchOperations(operations: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(operations)) {
        return { valid: false, errors: ['Patch must be an array of operations'] };
    }

    const validOps = ['add', 'remove', 'replace', 'move', 'copy', 'test'];

    for (let i = 0; i < operations.length; i++) {
        const op = operations[i];

        if (typeof op !== 'object' || op === null) {
            errors.push(`Operation ${i}: must be an object`);
            continue;
        }

        const opObj = op as Record<string, unknown>;

        if (!opObj.op || typeof opObj.op !== 'string') {
            errors.push(`Operation ${i}: missing or invalid 'op' field`);
            continue;
        }

        if (!validOps.includes(opObj.op)) {
            errors.push(`Operation ${i}: invalid operation '${opObj.op}'`);
        }

        if (!opObj.path || typeof opObj.path !== 'string') {
            errors.push(`Operation ${i}: missing or invalid 'path' field`);
        }

        if (['add', 'replace', 'test'].includes(opObj.op as string) && opObj.value === undefined) {
            errors.push(`Operation ${i}: '${opObj.op}' requires a 'value' field`);
        }

        if (['move', 'copy'].includes(opObj.op as string) && (!opObj.from || typeof opObj.from !== 'string')) {
            errors.push(`Operation ${i}: '${opObj.op}' requires a 'from' field`);
        }
    }

    return { valid: errors.length === 0, errors };
}

// Transform simplified JSON to internal ResumeJSON schema
function transformSimplifiedResume(input: any): Partial<ResumeJSON> {
    const result: Partial<ResumeJSON> = {};

    // Map Basics
    if (input.contact) {
        result.basics = {
            name: input.name || '',
            email: input.contact.email || '',
            phone: input.contact.phone || '',
            locationLine: '',
            links: []
        };

        if (input.contact.website) {
            result.basics.links.push({ label: 'Portfolio', url: input.contact.website.startsWith('http') ? input.contact.website : `https://${input.contact.website}` });
        }
        if (input.contact.github) {
            result.basics.links.push({ label: 'GitHub', url: input.contact.github.startsWith('http') ? input.contact.github : `https://${input.contact.github}` });
        }
        if (input.contact.linkedin) {
            result.basics.links.push({ label: 'LinkedIn', url: input.contact.linkedin.startsWith('http') ? input.contact.linkedin : `https://${input.contact.linkedin}` });
        }
    }

    // Map Sections
    result.sections = {
        skills: { heading: 'Skills', groups: [] },
        experience: [],
        projects: [],
        education: []
    } as any;

    // Map Summary
    if (input.headline) {
        result.sections!.summary = {
            visible: true,
            content: input.headline
        };
    }

    // Map Skills
    if (input.skills) {
        if (Array.isArray(input.skills)) {
            result.sections!.skills.groups.push({ label: 'Skills', items: input.skills });
        } else {
            // Object format
            Object.keys(input.skills).forEach(key => {
                let label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // nice formatting
                if (key === 'languages_and_databases') label = 'Languages & Databases';
                if (key === 'backend_and_data') label = 'Backend & Data';
                if (key === 'cloud_and_devops') label = 'Cloud & DevOps';

                result.sections!.skills.groups.push({
                    label,
                    items: input.skills[key]
                });
            });
        }
    }

    // Map Experience
    if (Array.isArray(input.experience)) {
        result.sections!.experience = input.experience.map((exp: any) => ({
            company: exp.company || '',
            location: exp.location || '',
            title: exp.role || exp.title || '',
            start: exp.dates ? exp.dates.split('-')[0].trim() : '',
            end: exp.dates && exp.dates.includes('-') ? (exp.dates.split('-')[1].trim().toLowerCase() === 'present' ? null : exp.dates.split('-')[1].trim()) : null,
            description: exp.description,
            bullets: exp.highlights || exp.bullets || [],
            tech: []
        }));
    }

    // Map Projects
    if (Array.isArray(input.projects)) {
        result.sections!.projects = input.projects.map((proj: any) => ({
            name: proj.name || '',
            link: (proj.link === 'GitHub' || !proj.link) ? '' : proj.link, // If just "GitHub" without URL, leave empty or handle differently
            bullets: proj.description ? [proj.description] : (proj.highlights || [])
        }));
    }

    // Map Education
    if (Array.isArray(input.education)) {
        result.sections!.education = input.education.map((edu: any) => ({
            school: edu.institution || edu.school || '',
            degree: edu.degree || '',
            dates: edu.dates || ''
        }));
    }

    return result;
}

// Apply patch (either merge or JSON Patch) to resume
export function applyResumePatch(
    resume: ResumeJSON,
    patch: unknown,
    mode: 'merge' | 'patch'
): { success: boolean; result?: ResumeJSON; error?: string } {
    try {
        if (mode === 'merge') {
            if (typeof patch !== 'object' || patch === null || Array.isArray(patch)) {
                return { success: false, error: 'Merge patch must be an object' };
            }

            let finalPatch = patch as Partial<ResumeJSON>;

            // Check if this is the simplified format (has 'contact' field instead of 'basics' or inside root)
            // @ts-ignore
            if (patch.contact || patch.headline || (patch.experience && patch.experience[0]?.role)) {
                // Apply transformation
                finalPatch = transformSimplifiedResume(patch);
            }

            const result = mergePatch(resume, finalPatch);
            return { success: true, result };
        } else {
            const validation = validatePatchOperations(patch);
            if (!validation.valid) {
                return { success: false, error: validation.errors.join('; ') };
            }
            const result = applyJsonPatch(resume, patch as Operation[]);
            return { success: true, result };
        }
    } catch (e) {
        return { success: false, error: `Patch failed: ${(e as Error).message}` };
    }
}
