import Controller from "../controllers/_temp";
import Router from "../util/router";

export const router = new Router(new Controller());

router.post().get().put().delete();
