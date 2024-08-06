import Db, { Sql } from "../db/query";

export default class Controller {
  table;
  // db;

  constructor(table) {
    this.table = table;
    // this.db = Db;
    // this.db = new Db(table);
  }

  initSession(req, res, next) {
    req.session.user ?? (req.session.user = {});

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
