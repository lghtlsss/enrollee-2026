import { directions, programs, reviews, universities } from '@/lib/mock-data';
import { computeChance, latestAdmission } from '@/utils/functions';
import type {
  Chance,
  Profile,
  RecommendationItem,
  RecommendationRequest,
  User,
} from '@/utils/types';
import { NextRequest, NextResponse } from 'next/server';

type StoredUser = User & { id: number; password: string };

type MockReview = {
  id: number;
  author: string;
  text: string;
  rating: number;
  tags: string[];
  created_at: string;
};

type StoredReview = MockReview & {
  user_id: number;
  uni_id: number;
};

const store = globalThis as unknown as {
  __mockUsers?: Map<string, StoredUser>;
  __mockProfiles?: Map<number, Profile>;
  __mockFavorites?: Map<number, Set<number>>;
  __mockReviews?: Map<number, StoredReview[]>;
  __mockNextReviewId?: number;
};

const users = (store.__mockUsers ??= new Map());
const profiles = (store.__mockProfiles ??= new Map());
const favorites = (store.__mockFavorites ??= new Map());
const mockReviews = (store.__mockReviews ??= new Map());

const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
const error = (status: number, detail: string) => json({ detail }, status);
const normalizeCity = (city: string) =>
  city.toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/-/g, ' ').trim().replace(/\s+/g, ' ');

const tokenFor = (userId: number) => `mock-token-${userId}`;

const userFromRequest = (request: NextRequest): StoredUser | null => {
  const auth = request.headers.get('authorization');
  const match = auth?.match(/^Bearer mock-token-(\d+)$/);

  if (!match) return null;

  const id = Number(match[1]);

  for (const user of users.values()) {
    if (user.id === id) return user;
  }

  return null;
};

const shortUniversity = (id: number) => {
  const university = universities.find(item => item.id === id);

  return university
    ? {
        id: university.id,
        name: university.name,
        city: university.city,
        rating: university.rating,
        has_dormitory: university.has_dormitory,
      }
    : null;
};

const publicReview = (review: StoredReview): MockReview => ({
  id: review.id,
  author: review.author,
  text: review.text,
  rating: review.rating,
  tags: review.tags,
  created_at: review.created_at,
});

const getReviews = (universityId: number): StoredReview[] => {
  const existing = mockReviews.get(universityId);

  if (existing) {
    return existing;
  }

  const seeded = (reviews[universityId] ?? []).map(review => ({
    ...review,
    uni_id: universityId,
    user_id: 0,
  }));

  mockReviews.set(universityId, seeded);

  return seeded;
};

const nextReviewId = () => {
  const current = store.__mockNextReviewId ?? 1000;
  store.__mockNextReviewId = current + 1;
  return current;
};

