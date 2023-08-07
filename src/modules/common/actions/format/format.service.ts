import { injectable } from 'tsyringe';
import { lstat, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { configRuleItem } from '../../../../config';
import { ResultService, ConfigService } from '../../../../services';
import { FormatOptionsDto } from './format-options.dto';

@injectable()
export class FormatService {
  constructor(
    private readonly resultService: ResultService,
    private readonly configService: ConfigService,
  ) {}

  public async entry(options: FormatOptionsDto) {
    const config = await this.configService.get();
    const affectedDirSet = new Set();

    for (const partialRule of config.rules) {
      const rule = { ...configRuleItem, ...partialRule };

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

        const patterns = Array.isArray(rule.exportPattern)
          ? rule.exportPattern
          : [rule.exportPattern];

        const exports = await glob(patterns, {
          cwd: dirPath,
          ignore: rule.exportIgnore,
        });

        const refs = [];

        for (const name of exports) {
          const filepath = path.join(dir, name);

          const stats = await lstat(filepath);

          if (stats.isDirectory() && rule.exportDirs) {
            refs.push(name);
          }

          if (stats.isFile() && rule.exportFiles) {
            if (name === 'index.ts') {
              continue;
            }

            const match = name.match(/^(.*?)\.ts$/);

            if (match) {
              refs.push(match[1]);
            }
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

    this.resultService.success('done');
  }
}
