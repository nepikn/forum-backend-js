import Controller from "../util/controller";
import Db from "../util/db";

export default class CommentController extends Controller {
  constructor() {
    super("comments");
  }

  post(req, res, next) {
    res.end();
  }

  get = [
    (req, res, next) => {
      const { page = 1, commentPerPage = 5 } = req.query;

      // return this.db.query(`
      req.sql.base = `
        AS c
        INNER JOIN (
          SELECT id AS user_id, name AS commentator FROM users
        ) AS u
        ON c.user_id = u.user_id
        -- WHERE is_deleted IS NULL -- if soft deleting
        -- AND c.id <= cursor -- todo: cursor-based pagination
        ORDER BY c.id DESC
        LIMIT ${(page - 1) * commentPerPage}, ${commentPerPage}
      `;

      next();
    },
    Db.select,
  ];

  getLength = [
    ({ sql }, res, next) => {
      sql.cols = ["COUNT(*)"];

      next();
    },
    Db.select,
  ];

  put(req, res, next) {
    res.end();
  }

  delete(req, res, next) {
    res.end();
  }
}
