import {AppRouter, RouterConfiguration} from "aurelia-router";
import flickrIcon from "../../../flickr.svg";

export function configure(config) {
  const router = config.container.get(AppRouter);
  const routerConfig = new RouterConfiguration();
  routerConfig
    .map([{
      settings: {
        title: "Sortable with element scroll",
        icon: flickrIcon
      },
      route: "flickr-sortable-scroll",
      moduleId: "features/sortable-scroll/flickr-sortable",
      name: "flickr-sortable-scroll",
      nav: true,
      title: "flickr-sortable-scroll"
    }])
    .exportToRouter(router);
}
