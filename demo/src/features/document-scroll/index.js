import {AppRouter, RouterConfiguration} from "aurelia-router";

export function configure(config) {
  const router = config.container.get(AppRouter);
  const routerConfig = config.container.get(RouterConfiguration);
  routerConfig
    .map([{ settings: { title: "Flickr sortable with document scroll", icon: "src/features/document-scroll/flickr.svg" }, route: "flickr-sortable", moduleId: "features/document-scroll/flickr-sortable", name: "flickr-sortable", nav: true, title: "flickr-sortable" }])
    .exportToRouter(router);
}
