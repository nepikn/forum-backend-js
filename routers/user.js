import Router from "../util/router";
import UserController from "../controllers/user";

const userController = new UserController();
export const user = new Router(userController).post().get().get("/:prop").put();
// .delete();
