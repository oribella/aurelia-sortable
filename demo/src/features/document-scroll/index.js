import {AppRouter, RouterConfiguration} from "aurelia-router";
import flickrIcon from "../../../flickr.svg";

export function configure(config) {
  const router = config.container.get(AppRouter);
  const routerConfig = new RouterConfiguration();
  routerConfig
    .map([{
      settings: {
        title: "Sortable with document scroll",
        icon: flickrIcon
      },
      route: "flickr-document-scroll",
      moduleId: "features/document-scroll/flickr-sortable",
      name: "flickr-document-scroll",
      nav: true,
      title: "flickr-document-scroll"
    }])
    .exportToRouter(router);
}
