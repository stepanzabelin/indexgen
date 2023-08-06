import { injectable } from 'tsyringe';

import { ResultService, ConfigService } from '../../../../services';
import { DebugOptionsDto } from './debug-options.dto';
import { lstat } from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

@injectable()
export class DebugService {
  constructor(
    private readonly resultService: ResultService,
    private readonly configService: ConfigService,
  ) {}

  public async entry(options: DebugOptionsDto) {
    const config = await this.configService.get();
    const affectedDirSet = new Set();

    for (const rule of config.rules) {
      const dirs = await glob(rule.include, {
        ignore: rule.exclude,
      });

      for (const dir of dirs) {
        const dirPath = path.resolve(process.cwd(), dir);

        if (affectedDirSet.has(dirPath)) {
          continue;
        }

        const isDir = await lstat(dirPath)
          .then((stat) => stat.isDirectory())
          .catch(() => false);

        if (!isDir) {
          continue;
        }

        affectedDirSet.add(dirPath);
      }
    }

    const lines = [...affectedDirSet]
      .sort()
      .map((dirPath: any) => path.relative(process.cwd(), dirPath));

    this.resultService.success('Directories:');

    if (lines.length) {
      this.resultService.success(lines.join(`\n`));
    } else {
      this.resultService.warn('no one');
    }
  }
}
