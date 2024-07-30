import Controller from "../util/controller";

export default class SessionController extends Controller {
  constructor() {
    super("users");
  }

  post(req, res, next) {
    res.end();
  }

  get(req, res, next) {
    res.send("oh hi");
  }

  put(req, res, next) {
    res.end();
  }

  delete(req, res, next) {
    res.end();
  }
}
