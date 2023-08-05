import { ClirioHelper, Command, Helper, Module, Params } from 'clirio';
import { injectable } from 'tsyringe';
import { CommonHelpService } from './actions/common-help';
import { VersionHelpService } from './actions/version-help';
import { FormatService, FormatParamsDto } from './actions/format';
import { AddService, AddParamsDto } from './actions/add';
import { RemoveService, RemoveParamsDto } from './actions/remove';
import { SealService, SealParamsDto } from './actions/seal';
import { UnsealService, UnsealParamsDto } from './actions/unseal';

@Module()
@injectable()
export class CommonModule {
  constructor(
    private readonly commonHelpService: CommonHelpService,
    private readonly versionHelpService: VersionHelpService,
    private readonly formatService: FormatService,
    private readonly sealService: SealService,
    private readonly addService: AddService,
    private readonly removeService: RemoveService,
    private readonly unsealService: UnsealService,
  ) {}

  @Command('-h, --help', { hidden: true })
  public help(@Helper() helper: ClirioHelper) {
    this.commonHelpService.entry(helper);
  }

  @Command('-v, --version')
  public version() {
    this.versionHelpService.entry();
  }

  @Command('format <...files>')
  public format(@Params() params: FormatParamsDto) {
    this.formatService.entry(params);
  }

  @Command('add <path>')
  public add(@Params() params: AddParamsDto) {
    this.addService.entry(params);
  }

  @Command('remove <path>')
  public remove(@Params() params: RemoveParamsDto) {
    this.removeService.entry(params);
  }

  @Command('seal <path>')
  public enable(@Params() params: SealParamsDto) {
    this.sealService.entry(params);
  }

  @Command('unseal <path>')
  public disable(@Params() params: UnsealParamsDto) {
    this.unsealService.entry(params);
  }
}
