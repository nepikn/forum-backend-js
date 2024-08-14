import Router from "../util/router";
import CommentController from "../controllers/comment";

const commentController = new CommentController();
export const comment = new Router(commentController)
  .post()
  .get("", commentController.getAll)
  .get("/length", commentController.getLength)
  .put("/:id")
  .delete("/:id");
