import express from "express";
import routers from "./routers";

const app = express();
const port = 3000;

for (const key of Object.keys(routers)) {
  app.use(`/${key}`, routers[key]);
}
app.use((req, res, next) => {
  if (res.body === undefined) {
    res.status(500).send("no body");
  } else {
    res.send(Number.isFinite(res.body) ? `${res.body}` : res.body);
  }
});

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
