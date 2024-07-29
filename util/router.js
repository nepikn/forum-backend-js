import express from "express";

export default class Router {
  targetRouter = express.Router();

  setMiddleware(method, path, controller) {
    this.targetRouter[method](path, async (req, res, next) => {
      try {
        res.send(await controller[method](req, res, next));
      } catch (error) {
        next(error);
      }
    });
  }

  constructor(controller) {
    return new Proxy(this.targetRouter, {
      get: (target, p, receiver) => {
        if (["post", "get", "put", "delete"].includes(p)) {
          return (path = "") => {
            this.setMiddleware(p, path, controller);

            return receiver;
          };
        }
        return Reflect.get(...arguments);
      },
    });
  }
}
