## angular项目模板升级

## 步骤
### 创建项目，测试能否启动
1. ng new ng-base-pro --skip-install --skip-tests
2. cd ng-base-pro
3. yarn
4. yarn start

### pack.json
1. 修改执行脚本 -- 脚本需要新增一个文件，后续介绍
2. 新增必要的安装包

### angular.json
1. 修改属性 schematics
```json
        "schematics": {
          "@schematics/angular:component": {
            "spec": false,
            "styleext": "less"
          },
          "@schematics/angular:class": {
            "spec": false
          },
          "@schematics/angular:directive": {
            "spec": false
          },
          "@schematics/angular:guard": {
            "spec": false
          },
          "@schematics/angular:module": {
            "spec": false
          },
          "@schematics/angular:pipe": {
            "spec": false
          },
          "@schematics/angular:service": {
            "spec": false
          }
        }
```
2. 修改属性 styles
```json
          "styles": [
                      "node_modules/ng-zorro-antd/src/ng-zorro-antd.min.css",
                      "src/styles.less"
                    ]
```
### polyfills.ts
1. 将一部分注释掉的代码解注释

### index.html
1. 加入一些脚本以便发布
### 新增package-version.js
1. 在打包之前会运行此脚本，在index.html中加入打包时间
### 404.html
### publish.sh
### commit.sh
### bs-config.json

### 脚本
1. 运行程序 yarn start
2. 打一个本地测试的包 yarn bl
3. 运行本地 yarn l
4. 打包，并发布到git hub 的pages上 yarn p
5. 提交代码 yarn c
