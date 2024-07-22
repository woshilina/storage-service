import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { GoodsModule } from './goods/goods.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
// import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', //数据库类型
      host: 'ep-twilight-hall-a19e1f05.ap-southeast-1.aws.neon.tech', // host
      port: 5432, //端口
      username: 'neondb_owner', //账号
      password: 'oCL3BFXgla2f', //密码
      database: 'neondb', //库名
      cache: true,
      ssl: true,
      synchronize: true, //自动将实体类同步到数据库
      autoLoadEntities: true, //将自动加载实体forFeature()方法注册的每个实体都将自动添加到配置对象的实体
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres', //数据库类型
    //   host: 'localhost', // host
    //   port: 5432, //端口
    //   username: 'postgres', //账号
    //   password: 'lina', //密码
    //   database: 'runoobdb', //库名
    //   // entities: [], //实体文件
    //   synchronize: true, //自动将实体类同步到数据库
    //   autoLoadEntities: true, //将自动加载实体forFeature()方法注册的每个实体都将自动添加到配置对象的实体
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql', //数据库类型
    //   host: 'localhost', // host
    //   port: 3306, //端口
    //   username: 'root', //账号
    //   password: '', //密码
    //   database: 'lina', //库名
    //   cache: true,
    //   synchronize: true, //自动将实体类同步到数据库
    //   autoLoadEntities: true, //将自动加载实体forFeature()方法注册的每个实体都将自动添加到配置对象的实体
    // }),
    UserModule,
    GoodsModule,
    AuthModule,
    PermissionModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe,
    // },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
