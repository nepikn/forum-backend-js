import Router from "../util/router";
import UserController from "../controllers/user";

export const user = new Router(new UserController());

user.post().get().get("/:prop").put().delete();
