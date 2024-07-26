import express from "express";

export default class Router {
  targetRouter = express.Router();

  setMiddleware(method, path, cb) {
    this.targetRouter[method](path, cb);
  }

  constructor(controller) {
    return new Proxy(this.targetRouter, {
      get: (target, p, receiver) => {
        if (["post", "get", "put", "delete"].includes(p)) {
          return (path = "") => {
            this.setMiddleware(p, path, controller[p].bind(controller));

            return receiver;
          };
        }
        return Reflect.get(...arguments);
      },
    });
  }
}
