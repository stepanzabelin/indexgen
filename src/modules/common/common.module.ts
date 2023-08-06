import { ClirioHelper, Command, Helper, Module, Options } from 'clirio';
import { injectable } from 'tsyringe';
import { CommonHelpService } from './actions/common-help';
import { VersionHelpService } from './actions/version-help';
import { FormatService, FormatOptionsDto } from './actions/format';
import { AddService } from './actions/add';
import { RemoveService } from './actions/remove';
import { DebugOptionsDto, DebugService } from './actions/debug';

@Module()
@injectable()
export class CommonModule {
  constructor(
    private readonly commonHelpService: CommonHelpService,
    private readonly versionHelpService: VersionHelpService,
    private readonly formatService: FormatService,
    private readonly debugService: DebugService,
    private readonly addService: AddService,
    private readonly removeService: RemoveService,
  ) {}

  @Command('-h, --help', { hidden: true })
  public help(@Helper() helper: ClirioHelper) {
    this.commonHelpService.entry(helper);
  }

  @Command('-v, --version')
  public version() {
    this.versionHelpService.entry();
  }

  @Command('format', { description: 'Formatting' })
  public format(@Options() options: FormatOptionsDto) {
    this.formatService.entry(options);
  }

  // @Command('create rule')
  // public add(@Params() params: AddParamsDto) {
  //   this.addService.entry(params);
  // }

  // @Command('create rule')
  // public remove(@Params() params: RemoveParamsDto) {
  //   this.removeService.entry(params);
  // }

  @Command('debug')
  public enable(@Options() options: DebugOptionsDto) {
    this.debugService.entry(options);
  }
}
