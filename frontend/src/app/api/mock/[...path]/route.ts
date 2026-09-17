import { directions, programs, reviews, universities } from '@/src/lib/mock-data';
import { computeChance, latestAdmission } from '@/src/utils/functions';
import type {
  Chance,
  Profile,
  RecommendationItem,
  RecommendationRequest,
  User,
} from '@/src/utils/types';
import { NextRequest, NextResponse } from 'next/server';

type StoredUser = User & { id: number; password: string };

const store = globalThis as unknown as {
  __mockUsers?: Map<string, StoredUser>;
  __mockProfiles?: Map<number, Profile>;
  __mockFavorites?: Map<number, Set<number>>;
};
const users = (store.__mockUsers ??= new Map());
const profiles = (store.__mockProfiles ??= new Map());
const favorites = (store.__mockFavorites ??= new Map());

const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
const error = (status: number, detail: string) => json({ detail }, status);

const tokenFor = (userId: number) => `mock-token-${userId}`;
const userFromRequest = (request: NextRequest): StoredUser | null => {
  const auth = request.headers.get('authorization');
  const match = auth?.match(/^Bearer mock-token-(\d+)$/);
  if (!match) return null;
  const id = Number(match[1]);
  for (const user of users.values()) if (user.id === id) return user;
  return null;
};

const shortUniversity = (id: number) => {
  const u = universities.find(item => item.id === id);
  return u ? { id: u.id, name: u.name, city: u.city, rating: u.rating } : null;
};

const programDetail = (id: number) => {
  const program = programs.find(p => p.id === id);
  if (!program) return null;
  const university = universities.find(u => u.id === program.university_id)!;
  return {
    id: program.id,
    name: program.name,
    description: program.description,
    university: { id: university.id, name: university.name, city: university.city },
    direction: directions.find(d => d.id === program.direction_id)!,
    subjects: program.subjects.map((s, index) => ({ id: index + 1, ...s })),
    admission_records: program.admission_records,
  };
};

async function handle(request: NextRequest, segments: string[]) {
  const [root, second, third] = segments;
  const method = request.method;
  const params = request.nextUrl.searchParams;

  if (root === 'auth' && second === 'register' && method === 'POST') {
    const body = (await request.json()) as {
      name: string;
      surname: string;
      email: string;
      password: string;
    };
    if (users.has(body.email)) return error(400, 'Email already registered');
    const user: StoredUser = { id: users.size + 1, ...body };
    users.set(body.email, user);
    return json({ name: user.name, surname: user.surname, email: user.email });
  }

  if (root === 'auth' && second === 'login' && method === 'POST') {
    const form = await request.formData();
    const email = form.get('username')?.toString() ?? '';
    const password = form.get('password')?.toString() ?? '';
    const user = users.get(email);
    if (!user || user.password !== password) return error(401, 'Invalid email or password');
    return json({ access_token: tokenFor(user.id), token_type: 'bearer' });
  }

  if (root === 'users' && second === 'me') {
    const user = userFromRequest(request);
    if (!user) return error(401, 'Not authenticated');
    return json({ name: user.name, surname: user.surname, email: user.email });
  }

  if (root === 'profile') {
    const user = userFromRequest(request);
    if (!user) return error(401, 'Not authenticated');
    if (method === 'PUT') {
      const body = (await request.json()) as Profile;
      profiles.set(user.id, body);
      return json(body);
    }
    return json(
      profiles.get(user.id) ?? {
        scores: {},
        direction_id: null,
        city: null,
        budget_only: false,
        education_form: null,
      },
    );
  }

  if (root === 'directions') return json(directions);

  if (root === 'universities' && !second) {
    const skip = Number(params.get('skip') ?? 0);
    const limit = Number(params.get('limit') ?? 20);
    const city = params.get('city')?.toLowerCase();
    const search = params.get('search')?.toLowerCase();
    const filtered = universities.filter(
      u =>
        (!city || u.city.toLowerCase() === city) &&
        (!search || u.name.toLowerCase().includes(search)),
    );
    return json({
      total: filtered.length,
      items: filtered.slice(skip, skip + limit).map(u => shortUniversity(u.id)),
    });
  }

  if (root === 'universities' && second) {
    const university = universities.find(u => u.id === Number(second));
    if (!university) return error(404, 'University not found');
    if (third === 'vibe')
      return university.vibe ? json(university.vibe) : error(404, 'Vibe data not set');
    if (third === 'reviews') return json(reviews[university.id] ?? []);
    return json(university);
  }

  if (root === 'programs' && !second) {
    const universityId = params.get('university_id');
    const directionId = params.get('direction_id');
    const filtered = programs.filter(
      p =>
        (!universityId || p.university_id === Number(universityId)) &&
        (!directionId || p.direction_id === Number(directionId)),
    );
    return json({
      total: filtered.length,
      items: filtered.map(p => ({ id: p.id, name: p.name, direction_id: p.direction_id })),
    });
  }

  if (root === 'programs' && second) {
    const detail = programDetail(Number(second));
    return detail ? json(detail) : error(404, 'Program not found');
  }

  if (root === 'subjects') {
    const names = [
      ...new Set(programs.flatMap(program => program.subjects.map(subject => subject.name))),
    ];

    return json(
      names.map((name, index) => ({
        id: index + 1,
        name,
      })),
    );
  }

  if (root === 'recommendations' && method === 'POST') {
    const body = (await request.json()) as RecommendationRequest;
    const items: RecommendationItem[] = [];
    for (const program of programs) {
      const university = universities.find(u => u.id === program.university_id)!;
      if (body.direction_id && program.direction_id !== body.direction_id) continue;
      if (body.city && university.city.toLowerCase() !== body.city.toLowerCase()) continue;
      const record = latestAdmission(program.admission_records);
      if (!record) continue;
      if (body.budget_only && !record.budget_places) continue;
      const required = program.subjects.filter(s => s.is_required).map(s => s.name);
      if (!required.every(name => name in body.scores)) continue;
      const userTotal = required.reduce((sum, name) => sum + body.scores[name], 0);
      const chance = computeChance(userTotal, record.passing_score);
      if (!chance) continue;
      items.push({
        university_id: university.id,
        university_name: university.name,
        program_id: program.id,
        program_name: program.name,
        user_total: userTotal,
        passing_score: record.passing_score,
        budget_places: record.budget_places,
        tuition_cost: record.tuition_cost,
        chance,
      });
    }
    const order: Record<Chance, number> = { high: 0, medium: 1, low: 2, unknown: 3 };
    items.sort(
      (a, b) =>
        order[a.chance] - order[b.chance] ||
        b.user_total -
          (b.passing_score ?? b.user_total) -
          (a.user_total - (a.passing_score ?? a.user_total)),
    );
    return json({ total: items.length, items });
  }

  if (root === 'favorites') {
    const user = userFromRequest(request);
    if (!user) return error(401, 'Not authenticated');
    const set = favorites.get(user.id) ?? new Set<number>();
    favorites.set(user.id, set);
    if (second) {
      const id = Number(second);
      if (!shortUniversity(id)) return error(404, 'University not found');
      if (method === 'POST') set.add(id);
      if (method === 'DELETE') set.delete(id);
    }
    return json([...set].map(shortUniversity));
  }

  return error(404, 'Not Found');
}

type Ctx = { params: Promise<{ path: string[] }> };
const run = async (request: NextRequest, ctx: Ctx) => handle(request, (await ctx.params).path);

export { run as DELETE, run as GET, run as PATCH, run as POST, run as PUT };
