export default class CommentController {
  post(req, res, next) {
    res.end();
  }

  get(req, res, next) {
    res.send("oh hi");
  }

  put(req, res, next) {
    res.end();
  }

  delete(req, res, next) {
    res.end();
  }
}
