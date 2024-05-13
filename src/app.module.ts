import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PersonnelModule } from './personnel/personnel.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', //数据库类型
      host: 'localhost', // host
      port: 3306, //端口
      username: 'root', //账号
      password: '', //密码
      database: 'lina', //库名
      // entities: [], //实体文件
      synchronize: true, //自动讲实体类同步到数据库
      autoLoadEntities: true, //将自动加载实体forFeature()方法注册的每个实体都将自动添加到配置对象的实体
    }),
    UserModule,
    PersonnelModule,
    AuthModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
