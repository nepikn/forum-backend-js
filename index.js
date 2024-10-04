import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import routers from "./routers";

const { parsed: env } = config({
  path: [`.env.${process.env.NODE_ENV}`, ".env"],
});
const app = express();
const port = env.PORT ?? 3000;
const secret = env.COOKIE_SECRET;
const isProd = env.NODE_ENV == "production";

app.use(morgan(isProd ? "tiny" : "dev"));
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
  }),
);

if (!isProd) {
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
}

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

// isProd
//   ? https.createServer(
//       {
//         cert: env.CERT,
//         key: env.KEY,
//         // cert: readFileSync(env.CERT),
//         // key: readFileSync(env.KEY),
//       },
//       app,
//     )
//   : app;

app.listen(port, () => {
  console.log(`running on port: ${port}`);
});
