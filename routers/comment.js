import Router from "../util/router";
import CommentController from "../controllers/comment";

export const comment = new Router(new CommentController());

comment.post().get().get("/length").put("/:id").delete("/:id");
