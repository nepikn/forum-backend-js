import shelljs from "shelljs";
import crypto from "crypto";

shelljs
  .echo(`COOKIE_SECRET=${crypto.randomBytes(32).toString("hex")}`)
  .toEnd(".env.production");
