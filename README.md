## 简易微信

### 实现的功能
1. 登录页，定时切换页面
2. 国际化切换，支持简体中文，繁体中文和英文三种语言
3. 微信聊天窗口展示
4. 模拟发送消息，支持选择文件发送
5. 发送表情
6. 自动回复信息


## 搭建项目步骤
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

#### 需要增加的功能
1. 监听路由变化，关闭弹出框
2. 监听keyup事件，esc 按键弹起时关闭弹出层

## 2018-11-30
#### 微信功能
1. 切换tab                         √ 2018-11-30
2. 搜索                            √ 2018-12-01
3. 左侧菜单下拉                     √ 2018-12-01
4. 下载微信的关闭功能                
5. 消息数据的处理                   √ 2018-12-01
6. 标题的下拉                       √ 2018-12-01
7. 多条消息的显示                   √ 2018-12-01
8. 表情符号                         √ 2018-12-01
9. 截图
10. 选择文件                        √ 2018-12-01
11. 发送消息                        √ 2018-12-07
12. 自动回复                        √ 2018-12-07
13. 扫码登录                        √ 2018-12-06
14. 国际化                          √ 2018-12-07
15. 下载宣传页动画效果

## 2018-12-08
#### 简易抽奖系统
1. 需求
  1. 实现一个可以从一个公司的名单中抽取各种等级的奖的系统。
  2. 抽奖名单用excel文件导入
  3. 不重复的随机抽取一等奖、二等奖和三等奖

