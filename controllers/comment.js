import Controller from "../util/controller";

export default class CommentController extends Controller {
  constructor() {
    super("comments");
  }

  post(req, res, next) {
    res.end();
  }

  get(req, res, next) {
    const { page = 1, commentPerPage = 5 } = req.query;

    return this.db.query(`
      SELECT * FROM comments AS c
      INNER JOIN (
        SELECT id AS user_id, name AS commentator FROM users
      ) AS u
      ON c.user_id = u.user_id
      -- WHERE is_deleted IS NULL -- if soft deleting
      -- AND c.id <= cursor -- todo: cursor-based pagination
      ORDER BY c.id DESC
      LIMIT ${(page - 1) * commentPerPage}, ${commentPerPage}
    `);
  }

  put(req, res, next) {
    res.end();
  }

  delete(req, res, next) {
    res.end();
  }
}
