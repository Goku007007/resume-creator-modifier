import { ResumeJSON } from '@/types/resume';

export interface LintRule {
    id: string;
    name: string;
    severity: 'error' | 'warning' | 'info';
    check: (resume: ResumeJSON) => LintResult | null;
}

export interface LintResult {
    ruleId: string;
    ruleName: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    path?: string;
}

// Fluff words to avoid
const FLUFF_WORDS = [
    'hardworking',
    'passionate',
    'dedicated',
    'motivated',
    'enthusiastic',
    'self-starter',
    'team player',
    'detail-oriented',
    'proactive',
    'synergy',
    'leverage',
    'dynamic',
    'innovative',
    'best-of-breed',
    'cutting-edge',
    'world-class',
    'guru',
    'ninja',
    'rockstar',
];

// First-person pronouns
const FIRST_PERSON = ['\\bi\\b', '\\bme\\b', '\\bmy\\b', '\\bmine\\b', '\\bmyself\\b', '\\bwe\\b', '\\bour\\b', '\\bus\\b'];

// Action verbs that should start bullets
const ACTION_VERBS = [
    'achieved', 'administered', 'analyzed', 'architected', 'automated',
    'built', 'collaborated', 'configured', 'created', 'decreased', 'delivered',
    'deployed', 'designed', 'developed', 'drove', 'eliminated', 'enabled',
    'engineered', 'established', 'executed', 'expanded', 'generated',
    'identified', 'implemented', 'improved', 'increased', 'initiated',
    'integrated', 'launched', 'led', 'maintained', 'managed', 'migrated',
    'modeled', 'optimized', 'orchestrated', 'owned', 'partnered', 'pioneered',
    'planned', 'processed', 'programmed', 'reduced', 'refactored', 'resolved',
    'scaled', 'spearheaded', 'streamlined', 'transformed', 'unified', 'upgraded',
];

// Hard rules
const hardRules: LintRule[] = [
    {
        id: 'no-first-person',
        name: 'No First-Person Pronouns',
        severity: 'error',
        check: (resume) => {
            const allBullets = [
                ...resume.sections.experience.flatMap((e) => e.bullets),
                ...resume.sections.projects.flatMap((p) => p.bullets),
            ];
            for (const bullet of allBullets) {
                for (const pronoun of FIRST_PERSON) {
                    const regex = new RegExp(pronoun, 'i');
                    if (regex.test(bullet)) {
                        return {
                            ruleId: 'no-first-person',
                            ruleName: 'No First-Person Pronouns',
                            severity: 'error',
                            message: `Found first-person pronoun in: "${bullet.substring(0, 50)}..."`,
                        };
                    }
                }
            }
            return null;
        },
    },
    {
        id: 'no-fluff',
        name: 'No Fluff Adjectives',
        severity: 'error',
        check: (resume) => {
            const allText = [
                ...resume.sections.experience.flatMap((e) => e.bullets),
                ...resume.sections.projects.flatMap((p) => p.bullets),
            ].join(' ').toLowerCase();

            for (const word of FLUFF_WORDS) {
                if (allText.includes(word)) {
                    return {
                        ruleId: 'no-fluff',
                        ruleName: 'No Fluff Adjectives',
                        severity: 'error',
                        message: `Found fluff word: "${word}"`,
                    };
                }
            }
            return null;
        },
    },
    {
        id: 'bullet-length',
        name: 'Bullet Length Check',
        severity: 'warning',
        check: (resume) => {
            const issues: string[] = [];
            for (const exp of resume.sections.experience) {
                for (const bullet of exp.bullets) {
                    // Rough estimate: >200 chars is likely >3 lines
                    if (bullet.length > 300) {
                        issues.push(`Experience bullet too long (${bullet.length} chars): "${bullet.substring(0, 40)}..."`);
                    }
                }
            }
            if (issues.length > 0) {
                return {
                    ruleId: 'bullet-length',
                    ruleName: 'Bullet Length Check',
                    severity: 'warning',
                    message: issues[0],
                };
            }
            return null;
        },
    },
    {
        id: 'action-verb-start',
        name: 'Bullets Start with Action Verb',
        severity: 'warning',
        check: (resume) => {
            const allBullets = [
                ...resume.sections.experience.flatMap((e) => e.bullets),
                ...resume.sections.projects.flatMap((p) => p.bullets),
            ];

            for (const bullet of allBullets) {
                if (!bullet.trim()) continue;
                const firstWord = bullet.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
                const hasActionVerb = ACTION_VERBS.some((verb) => firstWord === verb || firstWord.startsWith(verb));
                if (!hasActionVerb && bullet.length > 10) {
                    return {
                        ruleId: 'action-verb-start',
                        ruleName: 'Bullets Start with Action Verb',
                        severity: 'warning',
                        message: `Bullet doesn't start with action verb: "${bullet.substring(0, 40)}..."`,
                    };
                }
            }
            return null;
        },
    },
    {
        id: 'duplicate-bullets',
        name: 'No Duplicate Bullets',
        severity: 'error',
        check: (resume) => {
            const allBullets = resume.sections.experience.flatMap((e) => e.bullets);
            const seen = new Set<string>();
            for (const bullet of allBullets) {
                const normalized = bullet.toLowerCase().trim();
                if (normalized && seen.has(normalized)) {
                    return {
                        ruleId: 'duplicate-bullets',
                        ruleName: 'No Duplicate Bullets',
                        severity: 'error',
                        message: `Duplicate bullet found: "${bullet.substring(0, 40)}..."`,
                    };
                }
                seen.add(normalized);
            }
            return null;
        },
    },
];

