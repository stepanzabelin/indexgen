import { injectable } from 'tsyringe';
import { lstat } from 'fs/promises';
import path from 'path';

import { IndexierService, ResultService } from '../../../../services';
import { UnsealParamsDto } from './unseal-params.dto';

@injectable()
export class UnsealService {
  constructor(
    private readonly resultService: ResultService,
    private readonly indexierService: IndexierService,
  ) {}

  public async entry(params: UnsealParamsDto) {
    const dirPath = path.resolve(process.cwd(), params.path);

    const isDir = await lstat(dirPath)
      .then((stat) => stat.isDirectory())
      .catch(() => false);

    if (!isDir) {
      throw new Error(`dirPath is not dir`);
    }

    const indexierParams = await this.indexierService.safeRead(dirPath);

    await this.indexierService.write(dirPath, {
      ...(indexierParams ?? {}),
      sealed: false,
    });

    this.resultService.success(
      `Updated: ${this.indexierService.toFilePath(dirPath)}`,
    );
  }
}
