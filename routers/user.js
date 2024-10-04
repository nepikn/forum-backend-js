import UserController from "../controllers/user";
import Router from "../util/router";

const userController = new UserController();
export const user = new Router(userController)
  .post()
  .get()
  .get("/:prop")
  .put();
// .delete();
