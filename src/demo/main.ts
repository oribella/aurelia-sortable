import 'fuse-box-aurelia-loader';
import 'aurelia-bootstrapper';
import { Aurelia } from 'aurelia-framework';

export async function configure(aurelia: Aurelia) {
  aurelia.use
         .standardConfiguration()
         .developmentLogging()
         .globalResources('sortable');
  aurelia.start().then(() => aurelia.setRoot('demo/app'));
}
