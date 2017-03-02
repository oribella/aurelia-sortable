import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import * as OA from 'oribella';
import * as AS from './auto-scroll';
import * as OP from './optional-parent';
import * as S from './sortable';
import * as U from './utils';

export function configure(config: FrameworkConfiguration) {
  config.globalResources(PLATFORM.moduleName('./sortable'));
}

export { OA, AS, OP, S, U };
