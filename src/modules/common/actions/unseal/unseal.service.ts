import { injectable } from 'tsyringe';
import { lstat } from 'fs/promises';
import path from 'path';

import { IndexGenService, ResultService } from '../../../../services';
import { UnsealParamsDto } from './unseal-params.dto';

@injectable()
export class UnsealService {
  constructor(
    private readonly resultService: ResultService,
    private readonly indexGenService: IndexGenService,
  ) {}

  public async entry(params: UnsealParamsDto) {
    const dirPath = path.resolve(process.cwd(), params.path);

    const isDir = await lstat(dirPath)
      .then((stat) => stat.isDirectory())
      .catch(() => false);

    if (!isDir) {
      throw new Error(`dirPath is not dir`);
    }

    const indexgenParams = await this.indexGenService.safeRead(dirPath);

    await this.indexGenService.write(dirPath, {
      ...(indexgenParams ?? {}),
      sealed: false,
    });

    this.resultService.success(
      `Updated: ${this.indexGenService.toFilePath(dirPath)}`,
    );
  }
}
