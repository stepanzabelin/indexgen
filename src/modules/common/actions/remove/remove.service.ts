import { injectable } from 'tsyringe';
import { lstat } from 'fs/promises';
import path from 'path';

import { IndexierService, ResultService } from '../../../../services';
import { RemoveParamsDto } from './remove-params.dto';

@injectable()
export class RemoveService {
  constructor(
    private readonly resultService: ResultService,
    private readonly indexierService: IndexierService,
  ) {}

  public async entry(params: RemoveParamsDto) {
    const dirPath = path.resolve(process.cwd(), params.path);

    const isDir = await lstat(dirPath)
      .then((stat) => stat.isDirectory())
      .catch(() => false);

    if (!isDir) {
      throw new Error(`dirPath is not dir`);
    }

    const exists = await this.indexierService.exists(dirPath);

    if (exists) {
      await this.indexierService.remove(dirPath);
      this.resultService.success('Removed');
    } else {
      this.resultService.warn('does not exist');
    }
  }
}
