import mysql from "mysql2/promise";

export default class Db {
  static pool = mysql.createPool({
    user: "root",
    database: "forum",
  });

  table;

  constructor(table) {
    this.table = table;
  }

  // insert(props) {
  //   return this.handleQuery(
  //     "INSERT INTO this.table (%s) VALUES (%s)",
  //     [
  //       'format_vals' => [
  //         join(', ', array_keys(props)),
  //         '?' . str_repeat(', ?', count(props) - 1)
  //       ],
  //       'params' => array_values(props),
  //     ],
  //     fn () => this.query('SELECT LAST_INSERT_ID() AS id')['id'],
  //   );
  // }

  static select = [
    (req, res, next) => {
      const { table, cols } = req.sql;

      req.sql.base =
        `SELECT ${cols?.join(", ") ?? "*"} FROM ${table} ` + req.sql.base;

      next();
    },
    Db.query,
    (req, res, next) => {
      res.body = ((result) => (result.length == 1 ? result[0] : result))(
        res.body
      );

      next();
    },
  ];

  // update(props, conds) {
  //   assignment = join(', ', array_map(
  //     fn (key) => "key = ?",
  //     array_keys(props)
  //   ));

  //   return this.handleQuery(
  //     "UPDATE this.table SET %s",
  //     [
  //       'format_vals' => [assignment],
  //       'params' => array_values(props),
  //       'conds' => conds,
  //     ],
  //     () use (props) {
  //       return count(props) == 1 ? array_values(props)[0] : props;
  //     }
  //   );
  // }

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

    try {
      const [result, fields] = await (params
        ? Db.pool.execute(sql, params)
        : Db.pool.query(sql));

      res.body = result === true ? null : result;

      next();
    } catch (error) {
      next(error);
    }
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
