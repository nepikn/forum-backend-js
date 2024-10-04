import SessionController from "../controllers/session";
import Router from "../util/router";

const sessionController = new SessionController();
export const session = new Router(sessionController)
  .post()
  .get("/authState", sessionController.getAuthState)
  .put()
  .delete();
