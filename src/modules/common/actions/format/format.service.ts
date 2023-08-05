import { injectable } from 'tsyringe';
import { lstat, readdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

import { IndexGenService, ResultService } from '../../../../services';
import { FormatParamsDto } from './format-params.dto';

@injectable()
export class FormatService {
  constructor(
    private readonly resultService: ResultService,
    private readonly indexGenService: IndexGenService,
  ) {}

  public async entry(params: FormatParamsDto) {
    const dirs = await glob(params.files, { ignore: 'node_modules/**' });

    for (const dir of dirs) {
      const dirPath = path.resolve(process.cwd(), dir);

      const isDir = await lstat(dirPath)
        .then((stat) => stat.isDirectory())
        .catch(() => false);

      if (!isDir) {
        continue;
      }

      const indexgenParams = await this.indexGenService.safeRead(dirPath);

      if (!indexgenParams || indexgenParams.sealed) {
        continue;
      }

      const files = await readdir(dirPath);

      const refs = [];

      for (const file of files) {
        if (file === 'index.ts') {
          continue;
        }

        const match = file.match(/^(.*?)\.ts$/);

        if (match) {
          refs.push(match[1]);
        }
      }

      const indexFilePath = path.join(dirPath, 'index.ts');

      if (refs.length) {
        let indexContents = '';

        for (const ref of refs) {
          indexContents += `export * from './${ref}';\n`;
        }

        await writeFile(indexFilePath, indexContents, 'utf8');
      } else {
        await unlink(indexFilePath).catch(() => null);
      }
    }
  }
}
