export type University = {
  id: number;
  name: string;
  city: string;
  description: string;
  passingScore: number;
  freePlacesCount: number;
  educationCost: number;
  rating: number;
  vibeValue: number;
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
