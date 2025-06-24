import { ServiceType } from '../entities/service.entity';

export interface BaseServiceData {
  serviceType: ServiceType;
  hourlyRate: number;
  professionalDescription: string;
  skillsDescription: string;
  skills: string[];
  domain: string;
  shortProfessionalDescription: string;
  shortSkillsDescription: string;
  organizationId?: number;
  userId: number;
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
  domain: string;
  shortProfessionalDescription: string;
  shortSkillsDescription: string;
  aiModel?: string;
  aiVersion?: string;
  organizationId?: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
} 