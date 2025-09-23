
export interface User {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  focusArea?: string | null;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ARCHIVED';
  category?: string | null;
  goals: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: AgentType;
}

export enum AgentType {
  TECHNICAL = 'TECHNICAL',
  BUSINESS = 'BUSINESS', 
  TREND = 'TREND',
  CREATIVE = 'CREATIVE',
  GENERAL = 'GENERAL'
}

// Make AgentType values available as a type
export type AgentTypeKey = keyof typeof AgentType;

export interface AgentPersonality {
  name: string;
  description: string;
  traits: string[];
  expertise: string[];
  greeting: string;
}

export interface Conversation {
  id: string;
  title?: string | null;
  agentType: AgentType;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Victory {
  id: string;
  title: string;
  description: string;
  type: 'MILESTONE_COMPLETED' | 'PROJECT_LAUNCHED' | 'TECHNICAL_BREAKTHROUGH' | 'BUSINESS_WIN' | 'LEARNING_ACHIEVEMENT' | 'COLLABORATION_SUCCESS';
  impact?: string | null;
  createdAt: Date;
}
