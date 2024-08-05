import mysql from "mysql2/promise";

export default class Db {
  static pool = mysql.createPool({
    user: "root",
    database: "forum",
  });

  // table;

  // constructor(table) {
  //   this.table = table;
  // }

  static insert = [
    ({ sql }, res, next) => {
      const { table, cols } = sql;

      sql.base = `INSERT INTO ${table} (${cols.join(
        ", "
      )}) VALUES (?${", ?".repeat(cols.length - 1)})`;

      next();
    },
    Db.query,
    Db.respondInsertId,
  ];

  static select = [
    ({ sql }, res, next) => {
      const { table, cols } = sql;

      sql.base = `SELECT ${cols?.join(", ") ?? "*"} FROM ${table} ${sql.base}`;

      next();
    },
    Db.query,
    Db.extractResult,
  ];

  static update = [
    ({ sql }, res, next) => {
      const { table, cols } = sql;

      sql.base = `UPDATE ${table} SET ${cols
        .map((col) => `${col} = ?`)
        .join(", ")}`;

      next();
    },
    Db.query,
    (req, res, next) => {
      const vals = Object.values(req.query);

      res.body = vals.length == 1 ? vals[0] : req.query;

      next();
    },
  ];

  // delete(id) {
  //   return this.handleQuery(
  //     "DELETE FROM this.table",
  //     [
  //       'conds' => ['id' => id],
  //     ],
  //   );
  // }

  static async query(req, res, next) {
    const sql = req.sql.toString();
    const { params } = req.sql;
    console.log([sql, params]);

    try {
      const [result, fields] = await (params
        ? Db.pool.execute(sql, params)
        : Db.pool.query(sql));
      // console.log(result);

      res.body = result.length == 0 ? null : result;

      next();
    } catch (error) {
      next(error);
    }
  }

  static respondInsertId(req, res, next) {
    res.body = res.body.insertId;

    next();
  }

  static extractResult(req, res, next) {
    if (res.body?.length == 1) {
      const result = res.body[0];
      const vals = Object.values(result);

      res.body = vals.length == 1 ? vals[0] : result;
    }

    next();
  }
}

export class Sql {
  static where(conds) {
    return conds
      ? ` WHERE ${Object.entries(conds)
          .map(([col, val]) => `${col} = ${val}`)
          .join(" AND ")}`
      : "";
  }
}
