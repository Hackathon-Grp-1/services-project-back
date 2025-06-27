import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity';

@Entity('automated_services')
export class AutomatedService extends TimestampEntity {
  @ApiProperty({ description: 'Name of the automated service' })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Description of the automated service' })
  @Column({ name: 'description', type: 'text' })
  description: string;

  @ApiProperty({ description: 'Category of the automated service' })
  @Column({ name: 'category', type: 'varchar', length: 100 })
  category: string;

  @ApiProperty({
    description: 'Provider information',
    example: {
      id: 'provider-123',
      name: 'OpenAI',
      avatar: 'https://example.com/avatar.png',
    },
  })
  @Column({ name: 'provider', type: 'json' })
  provider: {
    id: string;
    name: string;
    avatar?: string;
  };

  @ApiProperty({
    description: 'Pricing information',
    example: {
      type: 'per_request',
      amount: 0.01,
      currency: 'USD',
    },
  })
  @Column({ name: 'pricing', type: 'json' })
  pricing: {
    type: 'free' | 'per_request' | 'subscription';
    amount?: number;
    currency?: string;
  };

  @ApiProperty({
    description: 'Service configuration',
    example: {
      endpoint: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      headers: { Authorization: 'Bearer {{api_key}}' },
      bodyTemplate: '{"prompt": "{{input.text}}"}',
      responseMapping: { translation: '$.translation' },
    },
  })
  @Column({ name: 'configuration', type: 'json' })
  configuration: {
    endpoint: string;
    method: 'GET' | 'POST';
    headers?: Record<string, string>;
    bodyTemplate?: string;
    responseMapping: Record<string, string>;
  };

  @ApiProperty({
    description: 'Usage statistics',
    example: {
      totalRequests: 1000,
      averageRating: 4.5,
      isActive: true,
    },
  })
  @Column({ name: 'usage', type: 'json' })
  usage: {
    totalRequests: number;
    averageRating: number;
    isActive: boolean;
  };

  @ApiProperty({
    description: 'Additional metadata',
    example: {
      tags: ['translation', 'ai', 'nlp'],
      examples: [
        {
          input: { text: 'Hello world' },
          output: { translation: 'Bonjour le monde' },
          description: 'Basic translation example',
        },
      ],
    },
  })
  @Column({ name: 'metadata', type: 'json' })
  metadata: {
    tags: string[];
    examples: Array<{
      input: any;
      output: any;
      description: string;
    }>;
  };
}
