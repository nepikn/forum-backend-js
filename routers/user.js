import Router from "../util/router";
import UserController from "../controllers/user";
import SessionController from "../controllers/session";

const userController = new UserController();
export const user = new Router(userController)
  .use(SessionController.init)
  .post()
  .get()
  .get("/:prop")
  .put()
  .delete();
