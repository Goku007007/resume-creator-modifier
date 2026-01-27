import type { SectionKey } from '@/types/resume';

export function defaultSectionOrder(format?: string, hasLanguages?: boolean): SectionKey[] {
  const isGerman = format?.startsWith('german');
  const base: SectionKey[] = ['skills', 'experience', 'projects', 'education'];
  if (isGerman && hasLanguages) {
    return [...base, 'languages'];
  }
  return base;
}

export function normalizeSectionOrder(
  order: string[] | undefined,
  format?: string,
  hasLanguages?: boolean
): SectionKey[] {
  const base = defaultSectionOrder(format, hasLanguages);
  const filtered = (order || []).filter((key) => base.includes(key as SectionKey)) as SectionKey[];
  const merged = Array.from(new Set([...filtered, ...base])) as SectionKey[];
  if (!hasLanguages) {
    return merged.filter((key) => key !== 'languages');
  }
  if (hasLanguages && !merged.includes('languages')) {
    merged.push('languages');
  }
  return merged;
}
