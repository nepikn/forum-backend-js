import express from "express";
import routers from "./routers";

const app = express();
const port = 3000;

for (const key of Object.keys(routers)) {
  app.use(`/${key}`, routers[key]);
}
app.use((req, res, next) => {
  res.send(res.body);
});

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
