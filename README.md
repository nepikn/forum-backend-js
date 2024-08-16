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
|                    | DELETE |
| /seseion/authState | GET    |
| /user              | POST   |
|                    | PUT    |
| /comment           | POST   |
|                    | GET    |
| /comment/length    | GET    |
| /comment/:id       | PUT    |
| /comment/:id       | DELETE |

## 主要技術

- Apache v2
- Express v4
- MySQL v8
- Sequelize v6

## 安裝

```bash
GREY="\e[90m"
NC="\e[0m"

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
git clone git@github.com:nepikn/$project.git

cd $dest
node util/init.js
# todo: config apache

read -p "Enter the password of the MySQL user 'admin': " password
sed -i "s/auth_string/$password/g" config/db.json
mysql -u root < db/init.sql
npm run db:migrate
npm run db:seed:all
sudo systemctl restart mysql
```

## 學習內容

- [學習歷程 - Apache](https://hackmd.io/o_t2Xo_tR-m5VU2Yd2xFsg?view)
- [學習歷程 - MySQL](https://hackmd.io/IGSwDtGbShqUfFx2O1djTQ?view)
- Express
- Sequelize
