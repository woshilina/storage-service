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
7. 基于RBAC模型实现权限管理，RBAC模型具有简化权限管理、灵活的角色与权限关系、提高安全性和易于扩展等优点。中心思想是通过将权限分配给➡角色，再将角色分配给➡用户，来实现对系统资源的访问控制。三大 crud是 用户user、角色role、权限permission。用户的登录验证成功还会将用户的权限编码 permission code 以数组形式返给前端
   - 在user Crud实体文件即user.entry.ts中通过TypeORM多对多装饰器@ManyToMany(() => Role)及@JoinTable()用户角色关系表，名称为user-roles-role。
   - 在role Crud实体文件即role.entry.ts中通过TypeORM多对多装饰器@ManyToMany(() => Permission)及@JoinTable()生成角色权限关系表，名称为 role-permissions-permission。
8. 自定义权限守卫 permission guard，结合权限装饰器@RequirePermission([code])判断用户是否有访问接口权限
9. 安装依赖class-validator class-transformer，使用ValidationPipe进行参数验证
10. 支持列表自定义排序功能，可按照不同的字段排序(升序ASC或降序DESC)，需前端传入参数 sortBy(排序字段名称)和orderBy(排序类别ASC或DESC)
11. 添加@nestjs/swagger，生成接口文档 [接口文档地址](https://storage-service-6evx.onrender.com/api)



## 遇到的问题
1. 部署时应配置 cors 解决跨域问题