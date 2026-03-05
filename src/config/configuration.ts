export default () => ({
  nodeEnv: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'mysql',
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER || 'mysql',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'mysql',
  },
  jwt: {
    accessToken: process.env.CLIENT_ACCESS_TOKEN,
  },
});
