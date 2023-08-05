import { Param } from 'clirio';

export class AddParamsDto {
  @Param('path')
  readonly path!: string;
}
