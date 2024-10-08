import db from "../db/models/index.cjs";
import Controller from "../util/controller";

export default class CommentController extends Controller {
  constructor() {
    super("Comment");
  }

  post(req, res, next) {
    const sessionUserId = req.session.user.id;

    this.model
      .create({ content: req.query["content"], UserId: sessionUserId })
      .then((comment) => {
        res.json(comment.id);
      })
      .catch(next);
  }

  getAll(req, res, next) {
    const { page = 1, commentPerPage = 5 } = req.query;

    this.model
      .findAll({
        include: db.User,
        order: [["id", "DESC"]],
        offset: (page - 1) * commentPerPage,
        limit: +commentPerPage,
      })
      .then((comments) => {
        res.json(
          comments.map(({ id, content, User }) => ({
            id,
            content,
            user_id: User.id,
            commentator: User.name,
          }))
        );
      })
      .catch(next);
  }

  getLength(req, res, next) {
    this.model
      .count()
      .then((length) => res.json(length))
      .catch(next);
  }

  put(req, res, next) {
    req.fields = ["content"];

    super.put(req, res, next);
  }

  delete(req, res, next) {
    this.verifyUser(req, res)
      .then((comment) => {
        if (!comment) return;

        return comment.destroy();
      })
      .then((delCount) => res.end())
      .catch(next);
  }
}
