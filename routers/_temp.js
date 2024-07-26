import Router from "../util/router";
import Controller from "../controllers/_temp";

export const _temp = new Router(new Controller());

_temp.post().get().put().delete();
