import db from "../db/models/index.cjs";
import Db, { Sql } from "../db/query";

export default class Controller {
  model;
  table;
  // db;

  constructor(table, model = "") {
    this.model = model && db[model];
    this.table = table;
    // this.db = Db;
    // this.db = new Db(table);
    // return new Proxy(this, {
    //   get(target, p, receiver) {
    //     if (p == "table") return target[p];

    //     console.log(target[p]);
    //     return function handleControllerErr(req, res, next) {
    //       try {
    //         target[p](req, res, next);
    //       } catch (error) {
    //         next(error);
    //       }
    //     };
    //   },
    // });
  }

  async verifyUser(req, res) {
    let row;
    try {
      row = await this.model.findByPk(req.params.id, { include: db.User });
    } catch (error) {
      throw error;
    }

    if (!row || row.User.id != req.session.user.id) {
      res.sendStatus(400);

      return;
    }

    return row;
  }

  initSession(req, res, next) {
    req.session.user ?? (req.session.user = { id: 3 });

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
