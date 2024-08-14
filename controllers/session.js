import bcryptjs from "bcryptjs";
import Controller from "../util/controller";

export default class SessionController extends Controller {
  constructor() {
    super("User");
  }

  async post(req, res, next) {
    const sessionUser = req.session.user;

    try {
      const user = await this.model.findOne({
        where: { name: sessionUser.name },
      });

      if (!bcryptjs.compareSync(req.query["passwd"], user.password)) {
        sessionUser.err = true;

        return res.end();
      }

      req.session.regenerate((err) => {
        if (err) throw err;

        this.initSession(req).user.id = user.id;

        res.end();
      });
    } catch (err) {
      next(err);
    }
  }

  async getAuthState(req, res, next) {
    const { err, name } = req.session.user;
    try {
      res.json(
        err
          ? "err"
          : (await this.model.findOne({ where: { name } }))
          ? "signIn"
          : "signUp"
      );
    } catch (err) {
      next(err);
    }
  }

  put(req, res, next) {
    const newName = req.query["name"];

    req.session.user.name = newName;

    res.json(newName);
  }

  delete(req, res, next) {
    delete req.session.user;

    res.end();
  }
}
