import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { GoodsModule } from './goods/goods.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { PermissionGuard } from './common/guard/permission.guard';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import customConfig from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [customConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 数据库配置项依赖于ConfigModule，需在此引入
      useFactory: (configService: ConfigService) =>
        configService.get('DATABASE_CONFIG'),
        inject: [ConfigService], // 记得注入服务，不然useFactory函数中获取不到ConfigService
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres', //数据库类型
    //   host: process.env.DB_HOST, // host
    //   port: Number(process.env.DB_PORT), // 端口
    //   username: process.env.DB_USER, //账号
    //   password: process.env.DB_PASSWORD, //密码
    //   database: process.env.DB_DATABASE, //库名
    //   ssl: IS_DEV ? false : true,
    //   synchronize: true, //自动将实体类同步到数据库
    //   autoLoadEntities: true, //将自动加载实体forFeature()方法注册的每个实体都将自动添加到配置对象的实体
    // }),
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
    //   // cache: true,
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
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
