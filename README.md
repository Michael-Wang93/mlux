#依赖
1. npm   cnpm
2. typescript
3. mongodb

#程序运行步骤
0. 记得先mongod打开mongodb服务
1. 根目录cnpm install跑下
2. cd assets    cnpm install 跑下
3.  cd assets  webpack --config ./webpack.config.js
4. 然后根目录  tsc
5. 然后node ./bin/app.js
默认地址0.0.0.0:3000/app/index 用户密码 admin  admin
