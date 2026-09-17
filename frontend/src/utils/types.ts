export type Chance = 'high' | 'medium' | 'low' | 'unknown';

export type User = {
  name: string;
  surname: string;
  email: string;
};

export type Token = {
  access_token: string;
  token_type: string;
};

export type Direction = {
  id: number;
  name: string;
  description: string | null;
};

export type Vibe = {
  education: number | null;
  career: number | null;
  student_life: number | null;
  atmosphere: number | null;
  workload: number | null;
};

export type ProgramShort = {
  id: number;
  name: string;
  direction_id: number;
};

export type UniversityShort = {
  id: number;
  name: string;
  city: string;
  rating: number | null;
};

export type UniversityDetail = UniversityShort & {
  description: string | null;
  website: string | null;
  vibe: Vibe | null;
  programs: ProgramShort[];
};

export type Paginated<T> = {
  total: number;
  items: T[];
};

export type Subject = {
  id: number;
  name: string;
  is_required: boolean;
};

export type AdmissionRecord = {
  year: number;
  passing_score: number | null;
  budget_places: number | null;
  tuition_cost: number | null;
};

export type ProgramDetail = {
  id: number;
  name: string;
  description: string | null;
  university: { id: number; name: string; city: string };
  direction: Direction;
  subjects: Subject[];
  admission_records: AdmissionRecord[];
};

export type Review = {
  id: number;
  author: string;
  text: string;
  rating: number;
  tags: string[];
  created_at: string;
};

export type RecommendationRequest = {
  scores: Record<string, number>;
  direction_id?: number | null;
  city?: string | null;
  budget_only: boolean;
};

export type RecommendationItem = {
  university_id: number;
  university_name: string;
  program_id: number;
  program_name: string;
  user_total: number;
  passing_score: number | null;
  budget_places: number | null;
  tuition_cost: number | null;
  chance: Chance;
};

export type Profile = {
  scores: Record<string, number>;
  direction_id: number | null;
  city: string | null;
  budget_only: boolean;
  education_form: 'fullTime' | 'partTime' | 'extramural' | null;
};

export type ApiError = {
  status: number;
  detail: string;
};
