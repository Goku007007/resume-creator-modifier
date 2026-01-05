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
            const result = mergePatch(resume, patch as Partial<ResumeJSON>);
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
