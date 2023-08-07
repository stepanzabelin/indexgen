import Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class ConfigRuleItemDto {
  @JoiSchema(
    Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .required(),
  )
  readonly include!: string | string[];

  @JoiSchema(
    Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .optional(),
  )
  readonly exclude?: string | string[];

  @JoiSchema(Joi.string().valid('ts-re-export', 'js-common').optional())
  readonly exportFormat?: 'ts-re-export' | 'js-common';

  @JoiSchema(
    Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .optional(),
  )
  readonly exportPattern?: string | string[];

  @JoiSchema(
    Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .optional(),
  )
  readonly exportIgnore?: string | string[];

  @JoiSchema(Joi.boolean().optional())
  readonly exportDirs?: boolean;

  @JoiSchema(Joi.boolean().optional())
  readonly exportFiles?: boolean;
}