const programDetail = (id: number) => {
  const program = programs.find(p => p.id === id);

  if (!program) return null;

  const university = universities.find(u => u.id === program.university_id)!;

  return {
    id: program.id,
    name: program.name,
    description: program.description,
    university: {
      id: university.id,
      name: university.name,
      city: university.city,
    },
    direction: directions.find(d => d.id === program.direction_id)!,
    subjects: program.subjects.map((s, index) => ({
      id: index + 1,
      ...s,
    })),
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

    if (users.has(body.email)) {
      return error(400, 'Email already registered');
    }

    const user: StoredUser = {
      id: users.size + 1,
      ...body,
    };

    users.set(body.email, user);

    return json({
      name: user.name,
      surname: user.surname,
      email: user.email,
    });
  }

  if (root === 'auth' && second === 'login' && method === 'POST') {
    const form = await request.formData();
    const email = form.get('username')?.toString() ?? '';
    const password = form.get('password')?.toString() ?? '';

    const user = users.get(email);

    if (!user || user.password !== password) {
      return error(401, 'Invalid email or password');
    }

    return json({
      access_token: tokenFor(user.id),
      token_type: 'bearer',
    });
  }

  if (root === 'users' && second === 'me') {
    const user = userFromRequest(request);

    if (!user) {
      return error(401, 'Not authenticated');
    }

    return json({
      name: user.name,
      surname: user.surname,
      email: user.email,
    });
  }

  if (root === 'profile') {
    const user = userFromRequest(request);

    if (!user) {
      return error(401, 'Not authenticated');
    }

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

  if (root === 'directions') {
    return json(directions);
  }

  if (root === 'universities' && !second) {
    const skip = Number(params.get('skip') ?? 0);
    const limit = Number(params.get('limit') ?? 20);
    const city = params.get('city')?.toLowerCase();
    const search = params.get('search')?.toLowerCase();

    const filtered = universities.filter(
      university =>
        (!city || university.city.toLowerCase() === city) &&
        (!search || university.name.toLowerCase().includes(search)),
    );

    return json({
      total: filtered.length,
      items: filtered.slice(skip, skip + limit).map(university => shortUniversity(university.id)),
    });
  }

  if (root === 'universities' && second) {
    const university = universities.find(item => item.id === Number(second));

    if (!university) {
      return error(404, 'University not found');
    }

    if (third === 'vibe') {
      return university.vibe ? json(university.vibe) : error(404, 'Vibe data not set');
    }

    if (third === 'reviews') {
      return json(getReviews(university.id).map(publicReview));
    }

    return json(university);
  }

  if (root === 'reviews' && second && method === 'GET') {
    const universityId = Number(second);

    if (!Number.isInteger(universityId)) {
      return error(400, 'Invalid university id');
    }

    if (!shortUniversity(universityId)) {
      return error(404, 'University not found');
    }

    return json(getReviews(universityId).map(publicReview));
  }

  if (root === 'reviews' && second === 'create_review' && method === 'POST') {
    const user = userFromRequest(request);

    if (!user) {
      return error(401, 'Not authenticated');
    }

    const body = (await request.json()) as {
      uni_id: number;
      rating: number;
      text: string;
      tags: string[];
    };

    if (!Number.isInteger(body.uni_id)) {
      return error(400, 'Invalid university id');
    }

    if (!shortUniversity(body.uni_id)) {
      return error(404, 'University not found');
    }

    if (
      typeof body.rating !== 'number' ||
      !Number.isFinite(body.rating) ||
      body.rating < 1 ||
      body.rating > 5
    ) {
      return error(400, 'Rating must be between 1 and 5');
    }

    if (typeof body.text !== 'string' || !body.text.trim()) {
      return error(400, 'Review text is required');
    }

    if (body.text.length > 300) {
      return error(400, 'Review text must be 300 characters or less');
    }

    if (!Array.isArray(body.tags)) {
      return error(400, 'Tags must be an array');
    }

    const normalizedTags = [
      ...new Set(
        body.tags
          .filter(tag => typeof tag === 'string')
          .map(tag => tag.trim().replace(/^#/, ''))
          .filter(Boolean),
      ),
    ];

    const review: StoredReview = {
      id: nextReviewId(),
      user_id: user.id,
      uni_id: body.uni_id,
      author: `${user.name} ${user.surname}`,
      rating: body.rating,
      text: body.text.trim(),
      tags: normalizedTags,
      created_at: new Date().toISOString(),
    };

    const universityReviews = getReviews(body.uni_id);
    universityReviews.push(review);

    return json(publicReview(review), 201);
  }

  if (root === 'programs' && !second) {
    const universityId = params.get('university_id');
    const directionId = params.get('direction_id');

    const filtered = programs.filter(
      program =>
        (!universityId || program.university_id === Number(universityId)) &&
        (!directionId || program.direction_id === Number(directionId)),
    );

    return json({
      total: filtered.length,
      items: filtered.map(program => ({
        id: program.id,
        name: program.name,
        direction_id: program.direction_id,
      })),
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

      if (body.direction_id && program.direction_id !== body.direction_id) {
        continue;
      }

      if (body.city && normalizeCity(university.city) !== normalizeCity(body.city)) {
        continue;
      }
      if (body.needs_dormitory && !university.has_dormitory) {
        continue;
      }

      const record = latestAdmission(program.admission_records);

      if (!record) continue;
      if (body.budget_only && !record.budget_places) continue;

      const required = program.subjects
        .filter(subject => subject.is_required)
        .map(subject => subject.name);

      if (!required.every(name => name in body.scores)) {
        continue;
      }

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

    const order: Record<Chance, number> = {
      high: 0,
      medium: 1,
      low: 2,
      unknown: 3,
    };

    items.sort(
      (a, b) =>
        order[a.chance] - order[b.chance] ||
        b.user_total -
          (b.passing_score ?? b.user_total) -
          (a.user_total - (a.passing_score ?? a.user_total)),
    );

    return json({
      total: items.length,
      items,
    });
  }

  if (root === 'favorites') {
    const user = userFromRequest(request);

    if (!user) {
      return error(401, 'Not authenticated');
    }

    const set = favorites.get(user.id) ?? new Set<number>();

    favorites.set(user.id, set);

    if (second) {
      const id = Number(second);

      if (!shortUniversity(id)) {
        return error(404, 'University not found');
      }

      if (method === 'POST') set.add(id);
      if (method === 'DELETE') set.delete(id);
    }

    return json([...set].map(shortUniversity).filter(Boolean));
  }

  return error(404, 'Not Found');
}

type Ctx = {
  params: Promise<{
    path: string[];
  }>;
};

const run = async (request: NextRequest, ctx: Ctx) => handle(request, (await ctx.params).path);

export { run as DELETE, run as GET, run as PATCH, run as POST, run as PUT };
