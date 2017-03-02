import 'fuse-box-aurelia-loader';
import 'aurelia-bootstrapper';
import { Aurelia } from 'aurelia-framework';

export async function configure(aurelia: Aurelia) {
  aurelia.use
         .standardConfiguration()
         .developmentLogging();
  aurelia.start().then(() => aurelia.setRoot('demo/app'));
}
