# 留言板 - JS 後端

前後端分離、部署於 AWS EC2、在 Cloudflare 註冊域名的 MPA

> [前端說明](https://github.com/nepikn/forum-frontend?tab=readme-ov-file#readme-ov-file)

> [另有 PHP 語法的後端](https://github.com/nepikn/forum-backend?tab=readme-ov-file#readme-ov-file)

- [API](#api)
- [主要技術](#主要技術)
- [安裝](#安裝)
- [學習內容](#學習內容)

## API

| 路徑               | 方法   |
| ------------------ | ------ |
| /seseion           | POST   |
| /seseion           | DELETE |
| /seseion/authState | GET    |
| /user              | POST   |
| /user              | PUT    |
| /comment           | POST   |
| /comment           | GET    |
| /comment/length    | GET    |
| /comment/:id       | PUT    |
| /comment/:id       | DELETE |

## 主要技術

- Express v4
- MySQL v8
- Sequelize v6

## 安裝

```bash
export NODE_ENV=production

# style
GREY="\e[90m"
NC="\e[0m"

# read inputs
dir=/var/www/
project=forum-backend-js

echo -en "Install '$project' to: ${GREY}($dir)${NC} "
read ans
mkdir -p ${ans:=$dir}
cd $ans

dest=$project/
if [[ "$(ls -A $dest)" ]]; then
  echo -en "Remove '$dest'? ${GREY}(Y)${NC} "
  read ans
  rm $dest -fr
fi

read -p "Enter the password of the MySQL user 'admin': " password

# init
git clone git@github.com:nepikn/$project.git
cd $dest
npm install
node start/session.js

sed -i "s/auth_string/$password/g" config/db.json start/db.sql
sudo mysql -u root < start/db.sql
npm run db:migrate
npm run db:seed:all
sudo systemctl restart mysql
```

## 學習內容

- [學習歷程 - MySQL](https://hackmd.io/IGSwDtGbShqUfFx2O1djTQ?view)
- 代理 `express.Router` 以實現預設 middleware

```js
// util/router.js
export default class Router {
  targetRouter = express.Router();
  // ...

  constructor(controller) {
    // ...

    return new Proxy(this.targetRouter, {
      get: (target, p, receiver) => {
        if (["post", "get", "put", "delete"].includes(p)) {
          return (path = "", ...handlers) => {
            this.setMiddleware(p, path, handlers);

            return receiver;
          };
        }
        return target[p];
      },
    });
  }
}
```

```js
// routers/comment.js
const commentController = new CommentController();
export const comment = new Router(commentController)
  .post()
  .get("", commentController.getAll)
  .get("/length", commentController.getLength)
  .put("/:id")
  .delete("/:id");
```

- 調整 `sequelize-cli` 生成的 model 使其相互關聯

```js
// db/models/user.cjs
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Comment);
    }
  }

  // ...
};
```

- 藉由 `Sequelize.Model` 處理 HTTP 請求

```js
// controllers/comment.js
export default class CommentController extends Controller {
  // ...

  post(req, res, next) {
    const sessionUserId = req.session.user.id;

    this.model
      .create({ content: req.query["content"], UserId: sessionUserId })
      .then((comment) => {
        res.json(comment.id);
      })
      .catch(next);
  }

  // ...
}
```
