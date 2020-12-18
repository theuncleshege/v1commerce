module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.JEST_WORKER_ID
    ? `v1commercetest_${process.env.JEST_WORKER_ID}`
    : process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNC || true,
  migrationsRun: !process.env.JEST_WORKER_ID,
  logging: process.env.NODE_ENV === 'production' ? false : 'error',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};
