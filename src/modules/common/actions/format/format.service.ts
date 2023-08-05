import { injectable } from 'tsyringe';
import {
  lstat,
  access,
  readFile,
  readdir,
  writeFile,
  unlink,
} from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import toml from 'toml';

import { ResultService } from '../../../../services';
import { FormatParamsDto } from './format-params.dto';

@injectable()
export class FormatService {
  constructor(private readonly resultService: ResultService) {}

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

      const indexgenParams = await this.safeReadDirIngexgen(dirPath);

      if (!indexgenParams) {
        continue;
      }

      const files = await readdir(dirPath);
      const refs = [];

      for (const file of files) {
        const filepath = path.join(dirPath, file);

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

      console.log('dirPath', dirPath);
    }
  }

  public resolveIngexgen(dirPath: string) {
    return path.join(dirPath, '.indexgen');
  }

  public async existsDirIngexgen(dirPath: string) {
    const exists = await access(this.resolveIngexgen(dirPath))
      .then(() => true)
      .catch(() => false);

    return exists;
  }

  public async safeReadDirIngexgen(dirPath: string) {
    const exists = await this.existsDirIngexgen(dirPath);
    if (!exists) {
      return null;
    }

    const params = await this.readDirIngexgen(dirPath);

    return { sealed: false, format: 'default', ...params };
  }

  public async readDirIngexgen(dirPath: string) {
    const contents = await readFile(
      path.resolve(this.resolveIngexgen(dirPath)),
      'utf8',
    );

    return toml.parse(contents);
  }
}
