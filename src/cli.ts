#!/usr/bin/env node

import { Clirio } from 'clirio';
import { container } from 'tsyringe';
import { CommonPipe } from './pipes';
import { CommonFilter } from './filters';
import { CommonModule } from './modules/common/common.module';

export const bootstrap = async () => {
  const cli = new Clirio();
  cli.setModules([container.resolve(CommonModule)]);

  cli.setGlobalPipe(CommonPipe);
  cli.setGlobalFilter(container.resolve(CommonFilter));

  await cli.execute();
};

bootstrap();