// Soft rules
const softRules: LintRule[] = [
    {
        id: 'numbers-preferred',
        name: 'Quantify Impact with Numbers',
        severity: 'info',
        check: (resume) => {
            let bulletsWithoutNumbers = 0;
            const totalBullets = resume.sections.experience.reduce((acc, e) => acc + e.bullets.length, 0);

            for (const exp of resume.sections.experience) {
                for (const bullet of exp.bullets) {
                    if (!/\d+/.test(bullet)) {
                        bulletsWithoutNumbers++;
                    }
                }
            }

            const ratio = bulletsWithoutNumbers / totalBullets;
            if (ratio > 0.5 && totalBullets > 4) {
                return {
                    ruleId: 'numbers-preferred',
                    ruleName: 'Quantify Impact with Numbers',
                    severity: 'info',
                    message: `${bulletsWithoutNumbers} of ${totalBullets} bullets lack quantifiable metrics`,
                };
            }
            return null;
        },
    },
    {
        id: 'punctuation-consistency',
        name: 'Consistent Punctuation',
        severity: 'info',
        check: (resume) => {
            const bullets = resume.sections.experience.flatMap((e) => e.bullets);
            let endsWithPeriod = 0;
            let endsWithoutPeriod = 0;

            for (const bullet of bullets) {
                const trimmed = bullet.trim();
                if (trimmed.endsWith('.')) {
                    endsWithPeriod++;
                } else if (trimmed.length > 0) {
                    endsWithoutPeriod++;
                }
            }

            if (endsWithPeriod > 0 && endsWithoutPeriod > 0) {
                return {
                    ruleId: 'punctuation-consistency',
                    ruleName: 'Consistent Punctuation',
                    severity: 'info',
                    message: `Inconsistent punctuation: ${endsWithPeriod} bullets end with period, ${endsWithoutPeriod} don't`,
                };
            }
            return null;
        },
    },
];

export function lintResume(resume: ResumeJSON): LintResult[] {
    const results: LintResult[] = [];

    for (const rule of [...hardRules, ...softRules]) {
        const result = rule.check(resume);
        if (result) {
            results.push(result);
        }
    }

    return results;
}

export function getScore(results: LintResult[]): number {
    let score = 100;
    for (const result of results) {
        if (result.severity === 'error') score -= 15;
        else if (result.severity === 'warning') score -= 5;
        else if (result.severity === 'info') score -= 2;
    }
    return Math.max(0, score);
}
