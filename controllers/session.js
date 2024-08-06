import bcryptjs from "bcryptjs";
import Controller from "../util/controller";
import Db from "../db/query";

export default class SessionController extends Controller {
  constructor() {
    super("users");
  }

  post = [
    (req, res, next) => {
      const { name } = req.session.user;

      req.sql.conds = { name: "?" };
      req.sql.params = [name];

      next();
    },
    Db.select,
    (req, res, next) => {
      const sessionUser = req.session.user;
      const user = res.body;

      if (!bcryptjs.compareSync(req.query["passwd"], user["password"])) {
        sessionUser.err = true;

        return next();
      }

      req.session.regenerate((err) => {
        if (err) return next(err);

        this.initSession(req, res).user.id = user.id;

        delete res.body;

        next();
      });
    },
  ];

  getAuthState = [
    (req, res, next) => {
      const { err, name } = req.session.user;
      if (err) {
        res.body = "err";

        next("route");
      } else {
        req.sql.conds = { name: "?" };
        req.sql.params = [name];

        next();
      }
    },
    Db.select,
    (req, res, next) => {
      res.body = res.body ? "signIn" : "signUp";

      next();
    },
  ];

  put(req, res, next) {
    req.session.user.name = req.query["name"];

    next();
  }

  delete(req, res, next) {
    delete req.session.user;

    next();
  }
}
