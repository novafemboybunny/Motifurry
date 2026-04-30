export interface Character {
  id: string;
  name: string;
  ears: 'cat' | 'fox' | 'wolf' | 'bunny' | 'none';
  tail: 'cat' | 'fox' | 'wolf' | 'bunny' | 'none';
  color: string;
  imageUrl?: string;
  accessories: string[];
}

export interface Milestone {
  id: string;
  name: string;
  daysRequired: number;
  reward: Reward;
  completed: boolean;
  completedAt?: Date;
}

export interface Reward {
  id: string;
  name: string;
  type: 'ears' | 'tail' | 'outfit' | 'bottle' | 'pacifier' | 'body_type';
  description: string;
  imageUrl?: string;
}

export interface SobrietyData {
  startDate: Date;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
