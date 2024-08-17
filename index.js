import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import routers from "./routers";

const { parsed: env } = config({
  path: [`.env.${process.env.NODE_ENV ?? "development"}`, ".env"],
});
const app = express();
const port = process.argv[2] ?? 3000;
const secret = env.COOKIE_SECRET;

app.use(helmet());
app.use(express.json());
app.use(cookieParser(secret));
app.use(
  session({
    secret,
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true, httpOnly: true },
  })
);
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(",").concat(
      /^http:\/\/localhost(:\d+)?$/
    ),
    credentials: true,
  })
);
// app.use((req, res, next) => {
//   console.log(req);
//   next();
// });
// console.log(env.NODE_ENV);

for (const key of Object.keys(routers)) {
  app.use(`${env.API_BASE ?? ""}/${key}`, routers[key]);
}
app.use(function handleErr(err, req, res, next) {
  if (Number.parseInt(err.message)) {
    res.sendStatus(err.message);
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
