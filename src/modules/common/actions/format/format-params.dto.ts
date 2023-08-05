import { Clirio, Param, Transform } from 'clirio';

export class FormatParamsDto {
  @Param('patterns', { description: 'Glob patterns' })
  @Transform(Clirio.form.ARRAY)
  readonly patterns!: string[];
}
