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

  static async insert() {
    const [result, fields] = await Db.pool.query(
      "INSERT INTO test.users (name) VALUES ('uwu')"
    );

    console.log([result, fields]);
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
    ({ sql }, res, next) => {
      const { table, cols } = sql;

      sql.base = `SELECT ${cols?.join(", ") ?? "*"} FROM ${table} ${sql.base}`;

      next();
    },
    Db.query,
    Db.extractResult,
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
    console.log([sql, params]);

    try {
      const [result, fields] = await (params
        ? Db.pool.execute(sql, params)
        : Db.pool.query(sql));

      res.body = result.length == 0 ? null : result;
      console.log(res.body);

      next();
    } catch (error) {
      next(error);
    }
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
