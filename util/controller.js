import Db from "./db";

export default class Controller {
  table;
  // db;

  constructor(table) {
    this.table = table;
    // this.db = Db;
    // this.db = new Db(table);
  }

  populateSql = (req, res, next) => {
    req.sql = {
      table: this.table,
      toString() {
        // todo
      },
    };
    next();
  };
}
