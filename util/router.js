import express from "express";
import SessionController from "../controllers/session";

export default class Router {
  controller;
  targetRouter = express.Router();

  useController() {
    this.targetRouter.use(this.controller.populateSql);
    this.targetRouter.use(SessionController.init);
  }

  setMiddleware(method, path, handlers) {
    this.targetRouter[method](
      path,
      handlers.length ? handlers : this.controller[method]
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
