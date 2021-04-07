#!/usr/bin/env sh

# abort on errors
set -e

rm -rf dist

npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'
git branch -M main
# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
# git push -f git@github.com:martinageradams/vue-cesium-vite-app.git main:pages
# git push -f git@gitee.com:martinageradams/vue-cesium-vite-app.git main:pages
cd -
git add .
git commit -m 'deploy'
git push