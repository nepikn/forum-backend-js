import express from "express";

export default class Router {
  controller;
  expressRouter;
  constructor(controller) {
    this.controller = controller;
    this.expressRouter = express.Router();

    return new Proxy(this.expressRouter, {
      get: (target, p, receiver) => {
        if (["post", "get", "put", "delete"].includes(p)) {
          return this[p].bind(this);
        }
        return Reflect.get(...arguments);
      },
    });
  }

  setMiddleware(method, path = "") {
    this.expressRouter[method](path, this.controller[method]);
  }
}

for (const method of ["post", "get", "put", "delete"]) {
  Router.prototype[method] = function (path) {
    this.setMiddleware(method, path);

    return this;
  };
}
