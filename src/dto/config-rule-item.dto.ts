import Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class ConfigRuleItemDto {
  @JoiSchema(Joi.string().valid('re-export', 'common').optional())
  readonly format?: 're-export' | 'common';

  @JoiSchema(Joi.array().items(Joi.string()).optional())
  readonly include!: string[];

  @JoiSchema(Joi.array().items(Joi.string()).optional())
  readonly exclude?: string[];

  @JoiSchema(Joi.boolean().optional())
  readonly files?: boolean;

  @JoiSchema(Joi.boolean().optional())
  readonly folders?: boolean;
}
