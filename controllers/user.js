import bcryptjs from "bcryptjs";
import Controller from "../util/controller";
import Db from "../db/query";

export default class UserController extends Controller {
  constructor() {
    super("users");
  }

  post = [
    (req, res, next) => {
      const sessionUserName = req.session.user.name;
      if (!sessionUserName) {
        throw new Error("no session username");
      }

      req.sql.cols = ["name", "password"];
      req.sql.params = [
        sessionUserName,
        bcryptjs.hashSync(req.query["passwd"]),
      ];

      next();
    },
    Db.insert,
    (req, res, next) => {
      req.session.user.id = res.body;

      next();
    },
  ];

  get = [
    (req, res, next) => {
      const sessionUser = req.session.user;

      res.prop = req.params.prop;

      if (!sessionUser.id) {
        res.body = sessionUser;

        return next("route");
      }

      req.sql.conds = { id: sessionUser.id };

      next();
    },
    Db.select,
  ];

  put(req, res, next) {
    res.end();
  }

  delete(req, res, next) {
    res.end();
  }
}
