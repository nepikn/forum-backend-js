import db from "../db/models/index.cjs";
import { Sql } from "../db/query";

export default class Controller {
  model;
  table;

  constructor(model) {
    this.model = db[model];
    // this.table = this.table;
  }

  async put(req, res, next) {
    const fields = req.fields;

    try {
      const row = await this.verifyUser(req, res);

      await row.update(req.query, { fields });

      await res.json(req.query[fields[0]]);
    } catch (err) {
      next(err);
    }
  }

  async verifyUser(req, res) {
    const sessionUserId = req.session.user.id;
    const row = await this.model.findByPk(req.params.id ?? sessionUserId);
    const rowUser = this.model.name == "User" ? row : await row.getUser();

    if (!row || rowUser.id != sessionUserId) {
      throw new Error("400");
    }

    return row;
  }

  initSession(req, res, next) {
    // req.session.user ??= { id: 3 };
    req.session.user ??= {};

    return next ? next() : req.session;
  }

  initSql = (req, res, next) => {
    req.sql = {
      table: this.table,
      base: "",
      toString() {
        return (this.base += Sql.where(this.conds));
      },
    };
    next();
  };
}
