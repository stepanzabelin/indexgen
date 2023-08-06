import Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

enum FormatEnum {
  're-export' = 're-export',
  'common' = 'common',
}

export class ConfigRuleItemDto {
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(FormatEnum))
      .optional(),
  )
  readonly format?: FormatEnum;

  @JoiSchema(Joi.array().items(Joi.string()).optional())
  readonly include!: string[];

  @JoiSchema(Joi.array().items(Joi.string()).optional())
  readonly exclude?: string[];

  @JoiSchema(Joi.boolean().optional())
  readonly files?: boolean;

  @JoiSchema(Joi.boolean().optional())
  readonly folders?: boolean;
}