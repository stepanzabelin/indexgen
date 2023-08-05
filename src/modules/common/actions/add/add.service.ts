import { injectable } from 'tsyringe';
import { lstat } from 'fs/promises';
import path from 'path';

import { IndexGenService, ResultService } from '../../../../services';
import { AddParamsDto } from './add-params.dto';

@injectable()
export class AddService {
  constructor(
    private readonly resultService: ResultService,
    private readonly indexGenService: IndexGenService,
  ) {}

  public async entry(params: AddParamsDto) {
    const dirPath = path.resolve(process.cwd(), params.path);

    const isDir = await lstat(dirPath)
      .then((stat) => stat.isDirectory())
      .catch(() => false);

    if (!isDir) {
      throw new Error(`dirPath is not dir`);
    }

    const exists = await this.indexGenService.exists(dirPath);

    if (!exists) {
      await this.indexGenService.write(dirPath, {});
    }
  }
}
