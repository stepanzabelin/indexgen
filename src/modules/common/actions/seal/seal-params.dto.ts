import { Param } from 'clirio';

export class SealParamsDto {
  @Param('path')
  readonly path!: string;
}
