import { injectable } from 'tsyringe';
import path from 'path';
import * as toml from '@ltd/j-toml';
import { access, readFile, writeFile, unlink } from 'fs/promises';

@injectable()
export class IndexGenService {
  public toFilePath(dirPath: string) {
    return path.join(dirPath, '.indexgen');
  }

  public async exists(dirPath: string) {
    const exists = await access(this.toFilePath(dirPath))
      .then(() => true)
      .catch(() => false);

    return exists;
  }

  public async safeRead(dirPath: string): Promise<Record<string, any> | null> {
    const exists = await this.exists(dirPath);
    if (!exists) {
      return null;
    }

    const params = await this.read(dirPath);

    return { ...params };
  }

  public async read(dirPath: string) {
    const contents = await readFile(this.toFilePath(dirPath), 'utf8');

    return toml.parse(contents);
  }

  public async write(dirPath: string, params: any) {
    await writeFile(
      this.toFilePath(dirPath),
      toml.stringify(params, {
        newline: '\n',
      }),
      'utf8',
    );
  }

  public async remove(dirPath: string) {
    await unlink(this.toFilePath(dirPath));
  }
}
