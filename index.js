import cors from "cors";
import express from "express";
import routers from "./routers";
import session from "express-session";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config({
  path: [`.env.${process.env.NODE_ENV ?? "development"}`, ".env"],
});

const app = express();
const port = process.argv[2] ?? 3000;
const secret = process.env.COOKIE_SECRET;

app.use(cookieParser(secret));
app.use(session({ secret, resave: false, saveUninitialized: false }));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(",").concat(
      /^http:\/\/localhost(:\d+)?$/
    ),
    credentials: true,
  })
);
// app.use((req, res, next) => {
//   console.log(req);
//   next();
// });
// console.log(process.env.NODE_ENV);

for (const key of Object.keys(routers)) {
  app.use(`${process.env.API_BASE ?? ""}/${key}`, routers[key]);
}
app.use(function response(req, res, next) {
  const { body, prop } = res;

  if (body === undefined) {
    res.end();
  } else {
    res.json(prop ? body[prop] : body);
  }
});

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
