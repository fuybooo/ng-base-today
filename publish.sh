yarn b;
cp ./404.html ./dist/ng-base-today/404.html;
git add dist --force;
git commit -m "发布打包";
git subtree push --prefix dist/ng-base-today origin gh-pages;
