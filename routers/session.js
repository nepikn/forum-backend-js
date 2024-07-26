import Router from "../util/router";
import SessionController from "../controllers/session";

export const session = new Router(new SessionController());

session.post().get("/:prop").put().delete();
