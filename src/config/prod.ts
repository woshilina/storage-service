export default {
  // 端口
  port: parseInt(process.env.PORT, 10) || 3000,
  // 是否开启swagger
  enableSwagger: true,
  // 数据库配置
  DATABASE_CONFIG: {
    type: 'postgres',
    host: 'ep-twilight-hall-a19e1f05.ap-southeast-1.aws.neon.tech',
    port: 5432,
    username: 'neondb_owner',
    password: 'oCL3BFXgla2f',
    database: 'neondb',
    ssl: true,
    synchronize: true, //自动将实体类同步到数据库
    autoLoadEntities: true, //将自动加载实体forFeature()方法注册的每个实体都将自动添加到配置对象的实体
  },
};
