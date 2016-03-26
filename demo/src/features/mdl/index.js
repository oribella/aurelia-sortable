import {AppRouter, RouterConfiguration} from "aurelia-router";
import mdlIcon from "./logo.svg";
import "./mdl.css";

export function configure(config) {
  const router = config.container.get(AppRouter);
  const routerConfig = new RouterConfiguration();
  routerConfig
    .map([{
      settings: {
        title: "Material design lite",
        icon: mdlIcon,
        css: "feature-mdl"
      },
      route: "mdl",
      moduleId: "features/mdl/mdl",
      name: "mdl",
      nav: true,
      title: "mdl"
    }])
    .exportToRouter(router);
}
