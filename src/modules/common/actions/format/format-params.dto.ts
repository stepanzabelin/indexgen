import { Clirio, Param, Transform } from 'clirio';

export class FormatParamsDto {
  @Param('files')
  @Transform(Clirio.form.ARRAY)
  readonly files!: string[];
}
