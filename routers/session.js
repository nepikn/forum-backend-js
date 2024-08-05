import Router from "../util/router";
import SessionController from "../controllers/session";

const sessionController = new SessionController();
export const session = new Router(sessionController)
  .use(SessionController.init)
  .post()
  .get("/authState", sessionController.getAuthState)
  .put()
  .delete();
