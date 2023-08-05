import { injectable } from 'tsyringe';
import { lstat } from 'fs/promises';
import path from 'path';

import { IndexierService, ResultService } from '../../../../services';
import { AddParamsDto } from './add-params.dto';

@injectable()
export class AddService {
  constructor(
    private readonly resultService: ResultService,
    private readonly indexierService: IndexierService,
  ) {}

  public async entry(params: AddParamsDto) {
    const dirPath = path.resolve(process.cwd(), params.path);

    const isDir = await lstat(dirPath)
      .then((stat) => stat.isDirectory())
      .catch(() => false);

    if (!isDir) {
      throw new Error(`dirPath is not dir`);
    }

    const exists = await this.indexierService.exists(dirPath);

    if (!exists) {
      await this.indexierService.write(dirPath, {});
      this.resultService.success(
        `Added: ${this.indexierService.toFilePath(dirPath)}`,
      );
    } else {
      this.resultService.warn(
        `Exists: ${this.indexierService.toFilePath(dirPath)}`,
      );
    }
  }
}
