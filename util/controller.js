import Db from "./db";

export default class Controller {
  db;

  constructor(table) {
    this.db = new Db(table);
  }
}
