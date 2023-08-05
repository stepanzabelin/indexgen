import { Param } from 'clirio';

export class UnsealParamsDto {
  @Param('path')
  readonly path!: string;
}
