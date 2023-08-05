import { ClirioHelper, Command, Helper, Module, Params } from 'clirio';
import { injectable } from 'tsyringe';
import { CommonHelpService } from './actions/common-help';
import { VersionHelpService } from './actions/version-help';
import { FormatService, FormatParamsDto } from './actions/format';
import { AddService, AddParamsDto } from './actions/add';

@Module()
@injectable()
export class CommonModule {
  constructor(
    private readonly commonHelpService: CommonHelpService,
    private readonly versionHelpService: VersionHelpService,
    private readonly formatService: FormatService,
    private readonly addService: AddService,
  ) {}

  @Command('-h, --help', { hidden: true })
  public help(@Helper() helper: ClirioHelper) {
    this.commonHelpService.entry(helper);
  }

  @Command('-v, --version')
  public version() {
    this.versionHelpService.entry();
  }

  @Command('add <path>')
  public add(@Params() params: AddParamsDto) {
    this.addService.entry(params);
  }

  @Command('remove <path>')
  public remove(@Params() params: FormatParamsDto) {
    this.formatService.entry(params);
  }

  @Command('seal <path>')
  public enable(@Params() params: FormatParamsDto) {
    this.formatService.entry(params);
  }

  @Command('unseal <path>')
  public disable(@Params() params: FormatParamsDto) {
    this.formatService.entry(params);
  }

  @Command('format <...files>')
  public format(@Params() params: FormatParamsDto) {
    this.formatService.entry(params);
  }
}
