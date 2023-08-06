import { injectable } from 'tsyringe';
import path from 'path';
import { access, readFile } from 'fs/promises';
import { ConfigDto } from '../dto';
import { getTypeSchema } from 'joi-class-decorators';

@injectable()
export class ConfigService {
  public toFilePath() {
    return path.join(process.cwd(), '.indexier.config.json');
  }

  public async exists() {
    const exists = await access(this.toFilePath())
      .then(() => true)
      .catch(() => false);

    return exists;
  }

  public async read(): Promise<any> {
    const contents = await readFile(this.toFilePath(), 'utf8');
    return JSON.parse(contents);
  }

  public async get(): Promise<ConfigDto> {
    const exists = await this.exists();

    if (!exists) {
      throw new Error(
        'The Indexier config not found. Please take a look at the documentation. To create a config  Type "indexier config"',
      );
    }

    const raw = await this.read();

    const { error, value } = getTypeSchema(ConfigDto).validate(raw, {
      abortEarly: true,
      allowUnknown: false,
    });

    if (error) {
      throw new Error(`The Indexier config is wrong: ${error.message}`);
    }

    return value;
  }
}
