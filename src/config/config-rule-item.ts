import { ConfigRuleItemDto } from '../dto';

export const configRuleItem: ConfigRuleItemDto = {
  include: [],
  exportFormat: 'ts-re-export',
  exportPattern: ['**/*', '**/*/'],
  exportDirs: true,
  exportFiles: true,
};
