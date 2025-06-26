export enum ServiceType {
  HUMAN_PROVIDER = 'human_provider',
  AI_AGENT = 'ai_agent',
}

export interface BaseServiceData {
  serviceType: ServiceType;
  hourlyRate: number;
  professionalDescription: string;
  skillsDescription: string;
  skills: string[];
  domains: string[];
  shortProfessionalDescription: string;
  shortSkillsDescription: string;
  organizationId?: number;
  userId: number;
  localization: string;
}

export interface HumanProviderData extends BaseServiceData {
  serviceType: ServiceType.HUMAN_PROVIDER;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AIAgentData extends BaseServiceData {
  serviceType: ServiceType.AI_AGENT;
  aiAgentName: string;
  aiModel: string;
  aiVersion: string;
}

export type ServiceData = HumanProviderData | AIAgentData;

export interface ServiceResponse {
  id: number;
  serviceType: ServiceType;
  firstName?: string;
  lastName?: string;
  aiAgentName?: string;
  phone?: string;
  hourlyRate: number;
  professionalDescription: string;
  skillsDescription: string;
  skills: string[];
  domains: string[];
  localization: string;
  shortProfessionalDescription: string;
  shortSkillsDescription: string;
  aiModel?: string;
  aiVersion?: string;
  organizationId?: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
} 