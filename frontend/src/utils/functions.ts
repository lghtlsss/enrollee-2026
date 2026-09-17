import type { AdmissionRecord, Chance, ProgramDetail, RecommendationRequest } from './types';

const MEDIUM_THRESHOLD = 10;
const LOW_THRESHOLD = 25;

export const computeChance = (userTotal: number, passingScore: number | null): Chance | null => {
  if (passingScore === null) return 'unknown';
  const diff = userTotal - passingScore;
  if (diff >= 0) return 'high';
  if (diff >= -MEDIUM_THRESHOLD) return 'medium';
  if (diff >= -LOW_THRESHOLD) return 'low';
  return null;
};

export const latestAdmission = (records: AdmissionRecord[]): AdmissionRecord | null =>
  records.length ? records.reduce((a, b) => (b.year > a.year ? b : a)) : null;

export type ProgramMatch = {
  program: ProgramDetail;
  admission: AdmissionRecord;
  userTotal: number | null;
  chance: Chance | null;
};

export const bestProgramMatch = (
  programs: ProgramDetail[],
  request: RecommendationRequest | null,
): ProgramMatch | null => {
  if (!programs.length) return null;

  const candidates = request?.direction_id
    ? programs.filter(p => p.direction.id === request.direction_id)
    : programs;
  const pool = candidates.length ? candidates : programs;

  const matches: ProgramMatch[] = pool
    .map(program => {
      const admission = latestAdmission(program.admission_records);
      if (!admission) return null;
      const required = program.subjects.filter(s => s.is_required).map(s => s.name);
      const known = request && required.every(name => name in request.scores);
      const userTotal = known
        ? required.reduce((sum, name) => sum + (request as RecommendationRequest).scores[name], 0)
        : null;
      const chance = userTotal === null ? null : computeChance(userTotal, admission.passing_score);
      return { program, admission, userTotal, chance };
    })
    .filter((m): m is ProgramMatch => m !== null);

  if (!matches.length) return null;

  const chanceOrder: Record<Chance, number> = { high: 0, medium: 1, low: 2, unknown: 3 };
  matches.sort((a, b) => {
    if (a.chance && b.chance) return chanceOrder[a.chance] - chanceOrder[b.chance];
    if (a.chance) return -1;
    if (b.chance) return 1;
    return (a.admission.passing_score ?? 999) - (b.admission.passing_score ?? 999);
  });
  return matches[0];
};

export const formatMoney = (value: number | null | undefined) =>
  value === null || value === undefined
    ? '—'
    : new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }).format(value);

export const formatRating = (value: number | null | undefined) =>
  value === null || value === undefined ? '—' : value.toFixed(1);

export const pluralize = (n: number, forms: [string, string, string]) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
};

export const requestToSearchParams = (req: RecommendationRequest) => {
  const params = new URLSearchParams();
  params.set('scores', JSON.stringify(req.scores));
  if (req.direction_id) params.set('direction_id', String(req.direction_id));
  if (req.city) params.set('city', req.city);
  if (req.budget_only) params.set('budget_only', '1');
  if (req.needs_dormitory) params.set('needs_dormitory', '1');
  return params;
};

export const searchParamsToRequest = (
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): RecommendationRequest | null => {
  const get = (key: string) => {
    if (params instanceof URLSearchParams) return params.get(key);
    const value = params[key];
    return Array.isArray(value) ? value[0] : (value ?? null);
  };
  const raw = get('scores');
  if (!raw) return null;
  try {
    const scores = JSON.parse(raw) as Record<string, number>;
    if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) return null;
    const direction = get('direction_id');
    return {
      scores,
      direction_id: direction ? Number(direction) : null,
      city: get('city') || null,
      budget_only: get('budget_only') === '1',
      needs_dormitory: get('needs_dormitory') === '1',
    };
  } catch {
    return null;
  }
};
