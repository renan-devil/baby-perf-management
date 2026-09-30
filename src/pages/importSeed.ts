import seed from '../../catalog/seed/constance.json';
import type { Locale } from '../domain/types';
import type { useData } from '../store/DataContext';

/**
 * Create Constance's profile (if needed) and import her Excel history
 * (catalog/seed/constance.json, produced by scripts/import_excel.py). Skills already
 * recorded are skipped, so importing twice is harmless.
 */
export function importSeed(data: ReturnType<typeof useData>) {
  return data.createWithHistory(
    {
      firstName: seed.child.firstName,
      birthDate: seed.child.birthDate,
      gestationalWeeks: seed.child.gestationalWeeks,
      homeLanguages: seed.child.homeLanguages as Locale[],
    },
    seed.observations.map((o) => ({ skillId: o.skillId, status: 'achieved' as const, observedOn: o.observedOn, approximate: true, note: o.note })),
  );
}

export const seedCount = seed.observations.length;
