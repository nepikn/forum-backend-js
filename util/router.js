import express from "express";
import Controller from "./controller";

export default class Router {
  /** @type {Controller} */
  controller;
  targetRouter = express.Router();

  useController() {
    this.targetRouter.use(this.controller.initSession);
  }

  setMiddleware(method, path, handlers) {
    this.targetRouter[method](
      path,
      handlers.length
        ? handlers
            .flat(Infinity)
            .map((handler) => handler.bind(this.controller))
        : (req, res, next) => this.controller[method](req, res, next)
    );
  }

  constructor(controller) {
    this.controller = controller;

    this.useController();

    return new Proxy(this.targetRouter, {
      get: (target, p, receiver) => {
        if (["post", "get", "put", "delete"].includes(p)) {
          return (path = "", ...handlers) => {
            this.setMiddleware(p, path, handlers);

            return receiver;
          };
        }
        return target[p];
        // return Reflect.get(...arguments);
      },
    });
  }
}
