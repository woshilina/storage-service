import developmentConfig from './dev';
import productionConfig from './prod';

const configs = {
  dev: developmentConfig,
  prod: productionConfig,
};
const env = process.env.NODE_ENV || 'dev';

export default () => configs[env];
