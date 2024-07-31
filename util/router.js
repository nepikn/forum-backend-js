import express from "express";

export default class Router {
  controller;
  targetRouter = express.Router();

  useController() {
    this.targetRouter.use(this.controller.populateSql);
  }

  setMiddleware(method, path, handlers) {
    this.targetRouter[method](
      path,
      handlers.length ? handlers : this.controller[method]
    );
  }
  // setMiddleware(method, path, controller) {
  //   this.targetRouter[method](path, async (req, res, next) => {
  //     try {
  //       res.send(await controller[method](req, res, next));
  //     } catch (error) {
  //       next(error);
  //     }
  //   });
  // }

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
