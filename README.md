# storage-service

[线上体验](https://storage-front-8ecz.onrender.com/)
账号：ceshi 密码：123456

## 项目介绍
1. 此项目为后台项目，对应的前端项目为[storage-front](https://github.com/woshilina/storage-front)
2. 此项目技术栈：NestJS + TypeORM，数据库postgres
3. 接口采用 RESTful API 风格
4. 使用passport-local插件进行登录验证，验证成功将 token 和 refreshtoken 返给前端
5. 基于jwt身份验证，将身份验证保护注册为 全局守卫，自定义的 @Public() 装饰器，将路由声明为公共的机制
6. 使用bcryptjs用于用户密码加密
7. 自定义权限守卫 permission guard，结合权限装饰器@RequirePermission([code])判断用户是否有访问接口权限


## 遇到的问题
1. 部署时应配置 cors 解决跨域问题