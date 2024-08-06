import Controller from "../util/controller";
import Db from "../db/query";

export default class CommentController extends Controller {
  constructor() {
    super("comments");
  }

  post = [
    (req, res, next) => {
      const sessionUserId = req.session.user.id;
      if (!sessionUserId) {
        throw new Error("no session user id");
      }

      req.sql.cols = ["user_id", "content"];
      req.sql.params = [sessionUserId, req.query["content"]];

      next();
    },
    Db.insert,
  ];

  get = [
    (req, res, next) => {
      const { page = 1, commentPerPage = 5 } = req.query;

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

  put = [
    (req, res, next) => {
      req.query = { content: req.query["content"] };

      req.sql.cols = Object.keys(req.query);
      req.sql.params = Object.values(req.query);
      req.sql.conds = { id: req.params.id };

      next();
    },
    Db.update,
  ];

  delete = [
    (req, res, next) => {
      req.sql.conds = { id: req.params.id };

      next();
    },
    Db.select,
    (req, res, next) => {
      if (!res.body || req.session.user.id != res.body.user_id) {
        return res.sendStatus(400);
      }

      next();
    },
    Db.delete,
  ];
}
