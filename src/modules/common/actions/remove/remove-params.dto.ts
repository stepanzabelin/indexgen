import { Param } from 'clirio';

export class RemoveParamsDto {
  @Param('path')
  readonly path!: string;
}
