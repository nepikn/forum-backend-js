import bcryptjs from "bcryptjs";
import Controller from "../util/controller";

export default class UserController extends Controller {
  constructor() {
    super("User");
  }

  post(req, res, next) {
    const sessionUserName = req.session.user.name;

    this.model
      .create({
        name: sessionUserName,
        password: bcryptjs.hashSync(req.query["passwd"]),
      })
      .then((user) => {
        req.session.user.id = user.id;

        res.json(user.id);
      })
      .catch(next);
  }

  get(req, res, next) {
    const sessionUser = req.session.user;
    if (!sessionUser.id) {
      return res.json(sessionUser);
    }

    this.model
      .findByPk(sessionUser.id, { attributes: { exclude: ["password"] } })
      .then((user) => {
        res.json(user);
      })
      .catch(next);
  }

  put(req, res, next) {
    req.fields = ["name"];

    super.put(req, res, next);
  }

  delete(req, res, next) {
    res.end();
  }
}
