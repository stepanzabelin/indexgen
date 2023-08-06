import Joi from 'joi';
import { JoiSchema, getClassSchema } from 'joi-class-decorators';
import { ConfigRuleItemDto } from './config-rule-item.dto';

export class ConfigDto {
  @JoiSchema(
    Joi.array().items(getClassSchema(ConfigRuleItemDto)).min(1).required(),
  )
  readonly rules!: ConfigRuleItemDto[];
}
