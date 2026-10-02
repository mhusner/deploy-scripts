require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.APP_PORT, 10) || 8080,
  logLevel: process.env.LOG_LEVEL || 'info',
  aws: {
    region: process.env.AWS_DEFAULT_REGION,
    bucket: process.env.AWS_S3_BUCKET,
    sesFrom: process.env.AWS_SES_FROM,
  },
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  redisUrl: process.env.REDIS_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  },
};
