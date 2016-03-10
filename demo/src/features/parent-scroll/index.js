import {AppRouter, RouterConfiguration} from "aurelia-router";

export function configure(config) {
  const router = config.container.get(AppRouter);
  const routerConfig = new RouterConfiguration();
  routerConfig
    .map([{
      settings: {
        title: "Sortable with parent scroll",
        icon: "src/features/flickr.svg"
      },
      route: "flickr-parent-scroll",
      moduleId: "features/parent-scroll/flickr-sortable",
      name: "flickr-parent-scroll",
      nav: true,
      title: "flickr-parent-scroll"
    }])
    .exportToRouter(router);
}
