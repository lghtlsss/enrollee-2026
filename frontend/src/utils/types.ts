export type University = {
  id: number;
  name: string;
  city: string;
  rating: number;
};

export type Vibe = {
  education: number;
  career: number;
  studentLife: number;
  atmosphere: number;
  workload: number;
};

export type Program = {
  id: number;
  name: string;
  directionId: number;
};

export type UniversityDetails = {
  id: number;
  name: string;
  city: string;
  description: string;
  rating: number;
  vibeValue: number;
  website: string;
};

export type ExamsScore = {
  russian?: number;
  math?: number;
  it?: number;
  physics?: number;
  society?: number;
  geography?: number;
  chemistry?: number;
};

export type User = {
  id: number;
  name: string;
  examsScore?: ExamsScore;
  direction?: string;
  city?: string;
  educationForm?: 'fullTime' | 'partTime' | 'extramural';
  isBudget?: boolean;
};

export type JWTPayload = {
  sub: string;
  exp: string;
};
