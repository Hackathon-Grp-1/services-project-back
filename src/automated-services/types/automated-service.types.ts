export interface AutomatedServiceProvider {
  id: string;
  name: string;
  avatar?: string;
}

export interface AutomatedServicePricing {
  type: 'free' | 'per_request' | 'subscription';
  amount?: number;
  currency?: string;
}

export interface AutomatedServiceConfiguration {
  endpoint: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  bodyTemplate?: string;
  responseMapping: Record<string, string>;
}

export interface AutomatedServiceUsage {
  totalRequests: number;
  averageRating: number;
  isActive: boolean;
}

export interface AutomatedServiceExample {
  input: any;
  output: any;
  description: string;
}

export interface AutomatedServiceMetadata {
  tags: string[];
  examples: AutomatedServiceExample[];
}

export interface CreateAutomatedServiceDto {
  name: string;
  description: string;
  category: string;
  provider: AutomatedServiceProvider;
  pricing: AutomatedServicePricing;
  configuration: AutomatedServiceConfiguration;
  usage?: AutomatedServiceUsage;
  metadata?: AutomatedServiceMetadata;
}

export interface UpdateAutomatedServiceDto extends Partial<CreateAutomatedServiceDto> {
  id: string;
}
