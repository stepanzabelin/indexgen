import { Param } from 'clirio';

export class DebugOptionsDto {
  @Param('path')
  readonly path!: string;
}
